package com.project.server.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class ExceptionAdvice {

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String> handleExpiredJwtException(ExpiredJwtException ex) {
        log.error("JWT Session expired, msg: {}", ex.getMessage());
        return ResponseEntity.status((HttpStatus.UNAUTHORIZED)).body("your session has expired");
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<String> handleMalformedJwtException(MalformedJwtException ex) {
        log.error("JWT token abnormality detected: msg {}", ex.getMessage());
        return ResponseEntity.status((HttpStatus.CONFLICT)).body("your session has expired");
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<String> handleMalformedJwtException(SignatureException ex) {
        log.error("JWT Signature mismatch: msg {}", ex.getMessage());
        return ResponseEntity.status((HttpStatus.UNAUTHORIZED)).body("Invalid JWT Signature");
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<String> handleMalformedJwtException(NullPointerException ex) {
        log.error("NULL value found: msg {}", ex.getMessage());
        return ResponseEntity.status((HttpStatus.CONFLICT)).body("KYC unavailable");
    }
}
