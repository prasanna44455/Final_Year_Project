// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DNSContract {
    struct DNSRecord {
        string domainName;
        string ipAddress;
        address owner;
        uint256 expiryDate; // Track expiry date
    }

    mapping(string => DNSRecord) public dnsRecords; // Maps domain names to records
    mapping(string => string) public ipToDomain; // Maps IP addresses to domain names
    mapping(address => string[]) public ownedDomains; // Maps owners to their domains
    string[] public allDomains; // Array to store all domains
    mapping(string => uint) private domainToIndex; // Mapping to store the index of domains in the allDomains array

    event DNSRecordCreated(string domainName, string ipAddress, address owner);
    event DNSRecordUpdated(string domainName, string ipAddress, address owner);
    event DNSRecordDeleted(string domainName, string ipAddress, address owner);
    event OwnershipTransferred(string domainName, address oldOwner, address newOwner);
    event DomainRenewed(string domainName, uint256 newExpiryDate);

    modifier onlyOwner(string memory domainName) {
        require(msg.sender == dnsRecords[domainName].owner, "You are not the owner of this domain.");
        _; 
    }

    modifier domainExists(string memory domainName) {
        require(bytes(dnsRecords[domainName].domainName).length > 0, "Domain does not exist.");
        _; 
    }

    function addDNSRecord(string memory domainName, string memory ipAddress) public {
        require(bytes(domainName).length > 0, "Domain name cannot be empty.");
        require(bytes(ipAddress).length > 0, "IP address cannot be empty.");

        if (bytes(dnsRecords[domainName].domainName).length > 0) {
            require(
                keccak256(abi.encodePacked(dnsRecords[domainName].ipAddress)) == keccak256(abi.encodePacked(ipAddress)),
                "Domain is already mapped to a different IP."
            );
        }

        if (bytes(ipToDomain[ipAddress]).length > 0) {
            require(
                keccak256(abi.encodePacked(ipToDomain[ipAddress])) == keccak256(abi.encodePacked(domainName)),
                "IP address is already mapped to a different domain."
            );
        }

        // Add or update the domain
        dnsRecords[domainName] = DNSRecord(domainName, ipAddress, msg.sender, block.timestamp + 365 days);
        ipToDomain[ipAddress] = domainName;
        ownedDomains[msg.sender].push(domainName);

        // Add to allDomains and update the domainToIndex mapping
        domainToIndex[domainName] = allDomains.length;
        allDomains.push(domainName); 

        emit DNSRecordCreated(domainName, ipAddress, msg.sender);
    }

    function getDNSRecord(string memory domainName) public view returns (string memory, string memory, address, uint256) {
        DNSRecord memory record = dnsRecords[domainName];
        return (record.domainName, record.ipAddress, record.owner, record.expiryDate);
    }

    function deleteDNSRecord(string memory domainName) public onlyOwner(domainName) {
        string memory ipAddress = dnsRecords[domainName].ipAddress;

        // Remove domain from ownedDomains mapping
        string[] storage ownerDomains = ownedDomains[msg.sender];
        for (uint i = 0; i < ownerDomains.length; i++) {
            if (keccak256(abi.encodePacked(ownerDomains[i])) == keccak256(abi.encodePacked(domainName))) {
                ownerDomains[i] = ownerDomains[ownerDomains.length - 1];
                ownerDomains.pop();
                break;
            }
        }

        // Remove the domain record from dnsRecords mapping
        delete dnsRecords[domainName];

        // Remove the domain from allDomains array
        uint index = domainToIndex[domainName];
        allDomains[index] = allDomains[allDomains.length - 1];
        allDomains.pop();
        delete domainToIndex[domainName]; // Remove the mapping entry

        emit DNSRecordDeleted(domainName, ipAddress, msg.sender);
    }

    function transferOwnership(string memory domainName, address newOwner) public onlyOwner(domainName) {
        require(newOwner != address(0), "New owner address cannot be zero.");

        address oldOwner = dnsRecords[domainName].owner;
        dnsRecords[domainName].owner = newOwner;

        // Update owned domains mapping
        string[] storage oldOwnerDomains = ownedDomains[oldOwner];
        for (uint i = 0; i < oldOwnerDomains.length; i++) {
            if (keccak256(abi.encodePacked(oldOwnerDomains[i])) == keccak256(abi.encodePacked(domainName))) {
                oldOwnerDomains[i] = oldOwnerDomains[oldOwnerDomains.length - 1];
                oldOwnerDomains.pop();
                break;
            }
        }
        ownedDomains[newOwner].push(domainName);

        emit OwnershipTransferred(domainName, oldOwner, newOwner);
    }

    function renewDomain(string memory domainName) public onlyOwner(domainName) payable {
        dnsRecords[domainName].expiryDate = block.timestamp + 365 days;
        emit DomainRenewed(domainName, dnsRecords[domainName].expiryDate);
    }

    function getOwnedDomains(address owner) public view returns (string[] memory) {
        return ownedDomains[owner];
    }

    // Function to get all records
    function totalRecords() public view returns (uint) {
        return allDomains.length;
    }
}
