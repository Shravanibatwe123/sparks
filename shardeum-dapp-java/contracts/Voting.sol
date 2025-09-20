// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Poll { string title; string[] options; uint256 start; uint256 end; bool anonymous; bool exists; }
    uint256 public pollCount;
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(uint256 => uint256)) public votes;
    mapping(uint256 => mapping(address => bytes32)) public commitments;
    mapping(uint256 => mapping(uint256 => uint256)) public revealedVotes;
    event PollCreated(uint256 pollId, string title, bool anonymous);
    event VoteCast(uint256 pollId, address voter, uint256 optionIndex);
    event VoteCommitted(uint256 pollId, address voter);
    event VoteRevealed(uint256 pollId, address voter, uint256 optionIndex);

    function createPoll(string calldata title, string[] calldata options, uint256 start, uint256 end, bool anonymous) external onlyOwner returns (uint256) {
        require(end>start,"end>start");
        pollCount++;
        polls[pollCount] = Poll(title, options, start, end, anonymous, true);
        emit PollCreated(pollCount, title, anonymous);
        return pollCount;
    }

    function vote(uint256 pollId, uint256 optionIndex) external {
        Poll storage p = polls[pollId];
        require(p.exists && !p.anonymous, "not allowed");
        require(block.timestamp >= p.start && block.timestamp <= p.end, "not active");
        votes[pollId][optionIndex] += 1;
        emit VoteCast(pollId, msg.sender, optionIndex);
    }

    function commitVote(uint256 pollId, bytes32 commitment) external {
        Poll storage p = polls[pollId];
        require(p.exists && p.anonymous, "not anonymous");
        require(block.timestamp >= p.start && block.timestamp <= p.end, "not active");
        require(commitments[pollId][msg.sender] == bytes32(0), "already committed");
        commitments[pollId][msg.sender] = commitment;
        emit VoteCommitted(pollId, msg.sender);
    }

    function revealVote(uint256 pollId, uint256 optionIndex, string calldata salt) external {
        Poll storage p = polls[pollId];
        require(p.exists && p.anonymous, "not anonymous");
        require(block.timestamp > p.end, "reveal not started");
        bytes32 expected = keccak256(abi.encodePacked(optionIndex, salt));
        require(expected == commitments[pollId][msg.sender], "mismatch");
        revealedVotes[pollId][optionIndex] += 1;
        commitments[pollId][msg.sender] = bytes32(0);
        emit VoteRevealed(pollId, msg.sender, optionIndex);
    }

    function getOptions(uint256 pollId) external view returns (string[] memory) {
        return polls[pollId].options;
    }

    function getVoteCounts(uint256 pollId) external view returns (uint256[] memory) {
        Poll storage p = polls[pollId];
        uint len = p.options.length;
        uint256[] memory out = new uint256[](len);
        if (!p.anonymous) {
            for (uint i=0;i<len;i++) out[i] = votes[pollId][i];
        } else {
            for (uint i=0;i<len;i++) out[i] = revealedVotes[pollId][i];
        }
        return out;
    }
}
