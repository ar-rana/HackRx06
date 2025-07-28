package com.project.server.service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import com.project.server.model.User;
import com.project.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = repository.findById(username);
        if (user.isPresent()) {
            return new com.project.server.model.UserDetails(user.get());
        }
        throw new UsernameNotFoundException("USER 404");
    }
}
