package com.PCRS.pcrs1.service;

import com.PCRS.pcrs1.model.Document;
import java.util.List;

public interface DocumentService {
    List<Document> listAll();
    Document save(Document document);
    Document getById(String id);
    Document getByDigitalFilePath(String digitalFilePath);
    Document getByFileName(String fileName);
    Document getLatestForCase(String caseId);
    List<Document> listByCaseId(String caseId);
    void delete(String id);
}
