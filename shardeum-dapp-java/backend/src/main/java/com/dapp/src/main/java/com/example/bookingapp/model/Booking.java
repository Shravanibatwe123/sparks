package com.example.bookingapp.model;

public class Booking {
    private String id;
    private String date;
    private String status;

    public Booking() {}

    public Booking(String id, String date, String status) {
        this.id = id;
        this.date = date;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
