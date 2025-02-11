// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DNSContract {
    struct DNSRecord {
        string domainName;
        string ipAddress;
        address owner;
        uint256 expiryDate;
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

    /** 
     * @dev Validates domain format (e.g., domain.com). 
     * Rejects if there are multiple consecutive dots or an incorrect structure.
     */
    function validateDomainFormat(string memory domainName) internal pure {
        bytes memory domainBytes = bytes(domainName);
        require(domainBytes.length > 3, "Invalid domain: too short.");

        uint dotCount = 0;
        uint lastDotIndex = 0;

        for (uint i = 0; i < domainBytes.length; i++) {
            if (domainBytes[i] == ".") {
                dotCount++;
                lastDotIndex = i;

                // Prevent consecutive dots
                require(i > 0 && domainBytes[i - 1] != ".", "Invalid domain format: no consecutive dots allowed.");
            }
        }

        // Ensure only one dot exists and the domain ends with '.com'
        require(dotCount == 1 && lastDotIndex + 4 == domainBytes.length && 
                domainBytes[lastDotIndex + 1] == 'c' && domainBytes[lastDotIndex + 2] == 'o' && domainBytes[lastDotIndex + 3] == 'm', 
                "Invalid domain format. The domain should follow the format: domain.com");
    }

    /** 
     * @dev Extracts the base domain (e.g., cat.com from cat.com/services)
     */
    function getBaseDomain(string memory domainName) internal pure returns (string memory) {
        bytes memory domainBytes = bytes(domainName);
        uint dotIndex = 0;

        for (uint i = 0; i < domainBytes.length; i++) {
            if (domainBytes[i] == ".") {
                dotIndex = i;
            }
        }

        require(dotIndex > 0, "Invalid domain name.");
        return domainName; // Assuming the domain format is valid, return it as is
    }

    /**
     * @dev Adds a new DNS record, ensuring domain and IP uniqueness.
     */
    function addDNSRecord(string memory domainName, string memory ipAddress) public {
        require(bytes(domainName).length > 0, "Domain name cannot be empty.");
        require(bytes(ipAddress).length > 0, "IP address cannot be empty.");

        validateDomainFormat(domainName); // Ensure valid format

        string memory baseDomain = getBaseDomain(domainName);

        // Prevent subdomains from being registered if base domain exists
        require(bytes(dnsRecords[baseDomain].domainName).length == 0, "Base domain already registered.");

        // Prevent IP reuse for a different domain
        require(bytes(ipToDomain[ipAddress]).length == 0, "IP address already in use.");

        // Register domain
        dnsRecords[domainName] = DNSRecord(domainName, ipAddress, msg.sender, block.timestamp + 365 days);
        ipToDomain[ipAddress] = domainName;
        ownedDomains[msg.sender].push(domainName);

        // Track domains
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
        delete ipToDomain[ipAddress];

        // Remove the domain from allDomains array
        uint index = domainToIndex[domainName];
        allDomains[index] = allDomains[allDomains.length - 1];
        allDomains.pop();
        delete domainToIndex[domainName];

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

    function totalRecords() public view returns (uint) {
        return allDomains.length;
    }
}
