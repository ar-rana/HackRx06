package com.project.server.controller;

import java.util.Map;

import com.project.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> item) {
        String user = item.get("username");
        String password = item.get("username");

        if (userService.saveUser(user, password)) {
            return ResponseEntity.status(HttpStatus.OK).body("user " + user + " created successfully");
        };
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> item) {
        String user = item.get("username");
        String password = item.get("username");

        return ResponseEntity.ok().build();
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> item) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify")
    public boolean verify(@RequestBody Map<String, String> item) {
        return true;
    }
}
