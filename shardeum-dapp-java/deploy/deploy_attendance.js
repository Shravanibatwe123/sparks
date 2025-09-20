const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying by", deployer.address);
  const Badge = await ethers.getContractFactory("BadgeNFT");
  const badge = await Badge.deploy();
  await badge.deployed();
  console.log("Badge:", badge.address);
  const Attendance = await ethers.getContractFactory("Attendance");
  const attendance = await Attendance.deploy(badge.address);
  await attendance.deployed();
  console.log("Attendance:", attendance.address);
  // transfer ownership of Badge to Attendance so it can mint
  await badge.transferOwnership(attendance.address);
  console.log("Transferred Badge ownership to Attendance");
}
main().catch(e=>{console.error(e); process.exit(1);});
