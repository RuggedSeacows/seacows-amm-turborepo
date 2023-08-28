import style from './index.module.scss';
import ConnectWallet from '../../ConnectDialog';
import Account from '../Account';
import { useState, useEffect } from 'react';
import { getCurrentWalletConnected, accountChange, disconnect } from '@utils/interact';
import { tranceAddress, getTransactionReceipt } from '@utils/index';
import { MetaMask, WalletConnect } from '@components/index';
import { Net, nets } from '@lib/net';
import { getHistory } from '@utils/wallet';
const walletIcons: any = {
  MetaMask: <MetaMask className={style.icon} />,
  'Wallet Connect': <WalletConnect className={style.icon} />
};

const Wallet = (props: any) => {
  const { globalStore, wallet } = props;
  const [account, setShowAccount] = useState(false);
  const [tsing, setTxIng] = useState(0);
  const init = async () => {
    if (localStorage.getItem('wallet')) {
      const { address, balance, chainId, tokens } = (await getCurrentWalletConnected()) as any;
      address &&
        globalStore.setWallet({
          address,
          balance: balance,
          type: localStorage.getItem('wallet') || '',
          chainId,
          tokens
        });
    }
  };
  const listenTx = async () => {
    const historys = await getHistory(wallet.address, wallet.chainId);
    if (historys.some((item: any) => typeof item.status !== 'boolean')) {
      setTimeout(listenTx, 1000);
    }
    setTxIng(historys.filter((item: any) => typeof item.status !== 'boolean').length);
  };
  useEffect(() => {
    init();
    accountChange((accounts: Array<string>) => {
      if (!accounts.length) {
        globalStore.setWallet({
          address: '',
          balance: '',
          type: localStorage.getItem('wallet') || '',
          chainId: '',
          tokens: []
        });
      } else {
        init();
      }
    });
  }, []);
  useEffect(() => {
    if (globalStore.wallet.address) {
      listenTx();
    }
  }, [globalStore.wallet, globalStore.tx]);
  const [showConnect, setConnect] = useState(false);
  const connectSuccess = async (data: any) => {
    data.address &&
      globalStore.setWallet({
        address: data.address,
        balance: data.balance,
        type: localStorage.getItem('wallet') || '',
        chainId: data.chainId,
        tokens: data.tokens
      });
  };

  const WalletC = (
    <div className={style.walletlogin}>
      {wallet.balance && walletIcons[wallet.type]}
      {wallet.balance && <span>{wallet.balance}</span>}
      <span>{nets.find((item: Net) => item.chainId === wallet.chainId)?.unit}</span>
      <p onClick={() => setShowAccount(true)}>
        {tranceAddress(wallet.address)}
        {tsing && <div className={style.pengding}>{tsing} Pending...</div>}
      </p>
    </div>
  );
  return (
    <div className={style.wallet}>
      {!wallet.address && <span onClick={() => setConnect(true)}>Connect Wallet</span>}
      {wallet.address && WalletC}
      {showConnect && <ConnectWallet success={connectSuccess} close={setConnect} />}
      {account && <Account close={() => setShowAccount(false)} wallet={wallet} />}
    </div>
  );
};

export default Wallet;
