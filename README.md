# General Lottery Dapp

This repository contains a basic backend implementation for managing lottery rounds.

## Backend Setup

1. Navigate to the `backend` folder.
2. Install dependencies with `npm install`.
3. Configure environment variables in a `.env` file:
   - `MONGODB_URI` – MongoDB connection string.
   - `WEB3_PROVIDER` – URL of the Ethereum node.
   - `CONTRACT_ADDRESS` – Deployed lottery contract address.
4. Start the server with `npm start`.

The backend exposes endpoints under `/round` for starting a round, closing a round, and retrieving round status.
