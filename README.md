# General-Lottery-Dapp

This repository contains a simple frontend for interacting with a lottery smart contract.

## Frontend

The `frontend/` directory now hosts a small [Vite](https://vitejs.dev/) React application. It requires node and npm to install dependencies and run.

### Features
- Buy lottery tickets using your connected wallet
- View the current prize pool
- Display the list of previous winners

The app expects backend API endpoints at `/api/buy`, `/api/pool` and `/api/winners` which should be provided by the server handling the smart contract interactions.

### Running
Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

Then open the displayed URL (usually http://localhost:5173) in a browser with MetaMask installed to interact with the dapp.
