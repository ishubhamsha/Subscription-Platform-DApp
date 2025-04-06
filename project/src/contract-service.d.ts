declare module '../../contract-service' {
  export const CONTRACT_ADDRESS: string;
  
  export function checkWalletConnection(): Promise<boolean>;
  export function createLease(params: any): Promise<{success: boolean, id: string}>;
  export function viewLease(id: string): Promise<{id: string, status: string, details: string}>;
  export function leaseAsset(id: string): Promise<{success: boolean, transaction: string}>;
  export function returnAsset(id: string): Promise<{success: boolean, transaction: string}>;
  export function getTotalLeases(): Promise<number>;
  export function connectToContract(): Promise<boolean>;
}

declare module 'contract-service' {
  export * from '../../contract-service';
} 