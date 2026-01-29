package com.PCRS.pcrs1.controller;

import com.PCRS.pcrs1.dto.PcrsDTOs.DocumentDTO;
import com.PCRS.pcrs1.model.Document;
import com.PCRS.pcrs1.model.Case;
import com.PCRS.pcrs1.model.User;
import com.PCRS.pcrs1.service.DocumentService;
import com.PCRS.pcrs1.service.CaseService;
import com.PCRS.pcrs1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    private DocumentService service;

    @Autowired
    private CaseService caseService;

    @Autowired
    private UserService userService;

    @Value("${server.port:8080}")
    private int serverPort;

    /**
     * POST: /api/documents/upload
     * This handles the Multipart file upload from your React frontend.
     */
    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('DESK_OFFICER', 'INVESTIGATOR', 'ADMIN', 'SUPERVISOR')")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam Map<String, String> params,
            Principal principal) {

        try {
            if (file == null || file.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is missing");
            }

            String rawCaseId = params.getOrDefault("caseId", params.get("case_id"));
            String rawCaseNumber = params.getOrDefault("caseNumber", params.get("case_number"));

            Integer caseNumber = null;
            if (rawCaseNumber != null && !rawCaseNumber.trim().isEmpty()) {
                try {
                    caseNumber = Integer.valueOf(rawCaseNumber.trim());
                } catch (NumberFormatException ignored) {
                }
            }

            Case caseEntity = null;
            if (rawCaseId != null && !rawCaseId.trim().isEmpty()) {
                String cleanId = rawCaseId.trim();
                caseEntity = caseService.getById(cleanId);
                
                // If not found, check if it's a Case Number format (e.g. C-123 or just 123)
                // First, try Native Lookup to bypass Hibernate cache issues (Ghost Records)
                if (caseEntity == null) {
                    caseEntity = caseService.getByIdNative(cleanId);
                }

                if (caseEntity == null) {
                    Integer extractedNum = null;
                    if (cleanId.matches("\\d+")) {
                        extractedNum = Integer.valueOf(cleanId);
                    } else if (cleanId.toUpperCase().startsWith("C-") && cleanId.substring(2).matches("\\d+")) {
                        extractedNum = Integer.valueOf(cleanId.substring(2));
                    } else if (cleanId.toUpperCase().startsWith("PCRS-") && cleanId.substring(5).matches("\\d+")) {
                        extractedNum = Integer.valueOf(cleanId.substring(5));
                    }
                    
                    if (extractedNum != null) {
                         caseEntity = caseService.getByCaseNumber(extractedNum);
                    }
                }

                // Retry if not found immediately (Race condition fix)
                if (caseEntity == null) {
                    try {
                        Thread.sleep(500);
                        caseEntity = caseService.getById(cleanId); // Retry UUID
                        if (caseEntity == null) {
                             // Retry number lookup if applicable
                             Integer extractedNum = null;
                             if (cleanId.matches("\\d+")) extractedNum = Integer.valueOf(cleanId);
                             else if (cleanId.toUpperCase().startsWith("C-") && cleanId.substring(2).matches("\\d+")) extractedNum = Integer.valueOf(cleanId.substring(2));
                             
                             if (extractedNum != null) caseEntity = caseService.getByCaseNumber(extractedNum);
                        }
                    } catch (InterruptedException e) {}
                }
            }
            if (caseEntity == null && caseNumber != null) {
                caseEntity = caseService.getByCaseNumber(caseNumber);
                // Retry if not found immediately
                if (caseEntity == null) {
                    try {
                        Thread.sleep(500);
                        caseEntity = caseService.getByCaseNumber(caseNumber);
                    } catch (InterruptedException e) {}
                }
            }
            if (caseEntity == null) {
                User currentUser = null;
                
                // 1. Try to find user by Token ID (Preferred)
                if (principal instanceof JwtAuthenticationToken jwtAuth) {
                    String userId = jwtAuth.getToken().getSubject();
                    // Use NATIVE check to bypass cache
                    if (userService.existsByIdNative(userId)) {
                        currentUser = userService.getById(userId);
                    }
                }

                // 2. Fallback to Username
                if (currentUser == null && principal != null) {
                    String username = principal.getName();
                    // Use NATIVE lookup to ensure we get the correct DB user
                    currentUser = userService.getByUsernameNative(username);
                }

                if (currentUser != null) {
                    caseEntity = caseService.getLatestForUser(currentUser);
                    if (caseEntity != null) {
                         logger.info("Found latest case {} for user {}", caseEntity.getCaseId(), currentUser.getUsername());
                    } else {
                         logger.warn("No latest case found for user {}", currentUser.getUsername());
                    }
                } else {
                    logger.warn("User not found for upload fallback. Principal: {}", principal != null ? principal.getName() : "null");
                }
            }
            if (caseEntity == null) {
                logger.error("Upload failed: Case not found. Params: caseId={}, caseNumber={}, User={}", 
                        rawCaseId, rawCaseNumber, (principal != null ? principal.getName() : "null"));
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found for upload");
            }

            // Flexible mapping for metadata
            String type = params.getOrDefault("typeOfDocument", params.getOrDefault("type", "General Document"));
            String storage = params.getOrDefault("locationOfTheStorage", "Registry Storage");

            Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "documents");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalName = file.getOriginalFilename();
            String storedFileName = UUID.randomUUID().toString() + "_" + (originalName != null ? originalName : "file");
            Path targetPath = uploadDir.resolve(storedFileName);
            file.transferTo(targetPath.toFile());

            Document document = new Document();
            document.setDocumentId("DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            document.setCaseEntity(caseEntity);
            document.setTypeOfDocument(type);
            document.setFileName(originalName);
            document.setDate(LocalDate.now());
            document.setDigitalFilePath(targetPath.toString());
            document.setLocationOfTheStorage(storage);

            Document saved = service.save(document);
            logger.info("Saved document: {}", saved.getDocumentId());

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Upload failed: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Upload error: " + e.getMessage());
        }
    }

    @GetMapping("/view/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Resource> viewDocument(@PathVariable String id) {
        try {
            Document document = resolveDocument(id);
            if (document == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found");
            }
            String pathString = document.getDigitalFilePath();
            if (pathString == null || pathString.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File path not stored for document");
            }

            Path baseUploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "documents");
            Path path = Paths.get(pathString);
            if (!path.isAbsolute()) {
                if (pathString.contains("uploads") || pathString.contains("documents")) {
                    path = Paths.get(System.getProperty("user.dir")).resolve(pathString).normalize();
                } else {
                    if (!Files.exists(baseUploadDir)) {
                        Files.createDirectories(baseUploadDir);
                    }
                    path = baseUploadDir.resolve(pathString).normalize();
                }
            }
            if (!Files.exists(path)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found on server");
            }

            byte[] data = Files.readAllBytes(path);
            ByteArrayResource resource = new ByteArrayResource(data);

            String filename = document.getFileName() != null ? document.getFileName() : "document";
            String mime = Files.probeContentType(path);
            MediaType mediaType = (mime != null) ? MediaType.parseMediaType(mime) : MediaType.APPLICATION_OCTET_STREAM;

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String id) {
        try {
            Document document = resolveDocument(id);
            if (document == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found");
            }
            String pathString = document.getDigitalFilePath();
            if (pathString == null || pathString.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File path not stored for document");
            }

            Path baseUploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "documents");
            Path path = Paths.get(pathString);
            if (!path.isAbsolute()) {
                if (pathString.contains("uploads") || pathString.contains("documents")) {
                    path = Paths.get(System.getProperty("user.dir")).resolve(pathString).normalize();
                } else {
                    if (!Files.exists(baseUploadDir)) {
                        Files.createDirectories(baseUploadDir);
                    }
                    path = baseUploadDir.resolve(pathString).normalize();
                }
            }
            if (!Files.exists(path)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found on server");
            }

            byte[] data = Files.readAllBytes(path);
            ByteArrayResource resource = new ByteArrayResource(data);

            String filename = document.getFileName() != null ? document.getFileName() : "document";
            String mime = Files.probeContentType(path);
            MediaType mediaType = (mime != null) ? MediaType.parseMediaType(mime) : MediaType.APPLICATION_OCTET_STREAM;

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/view")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Resource> viewDocumentAlt(@PathVariable String id) {
        return viewDocument(id);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Resource> downloadDocumentAlt(@PathVariable String id) {
        return downloadDocument(id);
    }

    /**
     * PUT: /api/documents/{id}
     * Re-added to handle metadata updates.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DESK_OFFICER', 'INVESTIGATOR', 'ADMIN', 'SUPERVISOR')")
    public ResponseEntity<DocumentDTO> update(@PathVariable String id, @RequestBody DocumentDTO dto) {
        Document existing = service.getById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found");
        }

        existing.setTypeOfDocument(dto.getTypeOfDocument());
        existing.setFileName(dto.getFileName());
        existing.setDigitalFilePath(dto.getDigitalFilePath());
        existing.setLocationOfTheStorage(dto.getLocationOfTheStorage());

        if (dto.getCaseId() != null) {
            Case c = caseService.getById(dto.getCaseId());
            if (c != null) existing.setCaseEntity(c);
        }

        Document updated = service.save(existing);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<DocumentDTO>> listByCaseId(@PathVariable String caseId) {
        return ResponseEntity.ok(service.listByCaseId(caseId).stream()
                .map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> listAll() {
        return ResponseEntity.ok(service.listAll().stream()
                .map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(convertToDTO(service.getById(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DESK_OFFICER', 'INVESTIGATOR', 'ADMIN', 'SUPERVISOR')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private DocumentDTO convertToDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setDocumentId(document.getDocumentId());
        if (document.getCaseEntity() != null) {
            dto.setCaseId(document.getCaseEntity().getCaseId());
        }
        dto.setTypeOfDocument(document.getTypeOfDocument());
        dto.setFileName(document.getFileName());
        String viewUrl = "http://localhost:" + serverPort + "/api/documents/view/" + document.getDocumentId();
        dto.setDocumentUpload(viewUrl);
        dto.setDigitalFilePath(document.getDigitalFilePath());
        dto.setDate(document.getDate());
        dto.setLocationOfTheStorage(document.getLocationOfTheStorage());
        dto.setViewTheUploadedDocument(viewUrl);
        return dto;
    }

    private Document resolveDocument(String identifier) {
        Document document = service.getById(identifier);
        if (document != null) {
            return document;
        }
        document = service.getByDigitalFilePath(identifier);
        if (document != null) {
        return document;
        }
        document = service.getByFileName(identifier);
        if (document != null) {
            return document;
        }
        document = service.getLatestForCase(identifier);
        if (document != null) {
            return document;
        }
        List<Document> all = service.listAll();
        if (all != null) {
            for (Document d : all) {
                if (identifier != null && identifier.equals(d.getDocumentId())) {
                    return d;
                }
            }
        }
        return null;
    }
}
