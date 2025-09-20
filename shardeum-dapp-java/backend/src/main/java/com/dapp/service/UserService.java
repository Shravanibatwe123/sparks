package com.example.attendance.service;

import com.example.attendance.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private List<User> users = new ArrayList<>();

    public UserService() {
        // Hardcoded users for demo
        users.add(new User("user1", "1234"));
        users.add(new User("user2", "abcd"));
    }

    public User login(String username, String password) {
        return users.stream()
                .filter(u -> u.getUsername().equals(username) && u.getPassword().equals(password))
                .findFirst()
                .orElse(null);
    }

    public User getUser(String username) {
        return users.stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .orElse(null);
    }

    public void markAttendance(String username) {
        User user = getUser(username);
        if(user != null) {
            user.addAttendance(java.time.LocalDateTime.now().toString());
        }
    }
}
