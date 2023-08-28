import { observable, action, computed } from 'mobx';
// @ts-ignore
import { BaseStore, getOrCreateStore } from 'next-mobx-wrapper';

export class Cart extends BaseStore {
  @observable data: any = {
    show: false,
    collection: {},
    delNft: {}
  };

  @computed get collection() {
    try {
      return this.data.collection;
    } catch {
      return {};
    }
  }
  @computed get show() {
    return this.data.show;
  }
  @action.bound
  toggleShow(bool?: boolean) {
    if (typeof bool === 'boolean') {
      this.data.show = bool;
    } else {
      this.data.show = !this.data.show;
    }
  }
  @action.bound
  setData(List: any, collection: string) {
    const data = this.data;
    data.collection[collection] = List;
    this.data = JSON.parse(JSON.stringify(data));
  }
  @action.bound
  setDelNft(nft: any) {
    this.data.delNft = nft;
  }
}

export const getCart = getOrCreateStore('cart', Cart);
