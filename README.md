# VAULT.ETH

VAULT.ETH is a decentralized file vault prototype built with **Solidity + Hardhat + React + Ethers**.  
It lets wallet owners upload files to IPFS (via Pinata), store file URLs on-chain, and grant/revoke read access for other addresses.

## Features

- Upload files to IPFS and persist the resulting URL in a smart contract
- Query your own or shared vault files from the dApp UI
- Grant and revoke access permissions per wallet address
- Local-first development with Hardhat network and Vite frontend

## Repository Structure

```text
VAULT.ETH/
├── contracts/Upload.sol           # Main smart contract
├── scripts/deploy.js              # Hardhat deployment script
├── hardhat.config.js              # Hardhat config (artifacts emitted to frontend)
├── my-app/                        # React + Vite frontend
│   ├── src/App.jsx                # Wallet + contract bootstrap
│   └── src/components/            # Upload, display, and sharing UI
└── README.md
```

## Tech Stack

- **Smart contracts:** Solidity `0.8.14`
- **Blockchain tooling:** Hardhat
- **Frontend:** React + Vite + Tailwind CSS
- **Web3 client:** Ethers.js
- **Storage:** IPFS (Pinata API)

## Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Pinata account and upload credentials

## Quick Start (Local Development)

### 1) Install dependencies

From repository root:

```bash
npm install
cd /home/runner/work/VAULT.ETH/VAULT.ETH/my-app
npm install
```

### 2) Start local blockchain

From repository root:

```bash
npx hardhat node
```

Keep this running in a separate terminal.

### 3) Deploy contract to local node

From repository root (new terminal):

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4) Configure frontend env

Create `/home/runner/work/VAULT.ETH/VAULT.ETH/my-app/.env`:

```env
VITE_PINATA_JWT=your_pinata_jwt
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs
```

### 5) Run frontend

From `/home/runner/work/VAULT.ETH/VAULT.ETH/my-app`:

```bash
npm run dev
```

Open the Vite URL, connect MetaMask to `http://127.0.0.1:8545` (chain id `31337`), and import one of the Hardhat test accounts.

## Smart Contract Overview

`Upload.sol` stores:

- `values[address]`: array of file/IPFS URLs for each owner
- `ownership[owner][viewer]`: permission mapping
- `accesslist[owner]`: share registry displayed by the UI

Core methods:

- `add(address user, string url)` — save uploaded file URL
- `give_access(address user)` — grant vault access
- `remove_Access(address user)` — revoke vault access
- `display(address user)` — return files if caller is owner or allowed viewer
- `share_access()` — list current/previous sharing entries for caller

## Useful Commands

From repository root:

```bash
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

From `my-app`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- Hardhat artifacts are configured to output directly into `my-app/src/artifacts`.
- `my-app/src/App.jsx` currently points to the common local deployment address `0x5FbDB2315678afecb367f032d93F642f64180aa3`.
- Before production use, remove any hardcoded API keys and use environment variables/secrets only.

## Future Improvements

- Replace local-only assumptions with multi-network support
- Add complete contract test coverage for `Upload.sol`
- Add backend-less pinning flow with safer credential handling
- Add file metadata, pagination, and richer access audit history
