// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract CampaignFactory {
    address[] public deployedCampaigns;

    constructor() { } 

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));

        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    uint public requestCount;
    uint public approversCount;

    mapping(address => bool) public approvers;
    mapping(uint => Request) public requests;

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    modifier allowedToVote() {
        require(approvers[msg.sender]);
        _;
    }

    modifier allowedToConrtibute() {
        require(!approvers[msg.sender]);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
        requestCount = 0;
        approversCount = 0;
    }

    function contribute() public payable allowedToConrtibute {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string calldata description, uint value, address payable recipient) public managerOnly {
        Request storage newRequest = requests[requestCount++];

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public allowedToVote {
        require(index < requestCount);

        Request storage request = requests[index];
        // Ensure account can only vote once
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public managerOnly {
        Request storage request = requests[index];

        // Ensure request has not already been finalized
        require(!request.complete);
        // Ensure that at least 50% of the approvers have voted to approve
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requestCount,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requestCount;
    }
}