package com.project.server.repository;

import com.project.server.model.KYCData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KYCRepository extends JpaRepository<KYCData, String> {
}
