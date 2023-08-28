import style from './index.module.scss';
import { EthIcon, Downhover, Networks, Bnblogo } from '../../index';
import { useState, useEffect } from 'react';
import { switchEthereumChain, chainChange } from '@utils/interact';
import { Net, nets } from '@lib/net';
import { getCurrentWalletConnected } from '@utils/interact';
import Notifaction from '@components/Common/Notifaction';
declare const window: any;
interface Props {
  [key: string]: any;
}
const SelectNet = (props: Props) => {
  const { globalStore, wallet } = props;
  const [error, setError] = useState(false);
  const [net, setNet] = useState('');
  const [show, setShow] = useState(false);
  let time: any = 0;
  const showList = () => {
    clearTimeout(time);
    setShow(true);
  };
  const hiddenList = () => {
    time = setTimeout(() => {
      setShow(false);
    }, 300);
  };
  const setWallet = async () => {
    const { address, balance, chainId } = (await getCurrentWalletConnected()) as any;
    setError(false);
    globalStore.setWallet({
      address,
      balance: balance,
      type: localStorage.getItem('wallet') || '',
      chainId
    });
  };
  const switecNetWork = async (net: Net, text: string) => {
    await switchEthereumChain(net.chainId, net);
    setNet(text);
    globalStore.setWallet({
      ...globalStore.wallet,
      balance: '',
      chainId: ''
    });
    setWallet();
  };
  useEffect(() => {
    chainChange((chainId: string) => {
      console.log(chainId, 'chainId');
      setWallet();
    });
  }, []);
  useEffect(() => {
    if (localStorage.getItem('wallet') && wallet.chainId) {
      const net = nets.find((item: Net) => item.chainId === wallet.chainId);
      if (net) {
        setNet(net?.text || '');
      } else {
        setError(true);
        Notifaction({
          type: 'defwarning',
          description:
            'Failed to switch networks from the Seacows Interface. In order to use Seacows on BSC Testnet, you must change the network in your wallet.'
        });
      }
    }
  }, [wallet.chainId]);
  const List = (
    <ul className={style.list}>
      {nets.map((item: Net, index: number) => (
        <li
          key={index}
          onClick={() => {
            switecNetWork(item, item.text);
            setShow(false);
          }}
        >
          {item.icon}
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`${style.net} ${error && style.neterr}`} onMouseEnter={showList} onMouseLeave={hiddenList}>
      {error ? (
        <Networks className={style.icon} fill="#fff" />
      ) : (
        nets.find((item: Net) => item.text === net)?.icon || <EthIcon />
      )}
      <p>{error ? 'Switch Network' : nets.find((item: Net) => item.text === net)?.text || 'Ethereum'}</p>
      <Downhover className={style.iconhover} fill="#fff" />
      {show && List}
    </div>
  );
};

export default SelectNet;
