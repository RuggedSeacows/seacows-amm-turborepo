import style from './index.module.scss';
import Empty from '../Empty';
import useSWR from 'swr';
import { Tokennull, Downhover, Tokenheadplaceholder, Nftheadplaceholder } from '@components/index';
import { useEffect, useState } from 'react';
import { tokens, Token } from '@lib/index';
import { formatEther } from 'ethers/lib/utils';
import { nets, Net } from '@lib/net';
import Link from 'next/link';
import { getPoolMetaDate, getTokenMetadataByType } from '@utils/index';
import PoolCard from './PoolCard';
import { getAllPools, getCollection, getPoolsByVolumes, getUserPools } from '@src/api/indexer';
import { BigNumber } from 'ethers';

const ListLi = (props: any) => {
  const { item, chain, volume } = props;
  const tokenLogo =
    item.token === 'ETH' ? (
      nets.find((item: Net) => item.chainId === chain)?.icon
    ) : (
      <Tokenheadplaceholder style={{ fontSize: '48px' }} />
    );
  const tokenName = item.token === 'ETH' ? 'ETH' : 'Seacows Ether';
  const [collection, setCollection] = useState<any>({});
  useEffect(() => {
    getCollection(item.nft_address).then((res: any) => {
      setCollection(res.data);
    });
  }, []);

  return (
    <li>
      <div>
        {' '}
        {tokenLogo} &nbsp;&nbsp;&nbsp; <img src={collection?.image_url} alt="" />
      </div>
      <div>
        <p>
          {tokenName} - {collection.name}
        </p>
      </div>
      <div>
        <p> - </p>
      </div>

      <div>
        <p> - </p>
      </div>
      <div>
        {volume ? <p>{`${parseFloat(formatEther(BigNumber.from(volume))).toFixed(4)} ${tokenName}`}</p> : <p> - </p>}
      </div>
    </li>
  );
};

const Earn = (props: any) => {
  const { wallet } = props;
  const [pools, setPools] = useState<Array<any>>([]);
  const [myPools, setMypools] = useState<Array<any>>([]);
  const [first, setFirst] = useState(10);
  const [skip, setSkip] = useState(0);
  const [myskip, setMySkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const getMetadata = async (list: any) => {
    const _pools = JSON.parse(JSON.stringify(list));
    for (let i = 0; i < _pools.length; i++) {
      const item = _pools[i];
      const res = await getPoolMetaDate(item?.id, wallet.chainId);
      item.token = res[0];
      item.nft = res[1];
    }
    setPools([...pools, ..._pools]);
    setLoading(false);
  };

  useEffect(() => {
    if (!wallet.address) return;

    getUserPools(wallet.address, 0, 3).then((res: any) => {
      setMypools(res.data);
      if (res.data.length < 3) {
        setMySkip(0);
      } else {
        setShowMore(true);
        setMySkip(3);
      }
    });

    getAllPools(0, first).then((res: any) => {
      setPools(res.data);
      if (res.data.length < first) {
        setSkip(0);
      } else {
        setSkip(first);
      }
    });
  }, [wallet]);

  const getMore = async () => {
    if (!pools.length || loading || skip === 0) return;
    const formDom = document.getElementById('earn') as unknown as HTMLElement;
    if (formDom?.scrollTop + formDom?.clientHeight > formDom?.scrollHeight - 20 && skip !== -1) {
      setLoading(true);
      getAllPools(skip, first).then((res: any) => {
        setLoading(false);
        setPools([...pools, ...res.data]);
        if (res.data.length < first) {
          setSkip(0);
        } else {
          setSkip(skip + first);
        }
      });
    }
  };

  const getMoreMyPool = async () => {
    getUserPools(wallet.address, myskip, 3).then((res: any) => {
      console.log('getUserPools more', { myskip, address: wallet.address, amount: res.data.length });
      setMypools([...myPools, ...res.data]);
      if (res.data.length < 3) {
        setMySkip(0);
        setShowMore(false);
      } else {
        setMySkip(myskip + 3);
      }
    });
  };

  const { data: poolVolumes } = useSWR('/pool-volumes', getPoolsByVolumes);

  return (
    <div className={style.earn} id="earn" onScroll={getMore}>
      <div className={style.liqulity}>
        <h3>Your Liquidity</h3>
        <section className={`${!setMypools.length && style.empty}`}>
          {!myPools?.length && <Empty Icon={Tokennull} text="Your liquidity position will appear here." />}
          <div className={style.liquiditys}>
            {(myPools || []).map((item: any, index: number) => (
              <PoolCard key={index} item={item} wallet={wallet} />
            ))}
          </div>
          {showMore && <Downhover onClick={getMoreMyPool} className={style.more} fill="#fff" />}
        </section>
      </div>
      <div className={style.pooltitle}>
        <div>
          <h2>NFT Pools</h2>
          <p>Stake NFTs and Tokens to earn</p>
        </div>
        <Link href={'/earn/create'}>
          <button className="btn-primary">Create a New Pool</button>
        </Link>
      </div>
      <ul className={style.list}>
        <li>
          <div></div>
          <div>Pool Pair</div>
          <div>Number</div>
          <div>Pool Value</div>
          <div>Volume</div>
        </li>
        {(pools || []).map((item: any, index: number) => (
          <ListLi
            key={item.key || index}
            item={item}
            chain={wallet.chainId}
            volume={(poolVolumes?.data || []).find((p: any) => p.address === item.address)?.volume}
          />
        ))}
      </ul>
    </div>
  );
};

export default Earn;
