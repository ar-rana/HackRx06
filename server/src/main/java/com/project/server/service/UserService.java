package com.project.server.service;

import java.util.Optional;

import com.project.server.model.User;
import com.project.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public boolean saveUser(String username, String password) {
        User user = new User(username, password);
//        user.setPassword((encoder.encode(user.getPassword())));
        if (existingUser(user)) {
            return false;
        }
        userRepository.save(user);
        return true;
    }

    public boolean existingUser(User user) {
        Optional<User> existingUser = userRepository.findById(user.getUsername());
        return existingUser.isPresent();
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public User getUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findById(username).orElse(null);
    }

    public String logIn(User user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if(authentication.isAuthenticated())
            return jwtService.generateToken(user.getUsername());
        else
            return "";
    }
}
