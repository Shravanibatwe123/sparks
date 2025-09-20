const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  const Booking = await ethers.getContractFactory("ResourceBooking");
  const booking = await Booking.deploy();
  await booking.deployed();
  console.log("Booking:", booking.address);
}
main().catch(e=>{console.error(e); process.exit(1);});
