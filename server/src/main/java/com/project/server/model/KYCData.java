package com.project.server.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table
@Data
@NoArgsConstructor
public class KYCData {

    @Id
    private String username;
    private Date expirationDate;
    @Column(nullable = false)
    private String requestId;

    private Date validUntil;
    private String dob;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String photo;
    private String name;
    private String maskedNumber;
    private String gender;
    private String address;
    private String phone;
    private String postOffice;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String pdf;

    public KYCData(Date expirationDate, String requestId, String username) {
        this.expirationDate = expirationDate;
        this.requestId = requestId;
        this.username = username;
    }
}
