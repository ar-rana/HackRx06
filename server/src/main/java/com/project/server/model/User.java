package com.project.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
@Table(name = "Users")
@NoArgsConstructor
public class User {
    @Id
    private String username;
    @Column(nullable = false)
    private String password;

    private boolean verified;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.verified = false;
    }
}
