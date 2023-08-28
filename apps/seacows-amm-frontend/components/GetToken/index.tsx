import style from './index.module.scss';
import { nets, Net } from '@lib/net';
import { useEffect, useState } from 'react';
import { SeacowsEtherbg, SeacowsBnBbg } from '@components/index';
import { mintToken, addHistory, getMintHistory, HistoryItem } from '@utils/contract/mint';
import { listenTransaction, web3 } from '@utils/contract';
import Notifaction from '../Common/Notifaction';
import ConnectWallet from '@components/ConnectDialog';
import moment from 'moment';
import { tranceAddress } from '@utils/index';
import { SeacowsEther, SeacowsNFTworlds, SeacowsOtherdeedNFT, SeacowsBLOCWARSAPT, SeacowsOasis } from '@lib/index';
moment.locale('en');
const rinkbynfts = [
  {
    name: 'SeacowsNFTworlds',
    img: '/img/nftworld.png',
    // abi: require('../../lib/abi/SeacowsNFTworlds/index.json'),
    contract: SeacowsNFTworlds
  },
  {
    name: 'SeacowsOtherdeedNFT',
    img: '/img/otherdeed.png',
    // abi: require('../../lib/abi/SeacowsOtherdeedNFT/index.json'),
    contract: SeacowsOtherdeedNFT
  },
  {
    name: 'SeacowsBLOCWARSAPT',
    img: '/img/bloc.png',
    // abi: require('../../lib/abi/SeacowsOtherdeedNFT/index.json'),
    contract: SeacowsBLOCWARSAPT
  },
  {
    name: 'SeacowsOasis',
    img: '/img/oasis.png',
    // abi: require('../../lib/abi/SeacowsOtherdeedNFT/index.json'),
    contract: SeacowsOasis
  }
];
const bnbnfts = [
  {
    name: 'Seacows Oasis Attributed Nft',
    img: '/img/oasis.png',
    abi: require('../../lib/abi/bnbtestnet/Oasis/index.json'),
    contract: '0x8AA39F06a171ba922001f530cD50f2C02C364161'
  }
];
const abi: any = {
  [SeacowsNFTworlds]: require('../../lib/abi/SeacowsNFTworlds/index.json'),
  [SeacowsOtherdeedNFT]: require('../../lib/abi/SeacowsOtherdeedNFT/index.json'),
  [SeacowsOasis]: require('../../lib/abi/SeacowsOasis.json'),
  [SeacowsBLOCWARSAPT]: require('../../lib/abi/SeacowsBLOCWARSAT.json'),
  '0x8AA39F06a171ba922001f530cD50f2C02C364161': require('../../lib/abi/bnbtestnet/Oasis/index.json'),
  '0xce6c5bBdEc0DBE371a52EE60153357da71d31661': require('../../lib/abi/bnbtestnet/BLOCWARS//index.json'),
  [SeacowsEther]: require('../../lib/abi/Rinkby/SeacowsETH/index.json')
};
const rinkbytokens = [
  {
    icon: <SeacowsEtherbg />,
    name: 'Seacows Ether',
    contract: SeacowsEther
  }
];
const bnbtkones = [
  {
    icon: <SeacowsBnBbg />,
    name: 'Seacows BNB',
    contract: '0xce6c5bBdEc0DBE371a52EE60153357da71d31661'
  }
];
const tokens: any = {
  '0x5': rinkbytokens,
  '0x61': bnbtkones
};
const nfts: any = {
  '0x5': rinkbynfts,
  '0x61': bnbnfts
};
export default (props: any) => {
  const [tag, setTag] = useState('NFT');
  const [contract, setContract] = useState(SeacowsNFTworlds);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<string | number>('');
  const [minting, setMintIng] = useState(false);
  const [showconnect, setShowConnect] = useState(false);
  const { wallet, store } = props;
  const [history, setHistory] = useState<Array<HistoryItem>>([]);
  const connectSuccess = async (data: any) => {
    store.setWallet({
      address: data.address,
      balance: data.balance,
      type: localStorage.getItem('wallet') || ''
    });
  };
  useEffect(() => {
    setHistory(getMintHistory(wallet.address, wallet.chainId));
  }, []);
  useEffect(() => {
    if (!wallet.chainId) return;
    if (tag === 'NFT') {
      setContract(nfts[wallet.chainId][0].contract);
    } else {
      setContract(tokens[wallet.chainId][0].contract);
    }
  }, [tag]);
  const getName = () => {
    return (
      rinkbynfts.find((item: any) => item.contract === contract)?.name ||
      // || bnbnfts.find((item: any) => item.contract === contract)?.name
      rinkbytokens.find((item: any) => item.contract === contract)?.name ||
      // || bnbtkones.find((item: any) => item.contract === contract)?.name
      ''
    );
  };
  const mint = async () => {
    if (!wallet.address) {
      setShowConnect(true);
    }
    if (address && amount && !minting) {
      let hash = await mintToken(
        wallet.address,
        contract,
        address,
        wallet.chainId,
        tag === 'Token' ? web3.utils.toWei(String(amount)) : amount,
        abi[contract]
      );
      if (hash) {
        setMintIng(true);
        listenTransaction(hash, wallet.chainId, (status: boolean) => {
          setMintIng(false);
          if (status) {
            const item = {
              address: wallet.address,
              chainId: wallet.chainId,
              name: getName(),
              time: new Date().getTime(),
              amount: amount
            };
            addHistory(item);
            setHistory([item, ...history]);
            Notifaction({
              description: 'Request success',
              type: 'defSuccess'
            });
          } else {
            Notifaction({
              description: 'Request faile',
              type: 'error'
            });
          }
        });
      }
    }
  };
  return (
    <div className={style.lay}>
      <div className={style.content}>
        <h2>Testnet Faucet</h2>
        <p>
          Get testnet NFT and token to test Seacows functions. Please note that testnet NFTs and tokens have no real
          value.{' '}
          <a target="_black" href={nets.find((item: Net) => item.chainId === wallet.chainId)?.coinaddress || ''}>
            Get {nets.find((item: Net) => item.chainId === wallet.chainId)?.desc} here for free.
          </a>
        </p>

        <section className={style.section}>
          <div className={style.btns}>
            <button onClick={() => setTag('NFT')} className={`${tag === 'NFT' && style.active}`}>
              Request NFT
            </button>
            <button onClick={() => setTag('Token')} className={`${tag === 'Token' && style.active}`}>
              Request Token
            </button>
          </div>
          {tag === 'NFT' && (
            <div className={style.cards}>
              {nfts[wallet.chainId]?.map((item: any, index: number) => (
                <div
                  onClick={() => setContract(item.contract)}
                  key={index}
                  className={`${style.carditem} ${contract === item.contract && style.cardactive}`}
                >
                  <img src={item.img} alt="" />
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          )}
          {tag === 'Token' && (
            <div className={style.tokens}>
              {tokens[wallet.chainId]?.map((item: any, index: number) => (
                <div onClick={() => setContract(item.contract)} key={index} className={style.tokenitem}>
                  {item.icon}
                  <p>{item.name}</p>
                  {contract === item.contract && <i></i>}
                </div>
              ))}
            </div>
          )}

          <div className={style.formitem}>
            <label>To (Address)</label>
            <div className={style.inputbox}>
              <input type="text" placeholder="Address" onChange={(e: any) => setAddress(e.target.value)} />
            </div>
          </div>
          <div className={style.formitem}>
            <label>Amount</label>
            <div className={style.inputbox}>
              <input type="text" placeholder="Amount" onChange={(e: any) => setAmount(~~e.target.value)} />
              <span>MAX: 100</span>
            </div>
          </div>
          <button
            onClick={mint}
            className={`${wallet.address && (!address || !amount || minting) && style.disable} button`}
          >
            {!wallet.address ? 'Connect Wallet' : minting ? 'Requesting' : 'Request ' + tag}
          </button>
        </section>

        <div className={style.transactions}>
          <h3>Your Transactions</h3>
          <ul className={style.list}>
            <li>
              <div>Item</div>
              <div>Address</div>
              <div>Amount</div>
              <div>Time</div>
            </li>
            {history.map((item: HistoryItem, index: number) => (
              <li key={index}>
                <div>{item.name}</div>
                <div>{tranceAddress(item.address)}</div>
                <div>{item.amount}</div>
                <div>{moment(item.time).fromNow()}</div>
              </li>
            ))}
            {!history.length && (
              <li>
                <div>-</div>
                <div>-</div>
                <div>-</div>
                <div>-</div>
              </li>
            )}
          </ul>
        </div>
      </div>
      {showconnect && <ConnectWallet success={connectSuccess} close={setShowConnect} />}
    </div>
  );
};
