// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgeNFT is ERC721, Ownable {
    uint256 private _tokenId;
    mapping(uint256 => string) public meta;

    constructor() ERC721("AttendanceBadge","ABDG") {}

    function mintBadge(address to, string calldata metadataUri) external onlyOwner returns (uint256) {
        _tokenId++;
        _safeMint(to, _tokenId);
        meta[_tokenId] = metadataUri;
        return _tokenId;
    }
}
