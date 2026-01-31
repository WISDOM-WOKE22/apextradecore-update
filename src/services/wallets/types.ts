/** Raw wallet record in Realtime DB: wallets/{id} */
export interface WalletRecord {
  name: string;
  address: string;
  /** Network or chain (e.g. "Ethereum (ERC-20)", "Bitcoin", "TRC-20") so users know which network to deposit on */
  networkChain?: string;
  enabled: boolean;
  order?: number;
  createdAt: number;
}

/** Wallet with id for list/detail */
export interface Wallet {
  id: string;
  name: string;
  address: string;
  /** Network or chain for deposits */
  networkChain: string;
  enabled: boolean;
  order: number;
  createdAt: number;
}
