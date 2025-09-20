// DOM Elements
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("file-name");
const uploadBtn = document.getElementById("uploadBtn");
const hashResult = document.getElementById("hashResult");

let selectedFile = null;

// Show selected file name
fileInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    fileName.textContent = selectedFile ? selectedFile.name : "No file chosen";
    hashResult.textContent = "";
});

// Hash file using ethers.js
uploadBtn.addEventListener("click", () => {
    if (!selectedFile) {
        alert("Please select a file first!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        const arrayBuffer = reader.result;
        const bytes = new Uint8Array(arrayBuffer);

        // Convert Uint8Array to hex string for ethers.js
        const hexString = "0x" + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

        const hash = ethers.utils.keccak256(hexString); // Generate keccak256 hash
        hashResult.textContent = `File Hash: ${hash}`;
    };
    reader.readAsArrayBuffer(selectedFile);
});


