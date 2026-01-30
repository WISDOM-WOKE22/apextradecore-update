/** Raw wallet record in Realtime DB: wallets/{id} */
export interface WalletRecord {
  name: string;
  address: string;
  enabled: boolean;
  order?: number;
  createdAt: number;
}

/** Wallet with id for list/detail */
export interface Wallet {
  id: string;
  name: string;
  address: string;
  enabled: boolean;
  order: number;
  createdAt: number;
}
