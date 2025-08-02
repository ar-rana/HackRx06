package com.project.server.controller;

import java.util.Map;

import com.project.server.model.User;
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
        String username = item.get("username");
        String password = item.get("username");

        if (userService.saveUser(username, password)) {
            return ResponseEntity.status(HttpStatus.OK).body("user " + username + " created successfully");
        };
        return ResponseEntity.status(HttpStatus.CONFLICT).body("user already exists");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> item) {
        String username = item.get("username");
        String password = item.get("username");
        User user = new User(username, password);

        String res = userService.logIn(user);
        return ResponseEntity.status(HttpStatus.OK).body(res);
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
