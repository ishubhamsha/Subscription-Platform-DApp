#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, Symbol, Address, String, log, panic_with_error, xdr::{ScErrorType, ScErrorCode}};

#[contracttype]
#[derive(Clone)]
pub struct Lease {
    pub lease_id: u64,
    pub asset_name: String,
    pub asset_desc: String,
    pub owner: Address,
    pub lessee: Option<Address>,
    pub start_time: u64,
    pub end_time: u64,
    pub amount_xlm: i128,
    pub is_active: bool,
    pub is_returned: bool,
}

#[contracttype]
pub enum Leasebook {
    Lease(u64),
}

const LEASE_CNT: Symbol = symbol_short!("LEASE_CNT");

#[contract]
pub struct LeaseContract;

#[contractimpl]
impl LeaseContract {
    pub fn create_lease(
        env: Env,
        asset_name: String,
        asset_desc: String,
        amount_xlm: i128,
        duration_seconds: u64,
    ) -> u64 {
        let mut lease_id: u64 = env.storage().instance().get(&LEASE_CNT).unwrap_or(0);
        lease_id += 1;

        let timestamp = env.ledger().timestamp();
        let lease = Lease {
            lease_id,
            asset_name,
            asset_desc,
            owner: env.current_contract_address(),
            lessee: None,
            start_time: timestamp,
            end_time: timestamp + duration_seconds,
            amount_xlm,
            is_active: true,
            is_returned: false,
        };

        env.storage().instance().set(&Leasebook::Lease(lease_id), &lease);
        env.storage().instance().set(&LEASE_CNT, &lease_id);
        log!(&env, "Lease Created with ID: {}", lease_id);
        lease_id
    }

    pub fn lease_asset(env: Env, lease_id: u64, lessee: Address) {
        let mut lease: Lease = Self::view_lease(env.clone(), lease_id);
        if lease.is_active && lease.lessee.is_none() {
            lease.lessee = Some(lessee);
            lease.start_time = env.ledger().timestamp();
            env.storage().instance().set(&Leasebook::Lease(lease_id), &lease);
            log!(&env, "Asset Leased with ID: {}", lease_id);
        } else {
            panic_with_error!(&env, (ScErrorType::Context, ScErrorCode::InvalidAction));
        }
    }

    pub fn return_asset(env: Env, lease_id: u64) {
        let mut lease: Lease = Self::view_lease(env.clone(), lease_id);
        if lease.is_active && !lease.is_returned {
            lease.is_returned = true;
            lease.is_active = false;
            env.storage().instance().set(&Leasebook::Lease(lease_id), &lease);
            log!(&env, "Asset Returned with ID: {}", lease_id);
        } else {
            panic_with_error!(&env, (ScErrorType::Context, ScErrorCode::InvalidAction));
        }
    }

    pub fn view_lease(env: Env, lease_id: u64) -> Lease {
        env.storage().instance().get(&Leasebook::Lease(lease_id)).unwrap_or_else(|| {
            panic_with_error!(&env, (ScErrorType::Context, ScErrorCode::InvalidInput));
        })
    }

    pub fn get_total_leases(env: Env) -> u64 {
        env.storage().instance().get(&LEASE_CNT).unwrap_or(0)
    }
} 