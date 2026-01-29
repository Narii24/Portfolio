package com.PCRS.pcrs1.service;

import com.PCRS.pcrs1.model.Document;
import com.PCRS.pcrs1.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository repository;

    @Override
    public List<Document> listAll() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public Document save(Document document) {
        return repository.save(document);
    }

    @Override
    public Document getById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Document getByDigitalFilePath(String digitalFilePath) {
        return repository.findByDigitalFilePath(digitalFilePath).orElse(null);
    }

    @Override
    public Document getByFileName(String fileName) {
        return repository.findByFileName(fileName).orElse(null);
    }

    @Override
    public Document getLatestForCase(String caseId) {
        var list = repository.findByCaseEntity_CaseIdOrderByDateDesc(caseId);
        return list != null && !list.isEmpty() ? list.get(0) : null;
    }

    @Override
    public List<Document> listByCaseId(String caseId) {
        return repository.findByCaseEntity_CaseIdOrderByDateDesc(caseId);
    }

    @Override
    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }
}
