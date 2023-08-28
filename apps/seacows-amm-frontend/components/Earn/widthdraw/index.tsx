import style from './index.module.scss';
import Card from '../Create/index.module.scss';
import Link from 'next/link';
import { Nftheadplaceholder, Tokenheadplaceholder, Add, Warninghover, Backhover } from '@components/index';
import { useEffect, useState } from 'react';
import NftCard from '@components/NftCard';
import {
  getCardSize,
  getUserNfts,
  getNativeBalance,
  getNFTMetadata,
  getTokens,
  getNetWorkPre,
  getTokenMetadata
} from '@utils/index';
import { getTempalte, withdrawERC721, withdrawETH, withdrawERC20, listenTransaction } from '@src/utils/contract';
import { useRouter } from 'next/router';
import ConfirmWidthdraw from '@components/ConfirmWidthdraw';
import Tip from '@components/Tip';
import Router from 'next/router';
import { addHistory } from '@utils/wallet';
import { coin2$ } from '@utils/coinGecko';
export default (props: any) => {
  const { wallet, globalStore } = props;
  const router = useRouter();
  const { query } = router;
  const [limit, setLimit] = useState(20);
  const [usd, setUsd] = useState(1);
  const [nfttotal, setNftTotal] = useState(0);
  const [cursor, setCursor] = useState('');
  const [nfts, setNfts] = useState<any>([]);
  const [collection, setCollection] = useState<any>({});
  const [token, setToken] = useState<any>({});
  const [cartdata, setCartData] = useState<any>([]);
  const [widthdrawTokens, setwidthdrawTokens] = useState<number | string>(0);
  const [size, setSize] = useState(120);
  const [templateType, setTemplateType] = useState(-1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmAddTip, setShowConfirmAddTip] = useState(false);
  const [showConfirmSuccessTip, setShowConfirmSuccessTip] = useState(false);
  const [showConfirmRejectedTip, setShowConfirmRejectedTip] = useState(false);
  const [txhash, setTxHash] = useState('');
  const init = async () => {
    if (query.contract && wallet.chainId) {
      coin2$(wallet.chainId).then((res) => {
        console.log(res, 'coin2');
        setUsd(res);
      });
      let res: any = await getUserNfts(query?.contract as string, wallet.chainId, limit, cursor);
      setNfts(res?.result.map((item: any) => item.result));
      setCursor(res.raw.cursor);
      setNftTotal(res.raw.total);
      const tokenMetaData = await getTokenMetadata(query?.contract as string, wallet.chainId);
      setToken(tokenMetaData);
      const templateType = await getTempalte(query?.contract as string, wallet.chainId);
      setTemplateType(templateType);
    }
  };
  useEffect(() => {
    const _fun = async () => {
      if (nfts.length) {
        const first = nfts[0];
        const Nftmetadata = await getNFTMetadata(first.tokenAddress._value, first.tokenId, wallet.chainId);
        console.log(Nftmetadata, 'Nftmetadata');
        // TODO 获取分类图标
        setCollection({
          name: first.name,
          tokenAddress: first.tokenAddress._value,
          icon: <Nftheadplaceholder style={{ fontSize: '32px' }} />
        });
      }
    };
    _fun();
  }, [nfts]);
  useEffect(() => {
    init();
    setSize(getCardSize(window.innerWidth - 691, ~~((window.innerWidth - 691) / 5)));
  }, [wallet]);
  const toggleNft = (item: any) => {
    const index = cartdata.findIndex((_item: any) => _item.tokenId === item.tokenId);
    if (index > -1) {
      const _cartData = JSON.parse(JSON.stringify(cartdata));
      _cartData.splice(index, 1);
      setCartData(_cartData);
    } else {
      setCartData(cartdata.concat([item]));
    }
  };
  const withdraw = () => {
    if (widthdrawTokens || cartdata.length) {
      setShowConfirm(true);
    }
  };
  const getMoreNfts = async (e: any) => {
    const formDom = document.getElementById('widthdraw') as unknown as HTMLElement;
    if (formDom?.scrollTop + formDom?.clientHeight > formDom?.scrollHeight - 20 && cursor !== 'finish') {
      let res: any = await getUserNfts(query?.contract as string, wallet.chainId, limit, cursor);
      setNfts(nfts.concat(res?.result.map((item: any) => item.result)));
      if (res.result.length < limit) {
        setCursor('finish');
      } else {
        setCursor(res?.raw.cursor);
      }
    }
  };
  const onwidthdraw = async () => {
    setShowConfirm(false);
    setShowConfirmAddTip(true);
    let hex;
    if (cartdata.length) {
      hex = await withdrawERC721(
        templateType,
        wallet.address,
        query?.contract as string,
        collection.tokenAddress,
        cartdata.map((item: any) => item.tokenId),
        wallet.chainId
      );
    }
    if (widthdrawTokens && !token.token_address) {
      // 判断币种
      hex = await withdrawETH(templateType, wallet.address, query?.contract as string, widthdrawTokens, wallet.chainId);
    } else if (widthdrawTokens) {
      hex = await withdrawERC20(
        templateType,
        wallet.address,
        query?.contract as string,
        token.token_address,
        widthdrawTokens,
        wallet.chainId
      );
    }
    setTxHash(hex);
    setShowConfirmAddTip(false);
    if (hex) {
      addHistory({
        tx: hex,
        name: `Withdraw ${cartdata.length ? collection.name : token.name} Liquidity`,
        status: '',
        address: wallet.address,
        chain: wallet.chainId
      });
      globalStore.updateTx();
      setShowConfirmSuccessTip(true);
    } else {
      setShowConfirmRejectedTip(true);
    }
    listenTransaction(hex, wallet.chainId, () => {
      init();
    });
  };
  return (
    <div className={style.widthdraw} onScroll={getMoreNfts} id="widthdraw">
      <div className={style.msg}>
        <div className={style.title}>
          <h2>
            <Link href={'/earn'}>
              <i>
                <Backhover className={style.back} fill="#fff" />
              </i>
            </Link>
            <div>
              Withdraw Liquidity
              <p>Withdraw liquidity to receive NFTs and tokens back</p>
            </div>
          </h2>
        </div>
        <h3>Amount</h3>
        <p className={style.poolinfo}>
          <span>Pooled {collection.name}</span>
          <strong>{nfttotal}</strong>
        </p>
        <p className={style.poolinfo}>
          <span>Pooled {token.name}</span>
          <strong>{token.balance}</strong>
        </p>

        <h1>You will receive</h1>
        <div className={Card.createbody}>
          <div className={Card.card} style={{ marginTop: '16px' }}>
            <div className={style.collectionname}>
              <p>NFT</p>
              <span onClick={() => setCartData([])}>Clear</span>
            </div>
            <div className={style.nftinfo}>
              {collection.icon}
              <p>{collection.name}</p>
            </div>
            <div className={style.total}>
              <input type="text" readOnly value={cartdata.length} />
              <div>
                <span></span>
                <div>
                  <span>ALL: {nfts.length}</span>
                  <button onClick={() => setCartData(nfts)}>Select all</button>
                </div>
              </div>
            </div>
            <div className={Card.join}>
              <Add />
            </div>
          </div>
          <div className={Card.card} style={{ marginTop: '2px' }}>
            <h4>Token</h4>
            <div className={style.nftinfo}>
              {token.icon || <Tokenheadplaceholder style={{ fontSize: '32px' }} />}
              <p>{token.name}</p>
            </div>
            <div className={style.total}>
              <input
                type="text"
                value={widthdrawTokens}
                onChange={(e: any) => {
                  setwidthdrawTokens(e.target.value);
                }}
                onBlur={() => setwidthdrawTokens(Number(widthdrawTokens))}
              />
              <div>
                <span>$ {widthdrawTokens && Number(widthdrawTokens) * usd}</span>
                <div>
                  <span>ALL: {token.balance}</span>
                  <button onClick={() => setwidthdrawTokens(token.balance)}>Max</button>
                </div>
              </div>
            </div>
          </div>
          <button onClick={withdraw} className={`button ${!widthdrawTokens && !cartdata.length && style.disable}`}>
            Withdraw
          </button>
        </div>
      </div>
      <div className={style.nfts}>
        <h4>Pool Items</h4>
        <ul className={style.list}>
          {nfts.map((item: any, index: number) => (
            <NftCard
              size={size}
              key={index}
              item={{ ...item, active: cartdata.some((_item: any) => item.tokenId === _item.tokenId) }}
              toggleNft={toggleNft}
            />
          ))}
        </ul>
      </div>
      {showConfirm && (
        <ConfirmWidthdraw
          confirm={onwidthdraw}
          data={{ widthdrawTokens, nfttotal }}
          collection={collection}
          sells={cartdata}
          close={() => setShowConfirm(false)}
          token={token}
        />
      )}
      {showConfirmAddTip && (
        <Tip
          close={setShowConfirmAddTip}
          type="load"
          title="Waiting For Confirmation"
          tip={
            <>
              Withdrawing {cartdata.length ? collection.name : ''}-{widthdrawTokens > 0 ? token.name : ''} Liquidity
            </>
          }
          desc="Confirm this transaction in you wallet"
          showbtn={false}
        />
      )}
      {showConfirmRejectedTip && (
        <Tip
          close={setShowConfirmRejectedTip}
          type="danger"
          title="Transaction rejected"
          text="Dismiss"
          showbtn={true}
          btnClick={() => setShowConfirmRejectedTip(false)}
        />
      )}
      {showConfirmSuccessTip && (
        <Tip
          close={setShowConfirmSuccessTip}
          type="success"
          tip={
            <a target="_blank" href={`${getNetWorkPre(wallet.chainId)}/tx/${txhash}`}>
              {'View on Explorer'}
            </a>
          }
          title="Transaction Submitted"
          showbtn={true}
          closeIcon={false}
          text="Close"
          btnClick={() => Router.push('/earn')}
        />
      )}
    </div>
  );
};
