// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721, Ownable {
    uint256 private _id;
    mapping(uint256 => string) public meta;
    constructor() ERC721("CertificateNFT","CERT") {}
    function mintCertificate(address to, string calldata metadataUri) external onlyOwner returns (uint256) {
        _id++;
        _safeMint(to, _id);
        meta[_id] = metadataUri;
        return _id;
    }
}
