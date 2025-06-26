# General Lottery Dapp

This project is a simple template for a decentralized lottery application. It is organized into four main parts:

- **contracts/** – Solidity smart contracts.
- **backend/** – Node.js server that interacts with the blockchain.
- **frontend/** – Client-side code for interacting with the lottery contract.
- **scripts/** – Automation and deployment scripts.

## Features

- Solidity smart contract in `contracts/Lottery.sol` that allows players to enter and the manager to pick a winner.
- Express backend with API endpoints to enter the lottery and list current players.
- Simple frontend scaffold ready for integration with your framework of choice.
- Deployment and automation scripts in the `scripts` directory.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   npm start
   ```
3. Open `frontend/index.html` in a browser to view the basic UI.

The backend expects the following environment variables when connecting to a blockchain:

| Variable | Description |
| -------- | ----------- |
| `RPC_URL` | URL of the Ethereum node to connect to |
| `CONTRACT_ADDRESS` | Address of the deployed Lottery contract |
| `PRIVATE_KEY` | Private key used to sign transactions (optional for read-only) |

## Deployment

Deployment scripts live inside `scripts/`. A basic Hardhat script is provided:

```bash
npx hardhat run scripts/deploy.js --network <network>
```

Make sure Hardhat is installed and configured for your network of choice.
