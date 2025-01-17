window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // Enable MetaMask access
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    
    // Contract details
    const contractAddress = "0xF1e5758d3c70053E3BdFC352A4F24260797D4d3A"; // Replace with your deployed contract address
    const contractABI = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipAddress",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "DNSRecordCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipAddress",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "DNSRecordDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipAddress",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "DNSRecordUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "newExpiryDate",
            "type": "uint256"
          }
        ],
        "name": "DomainRenewed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "oldOwner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "allDomains",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "name": "dnsRecords",
        "outputs": [
          {
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipAddress",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "expiryDate",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "name": "ipToDomain",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "ownedDomains",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipAddress",
            "type": "string"
          }
        ],
        "name": "addDNSRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          }
        ],
        "name": "getDNSRecord",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          }
        ],
        "name": "deleteDNSRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "domainName",
            "type": "string"
          }
        ],
        "name": "renewDomain",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "getOwnedDomains",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "totalRecords",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
    ];
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    console.log("Connected account:", account);

    // Add DNS Record without requiring transaction fee
    document.getElementById('addRecordButton').addEventListener('click', async () => {
      const domain = document.getElementById('domainInput').value;
      const ip = document.getElementById('ipInput').value;
      if (!domain || !ip) {
        alert("Domain and IP are required.");
        return;
      }

      try {
        console.log("Adding DNS Record:", domain, ip);
        await contract.methods.addDNSRecord(domain, ip).send({ from: account });
        document.getElementById('output').innerText = `DNS Record Added for ${domain}`;
      } catch (error) {
        console.error("Error adding record:", error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
      }
    });

    // Get DNS Record
    document.getElementById('getRecordButton').addEventListener('click', async () => {
      const domain = document.getElementById('domainInput').value;
      try {
        console.log("Getting DNS Record for:", domain);
        const record = await contract.methods.getDNSRecord(domain).call();
        
        // Convert BigInt to number
        const expiryDate = Number(record[3]);

        document.getElementById('output').innerText = `Domain: ${record[0]}\nIP: ${record[1]}\nOwner: ${record[2]}\nExpiry Date: ${new Date(expiryDate * 1000).toLocaleDateString()}`;
      } catch (error) {
        console.error("Error getting record:", error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
      }
    });
    // Get the modal and related elements
const modal = document.getElementById('transferOwnershipModal');
const btn = document.getElementById('transferOwnershipButton');
const span = document.getElementsByClassName('close')[0];

// Open the modal
btn.onclick = function () {
  modal.style.display = 'block';
};

// Close the modal
span.onclick = function () {
  modal.style.display = 'none';
};

// Close the modal when clicking outside of it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

// Handle the transfer form submission
document.getElementById('transferForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const domain = document.getElementById('domainInput').value;
  const newOwner = document.getElementById('newOwnerInput').value;

  if (!domain || !newOwner) {
    alert('Domain and New Owner are required.');
    return;
  }

  try {
    console.log('Transferring ownership for:', domain, 'to', newOwner);
    await contract.methods.transferOwnership(domain, newOwner).send({ from: account });
    alert(`Ownership of ${domain} transferred to ${newOwner}`);
    modal.style.display = 'none'; // Close the modal
  } catch (error) {
    console.error('Error transferring ownership:', error);
    alert(`Error: ${error.message}`);
  }
});


    // List Owned Domains
    document.getElementById('listOwnedDomainsButton').addEventListener('click', async () => {
      try {
        console.log("Getting owned domains...");
        const domains = await contract.methods.getOwnedDomains(account).call();
        document.getElementById('output').innerText = `Owned Domains: ${domains.join(', ')}`;
      } catch (error) {
        console.error("Error listing owned domains:", error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
      }
    });

    // Delete DNS Record
    document.getElementById('deleteRecordButton').addEventListener('click', async () => {
      const domain = document.getElementById('domainInput').value;
      try {
        console.log("Deleting DNS Record:", domain);
        await contract.methods.deleteDNSRecord(domain).send({ from: account });
        document.getElementById('output').innerText = `DNS Record for ${domain} deleted`;
      } catch (error) {
        console.error("Error deleting record:", error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
      }
    });

    // Transfer Ownership
    document.addEventListener('DOMContentLoaded', () => {
      // Ensure the button exists in the DOM
      const transferButton = document.getElementById('transferOwnershipButton');
      if (!transferButton) {
          console.error("Transfer Ownership button not found in the DOM.");
          return;
      }
  
      // Event listener for transferring ownership
      transferButton.addEventListener('click', async () => {
          console.log("Transfer Ownership button clicked.");
  
          // Ensure the required input fields exist
          const domainInput = document.getElementById('domainInput');
          const newOwnerInput = document.getElementById('newOwnerInput');
  
          if (!domainInput || !newOwnerInput) {
              alert("Input fields for domain or new owner are missing in the DOM.");
              return;
          }
  
          // Get values from input fields and trim whitespace
          const domain = domainInput.value.trim();
          const newOwner = newOwnerInput.value.trim();
  
          // Validate input fields
          if (!domain || !newOwner) {
              alert("Both the domain name and the new owner's address are required.");
              return;
          }
  
          try {
              console.log(`Attempting to transfer ownership of domain: ${domain} to new owner: ${newOwner}`);
              
              // Provide feedback to the user
              document.getElementById('output').innerText = "Processing transfer...";
  
              // Call the smart contract method to transfer ownership
              await contract.methods.transferOwnership(domain, newOwner).send({ from: account });
  
              // Update the output on success
              document.getElementById('output').innerText = `Ownership of "${domain}" successfully transferred to "${newOwner}".`;
          } catch (error) {
              // Log and display any errors
              console.error("Error during transfer ownership:", error);
              document.getElementById('output').innerText = `Error: ${error.message || "An unknown error occurred."}`;
          }
      });
  
      console.log("Transfer Ownership script initialized successfully.");
  });
  
  

    // Renew Domain
    document.getElementById('renewDomainButton').addEventListener('click', async () => {
      const domain = document.getElementById('domainInput').value;
      try {
        // Show a loading message while the transaction is in progress
        document.getElementById('output').innerText = `Renewing domain: ${domain}...`;
    
        // Send the renewal transaction
        await contract.methods.renewDomain(domain).send({ from: account });
    
        // Fetch the updated DNS record to get the new expiry date
        const record = await contract.methods.getDNSRecord(domain).call();
        const expiryDate = Number(record[3]);
    
        // Display the success message and the updated expiry date
        document.getElementById('output').innerText = `${domain} domain renewed. New expiry date: ${new Date(expiryDate * 1000).toLocaleDateString()}`;
    
      } catch (error) {
        console.error("Error renewing domain:", error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
      }
    });

  } else {
    alert('Please install MetaMask!');
  }
});
