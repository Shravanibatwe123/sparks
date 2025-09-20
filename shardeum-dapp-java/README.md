# Shardeum DApp (Java backend + HTML/JS frontend)
This archive contains a full-stack prototype DApp using Shardeum Unstablenet,
Solidity smart contracts, Java (Spring Boot + Web3j) backend, a static frontend
(HTML/CSS/JS + Ethers.js), Hardhat deploy scripts, and AI stubs (Python).

**Contents**
- contracts/: Solidity contracts (Attendance, Voting, CertificateVerifier, ResourceBooking, BadgeNFT, CertificateNFT)
- deploy/: Hardhat config & deploy scripts
- backend/: Spring Boot Maven project skeleton (controllers, services, Web3 config)
- frontend/: static pages and JS (Ethers.js)
- ai/: Python AI stubs (attendance summary, OCR, slot recommender)

**How to use (quick)**
1. Install Node.js, npm, Hardhat, Java 17+, Maven.
2. Compile & deploy contracts:
   - `cd deploy`
   - `npm install`
   - `npx hardhat run --network unstablenet deploy_attendance.js`
   (Repeat for other deploy scripts.)
3. Populate backend/.env or system env with deployed addresses and keys.
4. Run backend:
   - `cd backend`
   - `mvn spring-boot:run`
5. Open frontend files in a browser (serve with a static server) and connect MetaMask to Shardeum Unstablenet (RPC: https://api-unstable.shardeum.org, chainId: 8080).
6. For AI features, run Python stubs in ai/ and point backend to them.

This is a prototype. For production, audit contracts, secure keys, and use IPFS for NFT metadata.
