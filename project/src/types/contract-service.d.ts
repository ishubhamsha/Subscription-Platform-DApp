declare module '../../contract-service' {
  export const CONTRACT_ADDRESS: string;
  
  export function checkWalletConnection(): Promise<boolean>;
  export function createLease(params: any): Promise<any>;
  export function viewLease(id: string): Promise<any>;
  export function leaseAsset(id: string): Promise<any>;
  export function returnAsset(id: string): Promise<any>;
  export function getTotalLeases(): Promise<number>;
  export function connectToContract(): Promise<boolean>;
} 