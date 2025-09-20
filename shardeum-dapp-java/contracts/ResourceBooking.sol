// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ResourceBooking is Ownable, ReentrancyGuard {
    struct Slot { uint256 id; uint256 start; uint256 end; address bookedBy; uint256 deposit; bool used; }
    uint256 public slotCount;
    mapping(uint256 => Slot) public slots;
    event SlotCreated(uint256 id, uint256 start, uint256 end);
    event SlotBooked(uint256 id, address user, uint256 deposit);
    event SlotCheckedIn(uint256 id, address user);
    event SlotRefunded(uint256 id, address user, uint256 amount);

    function createSlot(uint256 start, uint256 end) external onlyOwner returns (uint256) {
        require(end>start,"end>start");
        slotCount++;
        slots[slotCount] = Slot(slotCount, start, end, address(0), 0, false);
        emit SlotCreated(slotCount, start, end);
        return slotCount;
    }

    function bookSlot(uint256 slotId) external payable nonReentrant {
        Slot storage s = slots[slotId];
        require(s.id != 0, "no slot");
        require(s.bookedBy == address(0), "booked");
        require(msg.value > 0, "deposit");
        s.bookedBy = msg.sender;
        s.deposit = msg.value;
        emit SlotBooked(slotId, msg.sender, msg.value);
    }

    function checkIn(uint256 slotId) external {
        Slot storage s = slots[slotId];
        require(s.bookedBy == msg.sender, "not yours");
        require(block.timestamp >= s.start && block.timestamp <= s.end, "not in window");
        s.used = true;
        emit SlotCheckedIn(slotId, msg.sender);
    }

    function refundUnused(uint256 slotId) external nonReentrant {
        Slot storage s = slots[slotId];
        require(s.id != 0, "no slot");
        require(s.bookedBy != address(0), "not booked");
        require(block.timestamp > s.end + 1 hours, "refund not open");
        require(!s.used, "used");
        uint256 amount = s.deposit;
        address user = s.bookedBy;
        s.deposit = 0;
        s.bookedBy = address(0);
        (bool ok,) = payable(user).call{value: amount}("");
        require(ok, "transfer failed");
        emit SlotRefunded(slotId, user, amount);
    }
}
