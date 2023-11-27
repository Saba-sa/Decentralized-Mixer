// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinJoin {
    struct Participant {
        address depositor;
        address recipient;
        uint256 amount;
    }

    Participant[] public participants;
    uint public constant MIX_AMOUNT = 0.05 ether; // Set your mix amount
    uint public constant MIN_PARTICIPANTS = 5; // Minimum number of participants to execute a withdraw

    event CoinMixed(address indexed participant, uint amount);
    event WithdrawExecuted(address indexed recipient, uint amount);

    function joinMix(address recipientAddress) external payable {
        require(recipientAddress != address(0), "Invalid recipient address");
        
        participants.push(Participant({
            depositor: msg.sender,
            recipient: recipientAddress,
            amount: msg.value
        }));
        
        emit CoinMixed(msg.sender, msg.value);

        if (participants.length == MIN_PARTICIPANTS) {
            executeWithdraw();
        }
    }

    function executeWithdraw() internal {
        require(address(this).balance >= MIX_AMOUNT * MIN_PARTICIPANTS, "Insufficient funds");

        for (uint i = 0; i < participants.length; i++) {
            payable(participants[i].recipient).transfer(participants[i].amount);
            emit WithdrawExecuted(participants[i].recipient, participants[i].amount);
        }

        delete participants;
    }

    function getParticipants() external view returns (Participant[] memory) {
        return participants;
    }
}