package com.PCRS.pcrs1.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "cases", schema = "pcrsone")
public class Case {

    @Id
    @Column(name = "case_id")
    private String caseId;

    @Column(name = "case_number")
    private Integer caseNumber;

    @Column(nullable = false)
    private String title;

    @Column(name = "registration_date")
    private LocalDate registrationDate = LocalDate.now();

    @Column(name = "case_type")
    private String caseType;

    @Column(name = "case_description", columnDefinition = "TEXT")
    private String caseDescription;

    @Column(name = "current_status")
    private String currentStatus = "Registered";

    private String location;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "registered_by_user_id", nullable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnoreProperties({"password", "cases"})
    private User registeredBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_investigator_id")
    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnoreProperties({"password", "cases"})
    private User assignedInvestigator;

    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Document> documents;

    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Party> parties;

    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Evidence> evidences;

    public Case() {}

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public Integer getCaseNumber() { return caseNumber; }
    public void setCaseNumber(Integer caseNumber) { this.caseNumber = caseNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDate registrationDate) { this.registrationDate = registrationDate; }

    public String getCaseType() { return caseType; }
    public void setCaseType(String caseType) { this.caseType = caseType; }

    public String getCaseDescription() { return caseDescription; }
    public void setCaseDescription(String caseDescription) { this.caseDescription = caseDescription; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public User getRegisteredBy() { return registeredBy; }
    public void setRegisteredBy(User registeredBy) { this.registeredBy = registeredBy; }

    public User getAssignedInvestigator() { return assignedInvestigator; }
    public void setAssignedInvestigator(User assignedInvestigator) { this.assignedInvestigator = assignedInvestigator; }

    public List<Document> getDocuments() { return documents; }
    public void setDocuments(List<Document> documents) { this.documents = documents; }

    public List<Party> getParties() { return parties; }
    public void setParties(List<Party> parties) { this.parties = parties; }

    public List<Evidence> getEvidences() { return evidences; }
    public void setEvidences(List<Evidence> evidences) { this.evidences = evidences; }
}
