// --- Web3 Setup for Shardeum DApp ---
let provider, signer;

// Replace with deployed contract addresses
const ADDRESSES = {
    attendance: "0xYourAttendanceAddress",
    voting: "0xYourVotingAddress",
    certificates: "0xYourCertificateAddress",
    booking: "0xYourBookingAddress"
};

// Replace with your contract ABIs
const ABIS = {
    attendance: [ /* Paste Attendance ABI */ ],
    voting: [ /* Paste Voting ABI */ ],
    certificates: [ /* Paste CertificateVerifier ABI */ ],
    booking: [ /* Paste ResourceBooking ABI */ ]
};

// Contract instances
let contracts = {
    attendance: null,
    voting: null,
    certificates: null,
    booking: null
};

// --- Connect MetaMask Wallet ---
async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask is not installed! Please install it first.");
        return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        alert("Connected wallet: " + userAddress);

        // Initialize contract instances
        contracts.attendance = new ethers.Contract(ADDRESSES.attendance, ABIS.attendance, signer);
        contracts.voting = new ethers.Contract(ADDRESSES.voting, ABIS.voting, signer);
        contracts.certificates = new ethers.Contract(ADDRESSES.certificates, ABIS.certificates, signer);
        contracts.booking = new ethers.Contract(ADDRESSES.booking, ABIS.booking, signer);
    } catch (error) {
        console.error(error);
        alert("Failed to connect wallet.");
    }
}

// --- Attendance Functions ---
async function markAttendance() {
    if (!contracts.attendance) return alert("Connect wallet first!");
    try {
        const tx = await contracts.attendance.markAttendance();
        await tx.wait();
        alert("Attendance marked! Tx: " + tx.hash);
    } catch (e) { console.error(e); alert("Failed to mark attendance"); }
}

async function getTodayAttendance(listElementId) {
    if (!contracts.attendance) return alert("Connect wallet first!");
    const dayIndex = Math.floor(Date.now() / (1000*86400));
    const records = await contracts.attendance.getAttendanceByDay(dayIndex);
    const ul = document.getElementById(listElementId);
    ul.innerHTML = "";
    records.forEach(r=>{
        const li = document.createElement("li");
        li.innerText = `Address: ${r.student}, Time: ${new Date(r.timestamp*1000).toLocaleString()}`;
        ul.appendChild(li);
    });
}

// --- Voting Functions ---
async function createPoll(title, options) {
    if (!contracts.voting) return alert("Connect wallet first!");
    const start = Math.floor(Date.now()/1000);
    const end = start + 3600*24; // 1 day duration
    const tx = await contracts.voting.createPoll(title, options, start, end, false);
    await tx.wait();
    alert("Poll created!");
}

async function vote(pollId, optionIndex) {
    if (!contracts.voting) return alert("Connect wallet first!");
    const tx = await contracts.voting.vote(pollId, optionIndex);
    await tx.wait();
    alert("Vote casted!");
}

// --- Certificate Functions ---
async function registerCertificate(certHash) {
    if (!contracts.certificates) return alert("Connect wallet first!");
    const tx = await contracts.certificates.registerCertificate(certHash);
    await tx.wait();
    alert("Certificate registered!");
}

async function verifyCertificate(certHash) {
    if (!contracts.certificates) return alert("Connect wallet first!");
    const result = await contracts.certificates.verifyCertificate(certHash);
    alert(`Issuer: ${result[0]}, Timestamp: ${new Date(result[1]*1000).toLocaleString()}`);
}

// --- Booking Functions ---
async function bookSlot(slotId, depositEth) {
    if (!contracts.booking) return alert("Connect wallet first!");
    const tx = await contracts.booking.bookSlot(slotId, { value: ethers.utils.parseEther(depositEth) });
    await tx.wait();
    alert("Slot booked!");
}

async function checkIn(slotId) {
    if (!contracts.booking) return alert("Connect wallet first!");
    const tx = await contracts.booking.checkIn(slotId);
    await tx.wait();
    alert("Checked in!");
}

async function refundSlot(slotId) {
    if (!contracts.booking) return alert("Connect wallet first!");
    const tx = await contracts.booking.refundUnused(slotId);
    await tx.wait();
    alert("Refunded if unused!");
}

// --- Export functions to global scope for HTML buttons ---
window.connectWallet = connectWallet;
window.markAttendance = markAttendance;
window.getTodayAttendance = getTodayAttendance;
window.createPoll = createPoll;
window.vote = vote;
window.registerCertificate = registerCertificate;
window.verifyCertificate = verifyCertificate;
window.bookSlot = bookSlot;
window.checkIn = checkIn;
window.refundSlot = refundSlot;
