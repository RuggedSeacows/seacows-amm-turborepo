import { observable, action, computed } from 'mobx';
// @ts-ignore
import { BaseStore, getOrCreateStore } from 'next-mobx-wrapper';
interface WalletData {
  address: string;
  balabce: string;
  type: string;
  chainId: string;
  tokens: Array<any>;
}

export class GlobalStore extends BaseStore {
  @observable walletData: WalletData | any = {
    address: '',
    balabce: '0.00',
    type: '',
    chainId: '',
    tokens: []
  };
  @observable tx: number = 0;

  @computed get wallet() {
    try {
      return this.walletData;
    } catch {
      return '';
    }
  }
  @computed get connect() {
    return !!this.walletData.address;
  }

  @action.bound
  updateTx() {
    this.tx = this.tx + 1;
  }

  @action.bound
  setWallet(walletData: WalletData) {
    this.walletData = JSON.parse(JSON.stringify(walletData));
  }
}

export const getGlobalStore = getOrCreateStore('globalStore', GlobalStore);
