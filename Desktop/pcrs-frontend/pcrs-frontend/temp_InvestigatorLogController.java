package com.PCRS.pcrs1.controller;

import com.PCRS.pcrs1.dto.PcrsDTOs.*;
import com.PCRS.pcrs1.model.InvestigatorLog;
import com.PCRS.pcrs1.model.Case;
import com.PCRS.pcrs1.service.InvestigatorLogService;
import com.PCRS.pcrs1.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/investigatorlogs")
public class InvestigatorLogController {

    @Autowired
    private InvestigatorLogService service;

    @Autowired
    private CaseService caseService;

    @Autowired
    private com.PCRS.pcrs1.service.UserService userService;

    // All authenticated roles can view investigation logs (important for case tracking)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'DESK_OFFICER', 'INVESTIGATOR')")
    public List<InvestigatorLogDTO> listAll() {
        return service.listAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Only Investigator (or Admin/Supervisor) can add a new log entry
    @PostMapping
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN', 'SUPERVISOR')")
    public InvestigatorLogDTO create(@RequestBody InvestigatorLogDTO logDTO, java.security.Principal principal) {
        // Resolve the correct Investigator ID (User ID) from the Principal
        String resolvedInvestigatorId = logDTO.getInvestigatorId();
        
        com.PCRS.pcrs1.model.User user = null;
        if (principal instanceof JwtAuthenticationToken jwtAuth) {
            String userId = jwtAuth.getToken().getSubject();
            if (userService.existsByIdNative(userId)) {
                user = userService.getById(userId);
            }
        }
        
        if (user == null && principal != null) {
            String username = principal.getName();
            user = userService.getByUsernameNative(username);
        }
        
        // Retry logic for newly created users
        if (user == null && principal != null) {
             try {
                 Thread.sleep(500);
                 String username = principal.getName();
                 user = userService.getByUsernameNative(username);
             } catch (InterruptedException ie) {
                 Thread.currentThread().interrupt();
             }
        }
        
        if (user != null) {
            resolvedInvestigatorId = user.getUserId();
        } else {
             // If we can't find the user, we can't reliably link the log.
             // However, to avoid 500, we check if we have a raw ID from DTO.
             if (resolvedInvestigatorId == null) {
                  // Fallback: Use the token subject as ID directly, assuming it will eventually sync
                  if (principal instanceof JwtAuthenticationToken jwtAuth) {
                      resolvedInvestigatorId = jwtAuth.getToken().getSubject();
                  }
             }
        }
        
        InvestigatorLog log = convertToEntity(logDTO);
        log.setInvestigatorId(resolvedInvestigatorId); 
        
        // Ensure Case exists if provided
        if (logDTO.getCaseId() != null) {
            String cId = logDTO.getCaseId().trim();
            Case caseEntity = caseService.getById(cId);
            
            // Fallback 1: Native Lookup for ghost records
            if (caseEntity == null) {
                try {
                    caseEntity = caseService.getByIdNative(cId);
                } catch (Exception e) {
                    // ignore
                }
            }
            
            // Fallback 2: Retry with delay (consistency)
            if (caseEntity == null) {
                try {
                    Thread.sleep(500);
                    caseEntity = caseService.getById(cId);
                    if (caseEntity == null) caseEntity = caseService.getByIdNative(cId);
                } catch (Exception e) {}
            }
            
            if (caseEntity != null) {
                log.setCaseEntity(caseEntity);
            } else {
                throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, 
                    "Invalid Case ID: " + cId
                );
            }
        } else {
             throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, 
                "Case ID is required"
            );
        }

        InvestigatorLog saved = service.save(log);
        return convertToDTO(saved);
    }

    // All authenticated roles can view a specific log
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'DESK_OFFICER', 'INVESTIGATOR')")
    public InvestigatorLogDTO getById(@PathVariable String id) {
        return convertToDTO(service.getById(id));
    }

    // Only Investigator (or Admin/Supervisor) can update their log entries
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN', 'SUPERVISOR')")
    public InvestigatorLogDTO update(@PathVariable String id, @RequestBody InvestigatorLogDTO logDTO) {
        InvestigatorLog existing = service.getById(id);
        existing.setDate(logDTO.getDate());
        existing.setUpdateDetails(logDTO.getUpdateDetails());

        if (logDTO.getCaseId() != null) {
            Case caseEntity = caseService.getById(logDTO.getCaseId());
            existing.setCaseEntity(caseEntity);
        }

        return convertToDTO(service.save(existing));
    }

    // Only Admin or Supervisor can delete logs (audit trail protection)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private InvestigatorLogDTO convertToDTO(InvestigatorLog log) {
        InvestigatorLogDTO dto = new InvestigatorLogDTO();
        dto.setInvestigatorId(log.getInvestigatorId());
        if (log.getCaseEntity() != null) {
            dto.setCaseId(log.getCaseEntity().getCaseId());
        }
        dto.setDate(log.getDate());
        dto.setUpdateDetails(log.getUpdateDetails());
        return dto;
    }

    private InvestigatorLog convertToEntity(InvestigatorLogDTO dto) {
        InvestigatorLog log = new InvestigatorLog();
        log.setInvestigatorId(dto.getInvestigatorId());
        log.setDate(dto.getDate());
        log.setUpdateDetails(dto.getUpdateDetails());

        if (dto.getCaseId() != null) {
            Case caseEntity = caseService.getById(dto.getCaseId());
            log.setCaseEntity(caseEntity);
        }

        return log;
    }
}
