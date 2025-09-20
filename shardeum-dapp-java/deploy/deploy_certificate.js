const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  const CertNFT = await ethers.getContractFactory("CertificateNFT");
  const certNft = await CertNFT.deploy();
  await certNft.deployed();
  console.log("CertificateNFT:", certNft.address);
  const CertVerifier = await ethers.getContractFactory("CertificateVerifier");
  const certv = await CertVerifier.deploy(certNft.address);
  await certv.deployed();
  console.log("CertificateVerifier:", certv.address);
  await certNft.transferOwnership(certv.address);
  console.log("Transferred CertificateNFT owner to verifier");
}
main().catch(e=>{console.error(e); process.exit(1);});
