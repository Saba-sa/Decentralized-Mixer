document.addEventListener('DOMContentLoaded', async () => {
    const contractAddress = '0x11DF48dA2263885f1EF027934c525095aA73386e';
    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "participant",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "CoinMixed",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "recipientAddress",
                    "type": "address"
                }
            ],
            "name": "joinMix",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "WithdrawExecuted",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "getParticipants",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "depositor",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "recipient",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct CoinJoin.Participant[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "MIN_PARTICIPANTS",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "MIX_AMOUNT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "participants",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "depositor",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]; // Your contract's ABI

    let accounts;
    let mixerContract;

    function getBlockie(address) {
        if (blockies) {
            return blockies.create({ seed: address, size: 8, scale: 16 }).toDataURL();
        } else {
            throw new Error('Blockies is not defined.');
        }
    }

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            accounts = await web3.eth.getAccounts();
            mixerContract = new web3.eth.Contract(contractABI, contractAddress);

            updateUI();
        } catch (error) {
            console.error('User denied account access...', error);
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    document.getElementById('connectButton').addEventListener('click', async () => {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            accounts = await web3.eth.getAccounts();
            updateUI();
        } catch (error) {
            console.error('User denied account access...', error);
        }
    });

    document.getElementById('depositForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const recipientAddress = document.getElementById('recipientAddress').value;
        const amount = document.getElementById('depositValue').value;
        const amountInWei = web3.utils.toWei("1", 'ether');
        try {
            const currentAccount = accounts[0];

            // Call the joinMix function from the Smart Contract
            await mixerContract.methods.joinMix(recipientAddress).send({
                from: currentAccount,
                value: amountInWei
            })
        } catch (error) {
            console.error('Error during deposit:', error);
            alert('Deposit failed!');
        }
    });

    // Function to update the UI with connected wallet details
    function updateUI() {
        if (accounts && accounts.length > 0) {
            // Remove the connect button and show the forms
            document.getElementById('connectButton').style.display = 'none';
            document.getElementById('walletInfo').classList.remove('hidden');
            document.getElementById('depositForm').style.display = 'block';

            // Display connected wallet address
            const walletAddressElement = document.getElementById('walletAddress');
            const account = accounts[0];
            walletAddressElement.innerText = `Wallet Address: ${account}`;

            // Display wallet balance
            updateBalance(account);

            // Generate and display wallet blockie image
            const blockieImage = getBlockie(account);
            document.getElementById('walletBlockie').style.backgroundImage = `url(${blockieImage})`;
        }
    }

    // Function to fetch and update the wallet's balance
    async function updateBalance(account) {
        const balance = await web3.eth.getBalance(account);
        const ethBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('walletBalance').innerText = `Wallet Balance: ${parseFloat(ethBalance).toFixed(4)} ETH`;
    }

    // Function to generate a blockie image URL
    function getBlockie(address) {
        return blockies.create({ seed: address, size: 8, scale: 16 }).toDataURL();
    }
});