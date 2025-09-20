package com.example.attendance.controller;

import com.example.attendance.model.User;
import com.example.attendance.service.UserService;
import com.dapp.service.AttendanceService; // Your custom service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private UserService userService;

    @Autowired
    private AttendanceService service; // Your original service

    // Login endpoint
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        User user = userService.login(username, password);

        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("success", true);
            response.put("username", user.getUsername());
            response.put("attendance", user.getAttendance());
        } else {
            response.put("success", false);
            response.put("message", "Invalid username or password");
        }
        return response;
    }

    // Mark attendance using UserService
    @PostMapping("/mark")
    public Map<String, Object> markAttendance(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        User user = userService.getUser(username);

        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            userService.markAttendance(username);
            response.put("success", true);
            response.put("message", "Attendance marked via UserService");
            response.put("attendance", user.getAttendance());
        } else {
            response.put("success", false);
            response.put("message", "User not found");
        }
        return response;
    }

    // Optional: Mark attendance using your custom AttendanceService
    @PostMapping("/markService")
    public Map<String, Object> markAttendanceWithService() {
        Map<String, Object> response = new HashMap<>();
        try {
            String result = service.markAttendance(); // Your original method
            response.put("success", true);
            response.put("message", result);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }

    // Get attendance records
    @GetMapping("/{username}")
    public Map<String, Object> getAttendance(@PathVariable String username) {
        User user = userService.getUser(username);
        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("success", true);
            response.put("attendance", user.getAttendance());
        } else {
            response.put("success", false);
            response.put("message", "User not found");
        }
        return response;
    }
}
