export interface NewPairEventValue {
  token: string;
  nftAddress: string;
  poolType: number;
  initialNFTIDs: bigint[];
  initialTokenBalance: bigint;
  spotPrice: bigint;
  delta: bigint;
  fee: bigint;
  bondingCurve: string;
  assetRecipient: string;
  name: string;
  blockNumber: number;
  chainName: string;
  owner: string;
}
export interface NewPairEvent {
  address: string;
  event: NewPairEventValue;
}

export interface IERC721TokenMetadata {
  attributes: {
    trait_type: string;
    value: string;
  };
  image: string;
}
export interface IERC721Token {
  tokenId: string;
  tokenUri: string;
  metadata: IERC721TokenMetadata;
  chainName: string;
}
