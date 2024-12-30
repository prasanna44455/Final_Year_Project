window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request access to accounts

      // Initialize Web3 without 'import'
      const web3 = new Web3(window.ethereum); // Web3 is available globally after including the script

      // Contract details
      const contractAddress = "0x4fc1748DAc98dbB4D7fE6295A85A4fA7F2568b98"; // Replace with your deployed contract address
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
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ]
      // Create a contract instance
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // DOM Elements
      const domainInput = document.getElementById('domainInput');
      const ipInput = document.getElementById('ipInput');
      const addRecordButton = document.getElementById('addRecordButton');
      const getRecordButton = document.getElementById('getRecordButton');
      const output = document.getElementById('output');

      // Add Record
      addRecordButton.addEventListener('click', async () => {
        const domain = domainInput.value;
        const ip = ipInput.value;

        try {
          const accounts = await web3.eth.getAccounts();
          await contract.methods.addDNSRecord(domain, ip).send({ from: accounts[0] });
          output.textContent = `Record added successfully for domain: ${domain}`;
        } catch (error) {
          console.error('Error adding record:', error);
          output.textContent = 'Error adding record. Check the console for details.';
        }
      });

      // Get Record
      getRecordButton.addEventListener('click', async () => {
        const domain = domainInput.value;

        try {
          const ip = await contract.methods.getDNSRecord(domain).call();
          output.textContent = `IP Address for ${domain}: ${ip}`;
        } catch (error) {
          console.error('Error fetching record:', error);
          output.textContent = 'Error fetching record. Check the console for details.';
        }
      });
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
    }
});
