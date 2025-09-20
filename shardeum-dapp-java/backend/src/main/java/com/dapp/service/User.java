package com.example.attendance.model;

import java.util.ArrayList;
import java.util.List;

public class User {
    private String username;
    private String password;
    private List<String> attendance;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.attendance = new ArrayList<>();
    }

    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public List<String> getAttendance() { return attendance; }

    public void addAttendance(String record) {
        this.attendance.add(record);
    }
}
