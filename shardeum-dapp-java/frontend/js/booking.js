
const BOOK_ADDR = "REPLACE_BOOKING_ADDRESS";
const ABI = [ /* Booking ABI */ ];

let provider, signer, booking;

// Connect wallet
document.getElementById("connectBtn").onclick = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    booking = new ethers.Contract(BOOK_ADDR, ABI, signer);
    alert("Connected: " + await signer.getAddress());

    loadBookings();
};

// Load bookings from blockchain
async function loadBookings() {
    if (!booking) return;

    try {
        const userAddress = await signer.getAddress();
        // Example: assuming your contract has a `getUserBookings(address)` function
        const bookingsData = await booking.getUserBookings(userAddress);

        const container = document.getElementById("bookingsContainer");
        container.innerHTML = "";

        if (bookingsData.length === 0) {
            container.innerHTML = "<p>No bookings found</p>";
            return;
        }

        bookingsData.forEach(b => {
            const div = document.createElement("div");
            div.className = "booking " + (b.status || "pending");
            div.innerHTML = `
                <h3>Resource: ${b.resourceName || "Unknown"}</h3>
                <p>Status: ${b.status}</p>
                <p>Start: ${new Date(b.startTime * 1000).toLocaleString()}</p>
                <p>End: ${new Date(b.endTime * 1000).toLocaleString()}</p>
                <p>Attendees: ${b.attendees}</p>
                <p>Cost: $${b.totalCost?.toFixed(2) || 0}</p>
                ${b.status === "confirmed" ? `<button onclick="cancelBooking(${b.id})">Cancel</button>` : ""}
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        alert("Error loading bookings");
    }
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!booking) return;

    try {
        const tx = await booking.cancelBooking(bookingId); // assuming your contract has this
        await tx.wait();
        alert("Booking cancelled");
        loadBookings();
    } catch (error) {
        console.error(error);
        alert("Error cancelling booking");
    }
}
