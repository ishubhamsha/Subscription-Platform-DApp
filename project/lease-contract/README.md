# Lease Contract

This is a Soroban smart contract for managing asset leases on the Stellar network.

## Prerequisites

1. Install Rust: https://rustup.rs/
2. Install the Soroban CLI:
   ```bash
   cargo install --locked soroban-cli
   ```

## Building the Contract

1. Navigate to the contract directory:
   ```bash
   cd lease-contract
   ```

2. Build the contract:
   ```bash
   cargo build --target wasm32-unknown-unknown --release
   ```

## Deploying the Contract

1. Deploy to Futurenet:
   ```bash
   soroban contract deploy \
     --wasm target/wasm32-unknown-unknown/release/lease_contract.wasm \
     --source <your-secret-key> \
     --rpc-url https://rpc-futurenet.stellar.org:443 \
     --network-passphrase "Test SDF Future Network ; October 2022"
   ```

## Frontend Integration

To integrate with your frontend, you'll need to:

1. Install the required dependencies:
   ```bash
   npm install @stellar/stellar-sdk
   ```

2. Use the following example to interact with the contract:

```typescript
import { Contract, Networks, TransactionBuilder, xdr } from '@stellar/stellar-sdk';

// Initialize the contract
const contract = new Contract(
  '<your-contract-id>',
  {
    networkPassphrase: Networks.FUTURENET,
    rpcUrl: 'https://rpc-futurenet.stellar.org:443'
  }
);

// Example: Create a lease
async function createLease(assetName: string, assetDesc: string, amountXlm: number, durationSeconds: number) {
  const result = await contract.call(
    'create_lease',
    assetName,
    assetDesc,
    amountXlm,
    durationSeconds
  );
  return result;
}

// Example: View a lease
async function viewLease(leaseId: number) {
  const result = await contract.call('view_lease', leaseId);
  return result;
}
```

## Contract Functions

- `create_lease(asset_name, asset_desc, amount_xlm, duration_seconds)`: Creates a new lease
- `lease_asset(lease_id, lessee)`: Assigns a lessee to an available lease
- `return_asset(lease_id)`: Marks an asset as returned
- `view_lease(lease_id)`: Retrieves lease details
- `get_total_leases()`: Returns the total number of leases 