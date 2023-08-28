// Songchain network
export type Network = 'mainnet' | 'goerli';

export type SupportedContract = 'SeacowsPairFactory';

export type AppConfig = {
  RPC_URL: string;
  REDIS_URL: string;
  NETWORK: Network;
  FILTER_BLOCK_STEP: number;
  ADDRESSES: Record<Network, Record<SupportedContract, string>>;
};
