import style from './index.module.scss';
import { EthLogo, Close, Flash, EthIcon, Downhover, Warninghover, Tokenheadplaceholder } from '@components/index';
import { useEffect, useState } from 'react';
import React from 'react';
import { inject, observer } from 'mobx-react';
import Route from 'next/router';
import { web3, ERC20Approved, approveErc20, listenTransaction } from '@utils/contract';
import { getTokens, getNetWorkPre } from '@utils/index';
import cloneDeep from 'lodash/cloneDeep';
import { coin2$ } from '@utils/coinGecko';
import { addHistory } from '@utils/wallet';
import { nets, Net } from '@lib/net';
import Tip from '@src/components/Tip';
import { getBuyNFTQuote } from '@utils/contract/ai';
import Warning from '@src/components/Common/Warning';
import { swapETHForAnyNFTs, swapERC20ForAnyNFTs } from '@utils/contract/index';
import { SeacowsRouterAddress } from '@lib/contract';
import ConfirmBuy from '@components/ConfirmBuy';
@inject('globalStore')
@inject('cart')
@observer
class Cart extends React.Component {
  state: Readonly<any> = {
    usd: 1,
    nfts: [],
    approving: false,
    wallet: {},
    txhash: [],
    showSuccess: false,
    showTip: false,
    showErr: false,
    preview: false
  };
  constructor(props: any) {
    super(props);
    const { collection } = Route.query;
    this.state = {
      nfts: props.data?.collection[collection as any] || [],
      wallet: props.wallet,
      txhash: [],
      preview: false
    };
  }
  componentDidMount() {
    const { wallet } = this.state as any;
    coin2$(wallet.chainId).then((res) => {
      this.setState({
        usd: res
      });
    });
  }
  componentDidUpdate() {}
  async clickBtn(approveToken: any) {
    const { txhash, approving } = this.state;
    const { data, wallet, login, cart, globalStore } = this.props as any;
    const { collection } = Route.query;
    const nfts = cloneDeep(data?.collection[collection as any] || []);
    if (!!approveToken?.name && !approving) {
      this.setState({ approving: true });
      console.log(wallet.tokens, approveToken);
      const token = wallet.tokens.find(
        (item: any) => item.token_address.toLocaleLowerCase() === approveToken.token_address.toLocaleLowerCase()
      );
      approveErc20(
        wallet.address,
        wallet.chainId,
        approveToken.token_address,
        token?.balance,
        SeacowsRouterAddress
      ).then((tx) => {
        if (tx) {
          addHistory({
            tx: tx,
            name: `Approve ${token.label}`,
            status: '',
            address: wallet.address,
            chain: wallet.chainId
          });
          listenTransaction(tx, wallet.chainId, (trx: boolean) => {
            if (trx) {
              this.setState({
                approving: false
              });
              nfts.forEach((item: any) => {
                if (item.approveToken && item.approveToken.token_address === approveToken.token_address) {
                  delete item.approveToken;
                }
              });
              cart.setData(nfts, collection);
            }
          });
        } else {
          this.setState({ approving: false });
        }
      });
    } else if (!approving) {
      this.setState({
        preview: true
      });
    }
  }
  async submit() {
    const { txhash } = this.state;
    const { data, wallet, globalStore } = this.props as any;
    const { collection } = Route.query;
    const nfts = cloneDeep(data?.collection[collection as any] || []);
    this.setState({ showTip: true, preview: false });
    const erc20swapList = nfts
      .filter((item: any) => item.tokenMetaData.token_address)
      .map((item: any) => ({
        pair: item.pool,
        nftIds: item.items.map((_item: any) => _item.tokenId)
      }));
    const ethswapList = nfts
      .filter((item: any) => !item.tokenMetaData.token_address)
      .map((item: any) => ({
        pair: item.pool,
        nftIds: item.items.map((_item: any) => _item.tokenId)
      }));
    console.log(nfts, ethswapList, 'ethswapList');
    if (ethswapList.length) {
      const inputAmount = nfts
        .filter((item: any) => !item.tokenMetaData.token_address)
        .reduce(
          (total: number, item: any) =>
            item.items.reduce((_total: number, _item: any) => Number(_item?.price?.inputAmount) + _total, 0) + total,
          0
        );
      swapETHForAnyNFTs(ethswapList, inputAmount, wallet.address, wallet.chainId).then((tx: string) => {
        if (tx) {
          this.setState({ showTip: false, txhash: [...txhash, tx], showSuccess: true });
          const nftNumber = ethswapList.reduce((total: number, item: any) => item.nftIds.length + total, 0);
          addHistory({
            tx: tx,
            name: `Swap ${web3.utils.fromWei(String(inputAmount))} ETH for ${nftNumber} Nft`,
            status: '',
            address: wallet.address,
            chain: wallet.chainId
          });
          globalStore.updateTx();
          this.clearCart();
        } else {
          this.setState({ showTip: false, showErr: true });
        }
      });
    }
    if (erc20swapList.length) {
      const inputAmount = nfts
        .filter((item: any) => item.tokenMetaData.token_address)
        .reduce(
          (total: number, item: any) =>
            item.items.reduce((_total: number, _item: any) => Number(_item?.price?.inputAmount) + _total, 0) + total,
          0
        );
      swapERC20ForAnyNFTs(erc20swapList, String(inputAmount), wallet.address, wallet.chainId).then((tx: string) => {
        if (tx) {
          this.setState({ showTip: false, txhash: [...txhash, tx], showSuccess: true });
          const nftNumber = erc20swapList.reduce((total: number, item: any) => item.nftIds.length + total, 0);
          addHistory({
            tx: tx,
            name: `Swap ${web3.utils.fromWei(String(inputAmount))} Token for ${nftNumber} Nft`,
            status: '',
            address: wallet.address,
            chain: wallet.chainId
          });
          globalStore.updateTx();
          this.clearCart();
        } else {
          this.setState({ showTip: false, showErr: true });
        }
      });
    }
  }
  clearCart = () => {
    const { cart } = this.props as any;
    const { collection } = Route.query;
    cart.setData(null, collection);
  };
  render(): React.ReactNode {
    const { data, wallet, login, cart } = this.props as any;
    const { usd, approving, showTip, showSuccess, showErr, txhash, preview } = this.state as any;
    const { collection } = Route.query;
    const nfts = data?.collection[collection as any] || [];
    const clearCart = () => {
      cart.setData(null, collection);
    };

    const removeCart = async (id: string, tokenId: string, pool: string, nft: any) => {
      const _nfts = cloneDeep(nfts);
      const index = _nfts.findIndex((item: any) => item.tokenMetaData.symbol === id);
      const _index = _nfts[index].items.findIndex((item: any) => item.tokenId === tokenId);
      _nfts[index].items.splice(_index, 1);
      // let num = _nfts[index].items.reduce((total: number, item: any) => item.pool === pool ? total + 1 : '', 0)
      // const price = await getBuyNFTQuote(num || 1, pool, wallet.chainId)
      // _nfts[index].items.forEach((item: any) => {
      //   if (item.pool === pool) item.price = price
      // })
      const needupdateActiveNft = _nfts[index].items
        .filter((item: any) => item.pool === pool && item.price.inputAmount > nft.price.inputAmount)
        .sort((a: any, b: any) => a.price.inputAmount - b.price.inputAmount);
      needupdateActiveNft.reverse().forEach((_item: any, _index: number) => {
        if (_index === needupdateActiveNft.length - 1) {
          _item.price = cloneDeep(nft.price);
        } else {
          _item.price = needupdateActiveNft[_index + 1].price;
        }
      });
      cart.setDelNft(nft);
      cart.setData(_nfts, collection);
    };
    const getTotal = () => {
      return 0;
    };
    const approveTokens: any = [];
    nfts?.forEach((item: any) => {
      if (item.approveToken) {
        approveTokens.push(item.approveToken);
      }
    });
    const getText = () => {
      if (!login) {
        return 'Connect Wallet';
      } else if (!nfts.length) {
        return 'Select an NFT';
      } else if (approveTokens.length && approving) {
        return `Approving ${approveTokens[0]?.name}...`;
      } else if (approveTokens.length) {
        return `Approve ${approveTokens[0]?.name}`;
      } else {
        return 'Swap';
      }
    };
    return (
      <div className={style.cart}>
        <div className={style.selllist}>
          <h2>
            <p>Receive</p>
            {!!nfts.length && <span onClick={clearCart}>Clear</span>}
          </h2>
          <div className={style.sells}>
            <ul className={style.sellCollection}>
              {nfts.map((item: any, index: number) =>
                item.items.map((_item: any, _index: number) => (
                  <li key={_index}>
                    <Close
                      className={style.closeicon}
                      onClick={() => removeCart(_item.tokenMetaData.symbol, _item.tokenId, item.pool, _item)}
                      fill="#fff"
                    />
                    <img src={_item.smallPreviewImageUrl} alt="" />
                    <div>
                      <span>ID #{_item.tokenId}</span>
                      <p>
                        {item.tokenMetaData.token_address ? (
                          <Tokenheadplaceholder style={{ fontSize: '12px' }} />
                        ) : (
                          nets.find((item: Net) => item.chainId === wallet.chainId)?.icon
                        )}
                        <strong>{Number(web3.utils.fromWei(_item?.price?.inputAmount)).toFixed(4)}</strong>
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          {!nfts.length && <div className={style.sellempty}></div>}
          <div className={style.join}>
            <Flash className={style.joinIcon} />
          </div>
        </div>
        <div className={style.receive}>
          <h2>Pay</h2>
          {nfts.map((item: any, index: number) => {
            const price = item.items
              .reduce((_total: number, _item: any) => Number(web3.utils.fromWei(_item?.price?.inputAmount)) + _total, 0)
              .toFixed(4);
            return (
              <div key={index} className={style.receives}>
                <div className={style.receiveimgs}>
                  {item.tokenMetaData.token_address ? (
                    <Tokenheadplaceholder style={{ fontSize: '24px' }} />
                  ) : (
                    nets.find((item: Net) => item.chainId === wallet.chainId)?.icon
                  )}
                  {item.items.map((_item: any, _index: number) => (
                    <img
                      style={{ marginLeft: `-16px`, zIndex: `${item.items.length - _index}` }}
                      key={_index}
                      src={_item.smallPreviewImageUrl || '/img/nonft.png'}
                      alt=""
                    />
                  ))}
                </div>
                <div className={style.receiveprice}>
                  <p>
                    {price} {item?.tokenMetaData?.name}{' '}
                  </p>
                  <span>$ {price * usd}</span>
                </div>
              </div>
            );
          })}
        </div>
        {nfts.map((item: any, index: number) => (
          <div key={index}>
            {item.exceeds ? (
              <div style={{ marginTop: '12px' }}>
                <Warning text={`${item.exceeds?.name} exceeds wallet balance.`} />
              </div>
            ) : (
              ''
            )}
          </div>
        ))}
        {!login && (
          <div className={style.tip}>
            <Warninghover className={style.icon} fill="#F6B672" />
            <p>Please connect your wallet to select an NFT to sell.</p>
          </div>
        )}
        <button
          className={`${style.btn} ${!nfts.length && login && style.def} `}
          onClick={this.clickBtn.bind(this, approveTokens[0])}
        >
          {getText()}
        </button>
        {showTip && (
          <Tip
            close={() => this.setState({ showTip: false })}
            title="Waiting For Confirmation"
            tip={''}
            desc="Confirm this transaction in you wallet"
          />
        )}
        {showSuccess && (
          <Tip
            close={() => this.setState({ showSuccess: false, txhash: [] })}
            btnClick={() => this.setState({ showSuccess: false })}
            type="success"
            title="Transaction Submitted"
            tip={txhash.map((item: string, index: number) => (
              <a key={index} target="_blank" href={`${getNetWorkPre(wallet.chainId)}/tx/${item}`}>
                {'View on Explorer'}
              </a>
            ))}
            showbtn={true}
            text="Close"
          />
        )}
        {showErr && (
          <Tip
            close={() => this.setState({ showErr: false })}
            btnClick={() => this.setState({ showErr: false })}
            type="danger"
            title="Transaction Rejected"
            showbtn={true}
            text="Dismiss"
          />
        )}
        {preview && (
          <ConfirmBuy
            sells={nfts}
            close={() => this.setState({ preview: false })}
            onsubmit={this.submit.bind(this)}
            wallet={wallet}
          />
        )}
      </div>
    );
  }
}

export default Cart;
