import { useEffect, useState } from 'react';
import style from './index.module.scss';
import {
  EthLogo,
  Close,
  Flash,
  EthIcon,
  Downhover,
  Warninghover,
  Nftheadplaceholder,
  Tokenheadplaceholder,
  Cardnull,
  Notifaction
} from '@components/index';
import Select from '@components/Select';
import ConnectWallet from '@components/ConnectDialog';
import SelectToken from '@components/SelectToken';
import ConfirmSwap from '@components/ConfirmSwap';
import { addHistory } from '@utils/wallet';
import Tip from '@src/components/Tip';
import NftCard from '@components/NftCard';
import { coin2$ } from '@utils/coinGecko';
import { getCardSize, getUserNfts, tranceAddress, getTokenMetadata, getNetWorkPre } from '@utils/index';
import { web3, needApprove as isNeedApprove, approve, listenTransaction, swapNFTsForToken } from '@utils/contract';
import { getSellNFTQuote, getDetails } from '@utils/contract/ai';
import Empty from '@components/Empty';
import SelectPool from '@components/SelectPool';
import { queryPool } from '@api/pool';
import Router from 'next/router';
import cloneDeep from 'lodash/cloneDeep';
import { SeacowsRouterAddress } from '@lib/contract';
interface Props {
  login: boolean;
  wallet: any;
  store: any;
  globalStore: any;
}
const Sell = (props: Props) => {
  const { login, wallet, store, globalStore } = props;
  const [usd, setUsd] = useState(1);
  const [showTip, setShowTip] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [sells, setSells] = useState<Array<any>>([]);
  const [collection, setCollection] = useState<Array<any>>([]);
  const [token, setToken] = useState('ETH');
  const [filterKey, setFilterKey] = useState('');
  const [showConnect, setShowAccount] = useState(false);
  const [showSelectToken, setShowSelectToken] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [needApprove, setNeedApprove] = useState(false);
  const [approving, setApproving] = useState(false);
  const [swaping, setSwaping] = useState(false);
  const [size, setSize] = useState(120);
  const [nfts, setNfts] = useState<any>([]);
  const [limit, setLimit] = useState(20);
  const [nfttotal, setNftTotal] = useState(0);
  const [cursor, setCursor] = useState('');
  const [txhash, setTxHash] = useState('');
  let loading = false;
  const [showSelectPool, setShowSelectPool] = useState<string>('');
  const connectSuccess = async (data: any) => {
    store.setWallet({
      address: data.address,
      balance: data.balance,
      type: localStorage.getItem('wallet') || ''
    });
  };
  const clearSell = async () => {
    setSells([]);
    const _collection = cloneDeep(collection);
    const poolList = _collection.map((item: any) => item.currentPool);
    let regarr: any = [];
    poolList.forEach((item: any) => item && regarr.push(getSellNFTQuote(1, item, wallet.chainId)));
    const prices = await Promise.all(regarr);
    _collection.forEach((item: any) => {
      item.price = prices.shift();
      item.items.forEach((_item: any) => {
        _item.active = false;
      });
    });
    setCollection(_collection);
  };
  const removeSell = async (tokenAddress: string, tokenId: string, price: any) => {
    const _sells = cloneDeep(sells);
    const index = sells.findIndex((item: any) => item.tokenAddress === tokenAddress);
    const _index = sells[index].items.findIndex((item: any) => item.tokenId === tokenId);
    _sells[index].items.splice(_index, 1); // prices
    // const price = await getSellNFTQuote(_sells[index].items.length || 1, _sells[index].currentPool, wallet.chainId)
    if (!_sells[index].items.length) {
      _sells.splice(index, 1);
    } else {
      _sells[index].items.forEach((item: any) => (item.price = price));
    }
    setSells(_sells);
    const _collection = cloneDeep(collection);
    const currentCollections = _collection.find((_item: any) => _item.tokenAddress === tokenAddress);
    let needupdateActiveNft = currentCollections.items
      .filter((_item: any) => _item.active && _item.price.newSpotPrice < price.newSpotPrice)
      .sort((a: any, b: any) => a.price.newSpotPrice - b.price.newSpotPrice);
    needupdateActiveNft.forEach((_item: any, _index: number) => {
      if (_index === needupdateActiveNft.length - 1) {
        _item.price = cloneDeep(price);
      } else {
        _item.price = needupdateActiveNft[_index + 1].price;
      }
      _sells[index].items.forEach((__item: any) => {
        if (__item.tokenId === _item.tokenId) {
          __item.price = _item.price;
        }
      });
    });
    currentCollections.price = price;
    currentCollections.items.forEach((_item: any) => {
      _item.tokenId === tokenId && (_item.active = false);
    });
    setCollection(_collection);
  };
  const filterCollection = (e: string) => {
    setFilterKey(e === 'All Collections' ? '' : e);
  };
  const setApproved = (tokenAddress: string) => {
    const _sells = JSON.parse(JSON.stringify(sells));
    _sells.forEach((item: any) => {
      if (item.tokenAddress === tokenAddress) {
        item.needApprove = false;
      }
    });
    setSells(_sells);
  };
  const clickBtn = () => {
    if (!login) {
      setShowAccount(true);
    } else if (!sells.length || approving || swaping) {
      return;
    } else if (needApprove) {
      const item = sells.find((item: any) => item.needApprove);
      approve(wallet.address, item.tokenAddress, wallet.chainId, true, SeacowsRouterAddress).then(
        async (txhex: string) => {
          if (txhex) {
            addHistory({
              tx: txhex,
              name: `Approve ${item.name}`,
              status: '',
              address: wallet.address,
              chain: wallet.chainId
            });
            setApproving(true);
            listenTransaction(txhex, wallet.chainId, () => {
              isNeedApprove(wallet.address, item.tokenAddress, wallet.chainId, SeacowsRouterAddress).then((res) => {
                setApproved(item.tokenAddress);
                setApproving(false);
                Notifaction({
                  type: 'defSuccess',
                  description: `Approve ${item.name}`,
                  content: (
                    <a className={style.view} target="_blank" href={`${getNetWorkPre(wallet.chainId)}/tx/${txhex}`}>
                      View on Explorer
                    </a>
                  )
                });
              });
            });
          }
        }
      );
    } else {
      // TODO 过滤掉 不同结算方式的 nft
      setShowConfirm(true);
    }
  };
  const transNft2Collection = async (res: any, collections = collection) => {
    const _collection = cloneDeep(collections);
    const nfts = res?.result.map((item: any) => ({ ...item.result, active: false }));
    for (let i = 0; i < nfts.length; i++) {
      const item = nfts[i];
      const tokenAddress = item.tokenAddress._value.toLowerCase();
      const index = _collection.findIndex((_item: any) => _item.tokenAddress === tokenAddress);
      if (index > -1) {
        // let price = null
        // if (_collection[index].currentPool) {
        //   price = await getSellNFTQuote(1, _collection[index].currentPool, wallet.chainId)
        //   item.price = price
        // }
        _collection[index].items.push(item);
      } else {
        const pools = await queryPool({ where: { collection: tokenAddress } });
        const { pairs } = pools.data;
        let price = null;
        let _isNeedApprove = false;
        let tokenMetaData = {};
        if (pairs.length) {
          const sellIndex = sells.findIndex((item: any) => item.tokenAddress === showSelectPool);
          let numNfts = 1;
          if (sellIndex > -1) numNfts = sells[sellIndex].items.length;
          price = await getSellNFTQuote(numNfts, pairs[0].id, wallet.chainId);
          _isNeedApprove = await isNeedApprove(wallet.address, tokenAddress, wallet.chainId, SeacowsRouterAddress);
          // approve(wallet.address, tokenAddress, wallet.chainId, false)
          tokenMetaData = await getTokenMetadata(pairs[0].id, wallet.chainId);
        }
        console.log(price, 'price');
        const obj = {
          icon: <Nftheadplaceholder style={{ fontSize: '32px' }} />,
          title: item.name,
          currentPool: pairs[0]?.id,
          tokenMetaData,
          needApprove: _isNeedApprove,
          pools: pairs,
          symbol: item.symbol,
          tokenAddress: tokenAddress,
          price: price,
          items: [item]
        };
        _collection.push(obj);
      }
    }
    setCollection(_collection);
  };
  const updatePrice = async (poolId: string, currentPool: string) => {
    const _collection = cloneDeep(collection);
    const index = _collection.findIndex((_item: any) => _item.currentPool === poolId);
    const _sells = cloneDeep(sells);
    const sellIndex = _sells.findIndex((item: any) => item.currentPool === poolId);
    // let reqarr: any[] = []n
    // _collection[index].items.forEach((item: any) => {
    //   reqarr.push(getSellNFTQuote(1, poolId, wallet.chainId))
    // })
    let numNfts = 1;
    if (sellIndex > 1) numNfts = _sells[sellIndex].items.length + 1;
    const price = await getSellNFTQuote(numNfts, currentPool, wallet.chainId);
    // let prices = await Promise.all(reqarr)
    // console.log(prices, ' prices ')
    // prices.forEach((item: any, _index: number) => {
    //   _collection[index].items[_index].price = item
    // })
    // console.log(poolId, currentPool, price, sellIndex, _sells, _collection[index], 'price')
    _collection[index].price = price;
    _collection[index].currentPool = currentPool;
    const tokenMetaData = await getTokenMetadata(currentPool, wallet.chainId);

    _collection[index].tokenMetaData = tokenMetaData;
    setCollection(_collection);
    if (sellIndex > -1) {
      _sells[sellIndex]?.items.forEach((item: any) => {
        // item.price = _collection[index].items.find((_item: any) => _item.tokenId === item.tokenId)?.price
        item.price = _collection[index].price;
        item.tokenMetaData = tokenMetaData;
      });
      _sells[sellIndex].currentPool = currentPool;
      _sells[sellIndex].tokenMetaData = tokenMetaData;
    }
    setSells(_sells);
  };
  useEffect(() => {
    setNeedApprove(sells.some((item: any) => item.needApprove));
  }, [sells]);
  useEffect(() => {
    if (!wallet.address || !wallet.chainId) return;
    coin2$(wallet.chainId).then((res) => {
      setUsd(res);
    });
    // setCollection([])
    setSize(getCardSize(window.innerWidth - 680, ~~((window.innerWidth - 680) / 6)));
    getUserNfts(wallet.address, wallet.chainId, limit, cursor).then((res: any) => {
      if (res?.result.length) {
        transNft2Collection(res, []);
        setCursor(res?.raw?.cursor);
      }
    });
  }, [wallet]);
  const getMoreNfts = async (e: any) => {
    if (loading) return;
    const formDom = document.getElementById('list') as unknown as HTMLElement;
    if (formDom?.scrollTop + formDom?.clientHeight > formDom?.scrollHeight - 10 && cursor) {
      loading = true;
      let res: any = await getUserNfts(wallet.address, wallet.chainId, limit, cursor);
      if (res?.result.length) {
        transNft2Collection(res);
      }
      setCursor(res.raw.cursor);
      setTimeout(() => {
        loading = false;
      }, 500);
    }
  };
  const toggleNft = async (item: any) => {
    const { title, tokenAddress, tokenId, currentPool, tokenMetaData, needApprove } = item;
    const _collection = cloneDeep(collection);
    let price = cloneDeep(item.price);
    const _sells = cloneDeep(sells);
    const index = sells.findIndex((item: any) => item.tokenAddress === tokenAddress);
    const currentCollections = _collection.find((_item: any) => _item.tokenAddress === tokenAddress);
    if (index > -1) {
      const _index = sells[index].items.findIndex((item: any) => item.tokenId === tokenId);
      if (_index > -1) {
        _sells[index].items.splice(_index, 1);
        if (!_sells[index].items.length) {
          _sells.splice(index, 1);
        }
        let needupdateActiveNft = currentCollections.items
          .filter((_item: any) => _item.active && _item.price.newSpotPrice < price.newSpotPrice)
          .sort((a: any, b: any) => a.price.newSpotPrice - b.price.newSpotPrice);
        needupdateActiveNft.forEach((_item: any, _index: number) => {
          if (_index === needupdateActiveNft.length - 1) {
            _item.price = cloneDeep(price);
          } else {
            _item.price = needupdateActiveNft[_index + 1].price;
          }
          _sells[index].items.forEach((__item: any) => {
            if (__item.tokenId === _item.tokenId) {
              __item.price = _item.price;
            }
          });
        });
      } else {
        // 选中
        _sells[index].items.push(item);
      }
      let numNfts = 1;
      if (index > -1 && _sells[index]) {
        numNfts = _sells[index].items.length + 1;
      }
      price = await getSellNFTQuote(numNfts, currentPool, wallet.chainId);
    } else {
      price = await getSellNFTQuote(2, currentPool, wallet.chainId);
      _sells.push({
        name: title,
        needApprove,
        tokenAddress,
        tokenMetaData,
        currentPool,
        items: [item]
      });
    }
    setSells(_sells);
    currentCollections.items.forEach((_item: any) => {
      if (_item.tokenId === item.tokenId) {
        _item.active = !_item.active;
      }
      if (_item.active && _item.tokenId === item.tokenId) {
        console.log(_item, item);
        _item.price = cloneDeep(item.price);
      }
    });
    currentCollections.price = price;
    setCollection(_collection);
  };
  const getBtnText = () => {
    if (!login) {
      return 'Connect Wallet';
    } else if (!sells.length) {
      return 'Select an NFT';
    } else if (approving) {
      return 'Approving...';
    } else if (swaping) {
      return 'Swaping';
    } else if (needApprove) {
      return `Approve ${sells.find((item: any) => item.needApprove)?.name}`;
    } else {
      return 'Swap';
    }
  };
  const getTotal = () => {
    return sells.reduce(
      (total: number, item: any) =>
        item.items.reduce((_total: number, _item: any) => Number(_item?.price?.outputAmount) + _total, 0) + total,
      0
    );
  };
  const submit = async () => {
    setShowConfirm(false);
    setShowTip(true);
    const min = Math.min(
      ...sells.map((item: any) =>
        Math.min(...item.items.map((_item: any) => Number(web3.utils.fromWei(_item?.price?.outputAmount))))
      )
    );
    const tx = await swapNFTsForToken(
      sells.map((item: any) => ({
        pair: item.currentPool.toLocaleLowerCase(),
        nftIds: item.items.map((_item: any) => _item.tokenId)
      })), // details: getDetails(item.tokenAddress, item.items.map((_item: any) => _item.tokenId))
      web3.utils.toWei(String(min)),
      // sells.reduce((total: number, currentValue: any) => total + currentValue.items.reduce((_total: number, _item: any) => Number(_item.price.outputAmount) + _total, 0), 0),
      // 1,
      wallet.address,
      wallet.chainId
    );
    setShowTip(false);
    if (tx) {
      setTxHash(tx);
      setShowSuccess(true);
      sells.forEach((item: any) => {
        addHistory({
          tx: tx,
          name: `Swap ${item.items.length} NFT for ${item.items
            .reduce(
              (total: number, currentValue: any) =>
                Number(web3.utils.fromWei(currentValue?.price?.outputAmount)) + total,
              0
            )
            .toFixed(4)} ${item?.tokenMetaData?.name}`,
          status: '',
          address: wallet.address,
          chain: wallet.chainId
        });
        setSwaping(true);
        globalStore.updateTx();
        listenTransaction(tx, wallet.chainId, () => {
          setSwaping(false);
          clearSell();
          setCursor('');
          getUserNfts(wallet.address, wallet.chainId, limit, '').then((res: any) => {
            if (res?.result.length) {
              transNft2Collection(res, []);
              setCursor(res?.raw?.cursor);
            }
          });
        });
      });
    } else {
      setShowErr(true);
    }
  };
  const loadingTip = (
    <>
      {sells
        .map(
          (item: any) =>
            `Swapping ${item.items.length} ${item.name} for ${item.items
              .reduce(
                (total: number, currentValue: any) =>
                  Number(web3.utils.fromWei(currentValue?.price?.outputAmount || '0')) + total,
                0
              )
              .toFixed(4)} ${item.tokenMetaData.name}`
        )
        .join('\n')}
    </>
  );
  return (
    <div className={style.sell} id="list" onScroll={getMoreNfts}>
      <div className={style.sellcard}>
        <div className={style.cardbody}>
          <div className={style.selllist}>
            <h2>
              <p>Sell</p>
              {!!sells.length && <span onClick={clearSell}>Clear</span>}
            </h2>
            <div className={style.sells}>
              {sells.map((item: any, index: number) => (
                <ul key={index} className={style.sellCollection}>
                  {item.items.map((_item: any, _index: number) => (
                    <li key={_index}>
                      <Close
                        className={style.closeicon}
                        onClick={() => removeSell(item.tokenAddress, _item.tokenId, _item.price)}
                        fill="#fff"
                      />
                      <img src={_item.image || _item?.metadata?.image || '/img/nonft.png'} alt="" />
                      <div>
                        <span>
                          <p>{item.name}</p> ID #{_item.tokenId}
                        </span>
                        <p>
                          {item?.tokenMetaData?.icon || <Tokenheadplaceholder style={{ fontSize: '14px' }} />}
                          <strong>
                            {_item?.price?.newSpotPrice &&
                              Number(web3.utils.fromWei(_item?.price?.newSpotPrice || '0')).toFixed(4)}
                          </strong>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            {!sells.length && <div className={style.sellempty}></div>}

            <div className={style.join}>
              <Flash className={style.joinIcon} />
            </div>
          </div>
          <div className={style.receive}>
            <h2>Receive</h2>
            {sells.map((item: any, index: number) => {
              const price = item.items
                .reduce(
                  (_total: number, _item: any) =>
                    Number(web3.utils.fromWei(_item?.price?.newSpotPrice || '0')) + _total,
                  0
                )
                .toFixed(4);
              return (
                <div key={index} className={style.receives}>
                  <div className={style.receiveimgs}>
                    {item?.tokenMetaData?.icon || <Tokenheadplaceholder style={{ fontSize: '24px' }} />}
                    {item.items.map((_item: any, _index: number) => (
                      <img
                        style={{ marginLeft: `-16px`, zIndex: `${item.items.length - _index}` }}
                        key={_index}
                        src={_item.image || _item?.metadata?.image || '/img/nonft.png'}
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
          {!login && (
            <div className={style.tip}>
              <Warninghover className={style.icon} fill="#F6B672" />
              <p>Please connect your wallet to select an NFT to sell.</p>
            </div>
          )}
          {sells.length > 1 && !needApprove && (
            <div className={style.tip}>
              <Warninghover className={style.icon} fill="#F6B672" />
              <p>Selling NFT in different collections requires multiple gas fees.</p>
            </div>
          )}

          <button
            className={`${style.btn} ${(!sells.length || approving || swaping) && login && style.def} `}
            onClick={clickBtn}
          >
            {getBtnText()}
          </button>
        </div>
      </div>
      {login && (
        <div className={style.collection}>
          <div className={style.collectiontitle}>
            <h2>My Items</h2>
            <Select
              def="All Collections"
              list={[{ title: 'All Collections' }].concat(collection).map((item: any) => item.title) as any}
              call={filterCollection}
            />
          </div>
          {!collection.length && (
            <div style={{ marginTop: '60px' }}>
              <Empty Icon={Cardnull} text={`You have no NFT in ${tranceAddress(wallet.address)} wallet`} />
            </div>
          )}
          <div className={style.clist}>
            {collection.map((item: any, index: number) => (
              <div
                key={index}
                className={`${!item.pools.length && style.disable} ${
                  !(!filterKey || (filterKey && item.title === filterKey)) && style.hidden
                }`}
              >
                <div className={style.subTitle}>
                  <h3>{item.title}</h3>
                  {item.pools.length ? (
                    <button onClick={() => setShowSelectPool(item.tokenAddress)}>Select a Pool</button>
                  ) : (
                    <button
                      onClick={() =>
                        Router.push({
                          pathname: '/earn/create'
                        })
                      }
                    >
                      Create a Pool
                    </button>
                  )}
                </div>
                <ul>
                  {item.items.map((_item: any, _index: number) => (
                    <NftCard
                      size={size}
                      key={_index}
                      index={_index}
                      toggleNft={toggleNft}
                      // priceKey="outputAmount"
                      item={{
                        ..._item,
                        price: _item.active ? _item.price : item.price,
                        pools: item.pools,
                        currentPool: item.currentPool,
                        title: item.title,
                        tokenAddress: item.tokenAddress,
                        tokenMetaData: item.tokenMetaData,
                        needApprove: item.needApprove
                      }}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {showConnect && <ConnectWallet success={connectSuccess} close={setShowAccount} />}
      {/* { showSelectToken && <SelectToken token={ token } change={ setToken } close={ setShowSelectToken } /> } */}
      {showConfirm && (
        <ConfirmSwap wallet={wallet} token={token} sells={sells} close={setShowConfirm} onsubmit={submit} />
      )}
      {showTip && (
        <Tip
          close={setShowTip}
          title="Waiting For Confirmation"
          tip={loadingTip}
          desc="Confirm this transaction in you wallet"
        />
      )}
      {showSuccess && (
        <Tip
          close={setShowSuccess}
          btnClick={() => setShowSuccess(false)}
          type="success"
          title="Transaction Submitted"
          tip={
            <a target="_blank" href={`${getNetWorkPre(wallet.chainId)}/tx/${txhash}`}>
              {'View on Explorer'}
            </a>
          }
          showbtn={true}
          text="Close"
        />
      )}
      {showErr && (
        <Tip
          close={setShowErr}
          btnClick={() => setShowErr(false)}
          type="danger"
          title="Transaction Rejected"
          showbtn={true}
          text="Dismiss"
        />
      )}
      {showSelectPool && (
        <SelectPool
          chain={wallet.chainId}
          close={() => setShowSelectPool('')}
          data={collection.find((item: any) => item.tokenAddress === showSelectPool)}
          update={(poolId: string, currentPool: string) => updatePrice(poolId, currentPool)}
          tokenAddress={showSelectPool}
        />
      )}
    </div>
  );
};

export default Sell;
