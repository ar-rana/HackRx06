package com.project.server.service;

import java.util.Optional;

import com.project.server.model.User;
import com.project.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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

    public void updateUser() {

    }

    public void logOut() {

    }

    public void logIn() {

    }
}
