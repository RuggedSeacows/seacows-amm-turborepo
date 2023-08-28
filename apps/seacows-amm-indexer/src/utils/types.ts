import { LogType } from '@prisma/client';

export interface NewPairEventValue {
  token: string;
  nft_address: string;
  type: number;
  initial_nft_ids: string[];
  initial_token_balance: string;
  spot_price: string;
  delta: string;
  fee: string;
  bonding_curve: string;
  asset_recipient: string;
  name: string;
  owner: string;
}

export type SellTransactionInfo = {
  type: string;
  ethAmount: string;
  owner: string;
  minOutput: string;
  tokenRecipient: string;
  swapList: SwapList;
};

export type BuyTransactionInfo =
  | {
      type: string;
      ethAmount: string;
      owner: string;
      swapList: SwapList;
      inputAmount: string;
      nftRecipient: string;
    }
  | {
      type: string;
      ethAmount: string;
      owner: string;
      swapList: SwapList;
      ethRecipient: string;
      nftRecipient: string;
    };

export type SwapList = Array<{
  pair: string;
  nftIds: string[];
}>;

export type WithdrawInfo = {
  token: string;
  amount: string;
  owner: string;
};

export type SwapResponse = {
  value: SellTransactionInfo | BuyTransactionInfo | WithdrawInfo;
  type: LogType;
  volume: string;
};

// Center API
export type CollectionMetadata = {
  address: string;
  creator: string;
  name: string;
  numAssets: number;
  owner: string;
  smallPreviewImageUrl: string;
  symbol: string;
  url: string;
};
