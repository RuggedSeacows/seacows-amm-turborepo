import style from './index.module.scss';
import Link from 'next/link';
import { SelectDialog } from '@src/components/Common';
import { Nftheadplaceholder, Tokenheadplaceholder, Add, Warninghover, Backhover } from '@components/index';
import { useEffect, useState } from 'react';
import Warning from '@src/components/Common/Warning';
import ConnectWallet from '@components/ConnectDialog';
import { getTokens, getUserNfts, getNFTsForContract } from '@utils/index';
import { web3 } from '@src/utils/contract';
import From from './Form';
import { coins } from '@lib/index';

const Create = (props: any) => {
  const { login, store, wallet, globalStore } = props;
  const [nfts, setNfts] = useState<any>([]);
  const [tokens, setTokens] = useState<any>([]);
  const [showConnect, setShowAccount] = useState(false);
  const [collectionList, setCollectionList] = useState<any>([]);
  const [collection, setCollection] = useState<any>({});
  const [token, setToken] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const connectSuccess = async (data: any) => {
    store.setWallet({
      address: data.address,
      balance: data.balance,
      type: localStorage.getItem('wallet') || ''
    });
  };
  const searchCollection = async (tokenAddress: string) => {
    let res = await getNFTsForContract(wallet.address, tokenAddress, wallet.chainId);
    if (Array.isArray(res) && res?.length) {
      return [res[0]];
    }
    return res;
  };
  const init = async () => {
    const nfts = await getUserNfts(wallet.address, wallet.chainId);
    setNfts(nfts);
    const specialToken = await getTokens(wallet.address, wallet.chainId);
    let tokenlist: any = null;
    if (wallet.balance > 0) {
      tokenlist = [{ ...coins[wallet.chainId], balance: web3.utils.toWei(wallet.balance) }].concat(
        specialToken.map((item: any) => ({
          ...item,
          icon: item.icon ? <img src={item.icon} alt="" /> : <Tokenheadplaceholder style={{ fontSize: '24px' }} />,
          erc20: true
        }))
      );
    } else {
      tokenlist = specialToken.map((item: any) => ({
        ...item,
        erc20: true,
        icon: item.icon ? <img src={item.icon} alt="" /> : <Tokenheadplaceholder style={{ fontSize: '24px' }} />
      }));
    }
    setTokens(tokenlist);
  };
  useEffect(() => {
    setShowForm(false);
    if (wallet.address) {
      init();
    }
  }, [wallet]);
  useEffect(() => {
    // getcollections
    let arr: any = [];
    nfts.forEach((item: any) => {
      console.log(item.tokenAddress._value);
      if (arr.every((_item: any) => _item.tokenAddress !== item.tokenAddress._value)) {
        arr.push({
          icon: <img className={style.nftimg} src={item.image} alt="" />, // <Nftheadplaceholder style={{ fontSize: '24px' }} />,
          label: item.name,
          desc: item.symbol,
          tokenAddress: item.tokenAddress._value
        });
      }
    });
    console.log(arr, 'setCollectionList');
    setCollectionList(arr);
  }, [nfts]);
  const clickBtn = () => {
    if (!login) {
      setShowAccount(true);
    } else if (!collection.label) {
    } else if (!token.label) {
    } else if (Number(wallet.balance) === 0) {
    } else {
      console.log(collection, token);
      setShowForm(true);
    }
  };

  const getBtnText = () => {
    if (!login) {
      return 'Connect Wallet';
    } else {
      return 'Continue';
    }
  };
  return (
    <div className={style.create}>
      <div className={style.createbody}>
        <div className={style.title}>
          <h2>
            <Link href={'/earn'}>
              <i>
                <Backhover className={style.back} fill="#fff" />
              </i>
            </Link>
            Create a New Pool
          </h2>
          <p>Add initial liquidity and set swap fee to buy, sell and earn.</p>
        </div>
        <h3>Select Pair</h3>
        <div className={style.card} style={{ marginTop: '16px' }}>
          <h4>NFT</h4>
          <SelectDialog
            list={collectionList}
            style={{ marginBottom: '6px' }}
            DefIcon={Nftheadplaceholder}
            placeholder="Select a Collection"
            value={collection.label}
            success={(collection: any) => setCollection(collection)}
            disable={!login}
            search={searchCollection}
          />
          <div className={style.join}>
            <Add />
          </div>
        </div>
        <div className={style.card} style={{ marginTop: '2px' }}>
          <h4>Token</h4>
          <SelectDialog
            list={tokens}
            DefIcon={Tokenheadplaceholder}
            placeholder="Select a Token"
            value={token.token_address}
            success={(token: any) => setToken(token)}
            disable={!login}
          />
        </div>
        {!login && (
          <div style={{ marginTop: '16px' }}>
            <Warning Icon={Warninghover} text="Please connect your wallet to select NFTs and tokens." />
          </div>
        )}
        <button
          className={`button ${
            wallet.address && (!collection.label || !token.label || Number(wallet.balance) === 0) && style.disable
          }`}
          onClick={clickBtn}
        >
          {getBtnText()}{' '}
        </button>
      </div>
      {showConnect && <ConnectWallet success={connectSuccess} close={setShowAccount} />}
      {showForm && (
        <From
          close={() => setShowForm(false)}
          collection={collection}
          token={token}
          wallet={wallet}
          globalStore={globalStore}
          nfts={nfts.filter((item: any) => item.name === collection.label)}
        />
      )}
    </div>
  );
};

export default Create;
