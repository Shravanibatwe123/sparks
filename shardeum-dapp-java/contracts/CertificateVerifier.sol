// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CertificateNFT.sol";

contract CertificateVerifier is Ownable {
    mapping(bytes32 => address) public issuer;
    mapping(bytes32 => uint256) public timestamp;
    CertificateNFT public certNFT;

    event CertificateRegistered(bytes32 certHash, address indexed issuerAddr, uint256 time);
    event CertificateMinted(bytes32 certHash, address to, uint256 tokenId);

    constructor(address certNftAddr) {
        certNFT = CertificateNFT(certNftAddr);
    }

    function registerCertificate(bytes32 certHash) external {
        require(issuer[certHash] == address(0), "already");
        issuer[certHash] = msg.sender;
        timestamp[certHash] = block.timestamp;
        emit CertificateRegistered(certHash, msg.sender, block.timestamp);
    }

    function verifyCertificate(bytes32 certHash) external view returns (address, uint256) {
        return (issuer[certHash], timestamp[certHash]);
    }

    function mintCertificateNFT(bytes32 certHash, address to, string calldata meta) external returns (uint256) {
        require(issuer[certHash] != address(0), "not registered");
        require(issuer[certHash] == msg.sender, "only issuer");
        uint256 tid = certNFT.mintCertificate(to, meta);
        emit CertificateMinted(certHash, to, tid);
        return tid;
    }
}
