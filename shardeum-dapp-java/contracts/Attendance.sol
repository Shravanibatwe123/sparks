// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./BadgeNFT.sol";

contract Attendance is Ownable, ReentrancyGuard {
    struct Record { address student; uint256 timestamp; }
    mapping(uint256 => Record[]) public dailyRecords;
    mapping(address => uint256) public streak;
    BadgeNFT public badge;

    event AttendanceMarked(address indexed student, uint256 dayIndex);
    event BadgeAwarded(address indexed student, string tier, uint256 tokenId);

    constructor(address badgeAddr) {
        badge = BadgeNFT(badgeAddr);
    }

    function _dayIndex(uint256 ts) internal pure returns (uint256) {
        return ts / 1 days;
    }

    function markAttendance() external nonReentrant {
        uint256 today = _dayIndex(block.timestamp);
        // prevent duplicates
        for (uint i=0;i<dailyRecords[today].length;i++){
            require(dailyRecords[today][i].student != msg.sender, "Already marked");
        }
        dailyRecords[today].push(Record(msg.sender, block.timestamp));
        // update streak (simple approach)
        streak[msg.sender] = streak[msg.sender] + 1;
        emit AttendanceMarked(msg.sender, today);

        // Award simple badges for 7/14/30
        if (streak[msg.sender] == 7) {
            uint256 tid = badge.mintBadge(msg.sender, "bronze-7days");
            emit BadgeAwarded(msg.sender, "bronze", tid);
        } else if (streak[msg.sender] == 14) {
            uint256 tid = badge.mintBadge(msg.sender, "silver-14days");
            emit BadgeAwarded(msg.sender, "silver", tid);
        } else if (streak[msg.sender] == 30) {
            uint256 tid = badge.mintBadge(msg.sender, "gold-30days");
            emit BadgeAwarded(msg.sender, "gold", tid);
        }
    }

    function getAttendanceByDay(uint256 dayIndex) external view returns (Record[] memory) {
        return dailyRecords[dayIndex];
    }
}
