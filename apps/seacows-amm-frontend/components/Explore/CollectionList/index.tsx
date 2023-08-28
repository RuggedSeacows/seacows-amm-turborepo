import style from './index.module.scss';
import Search from '@src/components/Search';
import Select from '@components/Select';
import { useRouter } from 'next/router';
import NftCard from '@components/NftCard';
import { useState, useEffect } from 'react';
import { queryPool } from '@api/pool';
import { getOwnedByAccount } from '@api/center';
import { getCardSize, getTokenMetadata, getTokenMetadataByType } from '@utils/index';
import { Downhover } from '@components/index';
import { getBuyNFTQuote } from '@utils/contract/ai';
import { ERC20Approved, web3 } from '@utils/contract/index';
import { Net, nets } from '@lib/net';
import { SeacowsRouterAddress } from '@lib/contract';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { getCollection, getPoolsByCollection } from '@src/api/indexer';
const filters: Array<any> = ['Price: Low to High', 'Price: High to Low', 'Pool Value: High to Low'];
interface CollectionMeatData {
  address?: string;
  image_url?: string;
  name?: string;
}

let offset = 0;
let limit = 20;
let poolIndex = 0;
let skip = 0;
let pools: any = [];
const CollectionList = (props: any) => {
  const { cart, data, wallet, globalStore } = props;
  const router = useRouter();
  const { collection } = router.query;
  const [collectionMeatData, setCollectionMetaData] = useState<CollectionMeatData>({});
  const [nfts, setNfts] = useState<any>([]);
  const [showMore, setShowMore] = useState(false);
  const [size, setSize] = useState(120);
  const [start, seeStart] = useState(false);
  const isActive = (nft: any) => {
    const cartdata = cart.collection[collection as any] || [];
    return cartdata.some(
      (cartNft: any) =>
        nft.tokenMetaData.symbol === cartNft.tokenMetaData.symbol &&
        cartNft.items.some((_cartNft: any) => _cartNft.tokenId === nft.tokenId)
    );
  };
  const aboutprice = async (obj: any, item: any, pool: string) => {
    const price = obj?.items.reduce(
      (_total: number, _item: any) => Number(web3.utils.fromWei(_item?.price?.inputAmount)) + _total,
      0
    );
    if (item.tokenMetaData.token_address) {
      const balance = await ERC20Approved(
        wallet.address,
        wallet.chainId,
        item.tokenMetaData.token_address,
        SeacowsRouterAddress
      );
      const token = wallet.tokens.find((_item: any) => _item.token_address === item.tokenMetaData.token_address);
      if (Number(token?.balance) < price) {
        obj.exceeds = item.tokenMetaData;
      } else if (Number(balance) < price) {
        obj.approveToken = {
          ...item.tokenMetaData,
          balance: balance
        };
      }
    } else if (Number(web3.utils.toWei(wallet.balance)) < price) {
      obj.exceeds = {
        name: nets.find((item: Net) => item.chainId === wallet.chainId)?.unit
      };
    }
    // console.log(obj, 'aboutprice')
  };
  const toggleNft = async (item: any) => {
    const { address, tokenId, tokenMetaData, pool } = item;
    const _nfts = cloneDeep(nfts);
    const cartdata = data?.collection[collection as any] || [];
    const index = cartdata.findIndex((item: any) => item.tokenMetaData.symbol === tokenMetaData.symbol);
    let price = cloneDeep(item.price);
    if (index > -1) {
      let num = cartdata[index].items.reduce((total: number, item: any) => (item.pool === pool ? total + 1 : ''), 0);
      const _index = cartdata[index].items.findIndex((item: any) => item.tokenId === tokenId);
      if (_index > -1) {
        // 去除
        cartdata[index].items.splice(_index, 1);
        if (!cartdata[index].items.length) {
          cartdata.splice(index, 1);
        } else {
          const _price = await getBuyNFTQuote(num, pool, wallet.chainId);
          let needupdateActiveNft = _nfts
            .filter(
              (_item: any) => _item.pool === pool && isActive(_item) && _item.price.inputAmount > price.inputAmount
            )
            .sort((a: any, b: any) => a.price.inputAmount - b.price.inputAmount);
          needupdateActiveNft.reverse().forEach((_item: any, _index: number) => {
            if (_index === needupdateActiveNft.length - 1) {
              _item.price = cloneDeep(price);
            } else {
              _item.price = needupdateActiveNft[_index + 1].price;
            }
            cartdata[index].items.forEach((cartNft: any) => {
              if (cartNft.tokenId === _item.tokenId) {
                cartNft.price = _item.price;
              }
            });
          });
          price = _price;
          await aboutprice(cartdata[index], item, pool);
        }
      } else {
        // 新增
        price = await getBuyNFTQuote(num + 2, pool, wallet.chainId);
        cartdata[index].items.push(item);
        await aboutprice(cartdata[index], item, pool);
      }
    } else {
      price = await getBuyNFTQuote(2, pool, wallet.chainId);
      let obj: any = {
        tokenMetaData: item.tokenMetaData,
        items: [item],
        pool: item.pool
      };
      await aboutprice(obj, item, item.pool);
      cartdata.push(obj);
    }
    cart.toggleShow(true);
    _nfts.forEach((_item: any) => {
      const active = cartdata.some(
        (cartNft: any) =>
          _item.tokenMetaData.symbol === cartNft.tokenMetaData.symbol &&
          cartNft.items.some((_cartNft: any) => _cartNft.tokenId === _item.tokenId)
      );
      if (_item.pool === pool && !active) {
        _item.price = price;
      }
    });
    setNfts(_nfts);
    cart.setData(cartdata, collection);
  };
  const filterNfts = (str: string) => {};
  const queryPools = async () => {
    const _pools = await getPoolsByCollection(collection as string);
    const pairs: any = _pools.data;
    if (pairs.length >= limit) {
      skip += limit;
    } else {
      skip = -1;
    }
    console.log(pairs, 'pairs');
    pools = [...pools, ...pairs];
  };
  const queryNft: any = async (arr: Array<any>) => {
    let pool = pools[poolIndex]?.address;
    console.log(pool, poolIndex, limit, offset, 'poolIndex');
    if (!pool) {
      if (skip >= 0) {
        await queryPools();
        pool = pools[poolIndex]?.address;
      } else {
        setShowMore(false);
        return arr;
      }
    }
    let token = pools[poolIndex]?.token;
    const _limit = limit - arr.length;
    const res = await getOwnedByAccount(pool, wallet.chainId, { limit: _limit, offset });
    console.log(res, 'getOwnedByAccount');
    // const tokenMetaData: any = await getTokenMetadata(pool, wallet.chainId)
    const tokenMetaData: any = await getTokenMetadataByType(token, pool, wallet.chainId);

    if (res?.items) {
      // let reqarr: any[] = []
      // res?.items.forEach((item: any) => {
      //   reqarr.push(getBuyNFTQuote(1, pool, wallet.chainId))
      // })
      // let prices = await Promise.all(reqarr)
      const cartdata = data?.collection[collection as any] || [];
      const tokenIndex = cartdata.find(
        (item: any) => item.tokenMetaData.token_address === tokenMetaData?.token_address
      );
      let num = 1;
      if (tokenIndex > -1) {
        num = cartdata[tokenIndex].reduce((total: number, item: any) => (item.pool === pool ? total + 1 : ''), 0);
      }
      const price = await getBuyNFTQuote(num || 1, pool, wallet.chainId);
      console.log(res?.items, price, 'price price');
      res?.items.forEach((item: any, index: number) => {
        item.price = price;
        item.tokenMetaData = tokenMetaData;
        item.pool = pool;
      });
      arr = arr.concat(...res?.items);
    }
    if (arr.length >= limit) {
      offset += _limit;
      setShowMore(true);
      return arr;
    } else {
      offset = 0;
      poolIndex = poolIndex + 1;
      return await queryNft(arr);
    }
  };
  const init = async () => {
    offset = 0;
    limit = 20;
    poolIndex = 0;
    skip = 0;
    pools = [];

    getCollection(collection as string).then((res: any) => {
      setCollectionMetaData(res.data);
    });

    let _nfts = await queryNft([]);
    setNfts(_nfts);
  };
  const mounted = debounce(init, 1000);
  const updatenftPrice = async () => {
    // 购物车中nft变化更新价格
    const cartdata = cart.collection[collection as any] || [];
    const _nfts = cloneDeep(nfts);
    if (!cartdata.length) {
      const pooList: any = Array.from(new Set([..._nfts.map((item: any) => item.pool)]));
      const reqarr: any = [];
      pooList.forEach((item: any) => {
        reqarr.push(getBuyNFTQuote(1, item, wallet.chainId));
      });
      let prices = await Promise.all(reqarr);
      _nfts.forEach((item: any) => {
        const index = pooList.findIndex((pool: any) => pool === item.pool);
        item.price = prices[index];
      });
    } else {
      if (data?.delNft?.tokenId) {
        console.log(data.delNft, 'delNft');
        const { price, pool } = data.delNft;
        const currentPoolNfts = _nfts.filter((_item: any) => _item.pool === pool);
        const _price = await getBuyNFTQuote(
          currentPoolNfts.filter((item: any) => isActive(item)).length + 1,
          pool,
          wallet.chainId
        );
        let needupdateActiveNft = currentPoolNfts
          .filter((_item: any) => isActive(_item) && _item.price.inputAmount > price.inputAmount)
          .sort((a: any, b: any) => a.price.inputAmount - b.price.inputAmount);
        needupdateActiveNft.reverse().forEach((_item: any, _index: number) => {
          if (_index === needupdateActiveNft.length - 1) {
            _item.price = cloneDeep(price);
          } else {
            _item.price = needupdateActiveNft[_index + 1].price;
          }
        });
        currentPoolNfts.forEach((item: any) => {
          if (!isActive(item)) {
            item.price = _price;
          }
        });
        cart.setDelNft({});
      }
    }
    setNfts(_nfts);
  };
  useEffect(() => {
    if (wallet.address && !start) {
      seeStart(true);
      mounted();
    }
  }, [wallet]);
  useEffect(() => {
    if (cart.show) {
      setSize(getCardSize(window.innerWidth - 660, ~~((window.innerWidth - 660) / 8)));
    } else {
      setSize(getCardSize(window.innerWidth - 280, ~~((window.innerWidth - 280) / 8)));
    }
  }, [cart.show]);
  useEffect(() => {
    updatenftPrice();
  }, [cart.collection]);
  const cartdata = cart.collection[collection as any] || [];
  const getMoreNft = async () => {
    let _nfts = await queryNft([]);
    setNfts([...nfts, ..._nfts]);
  };
  return (
    <div className={style.layer} style={{ flex: 1 }}>
      <div className={style.title}>
        <img src={collectionMeatData.image_url} alt="" />
        <div>
          <h2>{collectionMeatData.name}</h2>
          {/* <div className={ style.tags }>
        <div>{ nfts.length } NFTs</div>
        <div>Floor: 50</div>
        <div>Volume:  $ 45,541</div>
      </div>
      <div className={ style.tags }>
        <div>Pool Value:  $ 135,195</div>
      </div> */}
        </div>
      </div>
      <div className={style.filterbox}>
        {/* <div style={ { width: '300px' } }>
      <Search placeholder='Search ID' />
    </div> */}
        {/* <div className={ style.filters }>
      <Select def='Price: Low to High' list={ filters } call={ filterNfts } />
    </div> */}
      </div>
      <div className={style.section}>
        <ul className={style.list}>
          {nfts.map((item: any, index: number) => (
            <NftCard
              key={index}
              size={size}
              priceKey="inputAmount"
              item={{
                ...item,
                active: cartdata.some(
                  (_item: any) =>
                    item.tokenMetaData.symbol === _item.tokenMetaData.symbol &&
                    _item.items.some((__item: any) => __item.tokenId === item.tokenId)
                )
              }}
              toggleNft={toggleNft}
            />
          ))}
        </ul>
        {showMore && <Downhover onClick={getMoreNft} className={style.more} fill="#fff" />}
      </div>
    </div>
  );
};

export default CollectionList;
