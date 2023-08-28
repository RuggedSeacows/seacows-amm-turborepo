import style from './index.module.scss';
import Router from 'next/router';
import {
  getUserNfts,
  getTokens,
  getNativeBalance,
  getCardSize,
  getTokenMetadata,
  getTokenMetadataByType
} from '@utils/index';
import { nets, Net } from '@lib/net';
import { useEffect, useState } from 'react';
import { web3 } from '@utils/contract';
import { Nftheadplaceholder, Tokenheadplaceholder, Add, Warninghover, Backhover } from '@components/index';
import { Erc721Client } from '@utils/contract/erc721';
import { getNftCollections } from '@src/api/center';
export default (props: any) => {
  const { item, wallet } = props;
  const [total, setTotal] = useState(0);
  const [nft, setNft] = useState<any>({});
  const [token, setToken] = useState<any>({});
  const [width, setWidth] = useState('30%');

  useEffect(() => {
    if (!wallet.address) return;
    const init = async () => {
      setWidth(getCardSize(window.innerWidth - 310, ~~((window.innerWidth - 310) / 4), 800) + 'px');
      getTokenMetadataByType(item?.token, item.address, wallet.chainId).then((tokenMetaData: any) => {
        setToken(tokenMetaData);
      });
      getNftCollections(item.nft_address, wallet.chainId).then((res) => {
        setNft({
          name: res.name,
          imageUrl: res.small_preview_image_url
        });
      });
      Erc721Client(item.nft_address, wallet.chainId).then(async (client: any) => {
        let nfts = await client.methods.balanceOf(item.address).call();
        setTotal(Number(nfts));
      });
    };
    init();
  }, [wallet]);

  const widthdraw = (address: string) => {
    Router.push({
      pathname: '/earn/widthdraw',
      query: { contract: address }
    });
  };

  const shouldHide = !token.balance || (total === 0 && token.balance === '0.0000');

  if (shouldHide) {
    return null;
  }

  return (
    <div className={style.liquidity} style={{ width }}>
      <div className={style.title}>
        <img src={nft.imageUrl || nft.metadata?.image} alt="" />
        <div>{token.logo || <Tokenheadplaceholder style={{ fontSize: '24px' }} />}</div>
        <span>
          {' '}
          {nft.name} - {token.name}{' '}
        </span>
      </div>
      <p>
        <span>Pooled {nft.name}</span> <strong>{total}</strong> 
      </p>
      <p>
        <span>Pooled {token.name}</span> <strong>{token.balance}</strong> 
      </p>
      {/* <p><span>Share of Pool</span> <strong>7</strong> </p> */}
      <button onClick={() => widthdraw(item.address)}>Withdraw</button>
    </div>
  );
};
