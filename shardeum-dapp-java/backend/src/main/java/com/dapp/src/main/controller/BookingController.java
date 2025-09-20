package com.example.bookingapp.controller;

import com.example.bookingapp.model.Booking;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class BookingController {

    @GetMapping("/api/bookings")
    public List<Booking> getBookings() {
        return List.of(
            new Booking("12345", "20 Sep 2025", "confirmed"),
            new Booking("12346", "22 Sep 2025", "pending"),
            new Booking("12347", "25 Sep 2025", "cancelled")
        );
    }
}
