import style from './index.module.scss';
import { Tooltip } from 'antd';
import { Close, Copy, Share, Copied } from '../../index';
import { tranceAddress, jsNumberForAddress, getNetWorkPreLink, getNetWorkPre } from '../../../utils/index';
import { enable } from '../../../utils/interact';
import { useEffect, useState } from 'react';
import Clipboard from 'clipboard';
import { getHistory, clearHistory, Transaction } from '@utils/wallet';
const jazzicon = require('@metamask/jazzicon');
type Props = any;
interface Trans {
  text: string;
  finish: boolean;
}
const transList: Array<Trans> = [
  {
    text: 'aaaaa',
    finish: false
  },
  {
    text: 'bbbb',
    finish: true
  }
];

const Account = (props: Props) => {
  const { wallet, close } = props;
  const [cursor, setCursor] = useState('');
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);
  const [copied, setCopied] = useState(false);
  const getTHistory = async () => {
    // TODO 走server
    const history = await getHistory(wallet.address, wallet.chainId);
    console.log(history, 'history');
    setTransactions(history);
  };
  const clearAll = async () => {
    clearHistory(wallet.address, wallet.chainId);
    setTransactions(await getHistory(wallet.address, wallet.chainId));
  };
  useEffect(() => {
    new Clipboard('.copy');
    var avater = document.getElementById('avater') as unknown as HTMLElement;
    avater.innerHTML = '';
    avater.appendChild(jazzicon(24, jsNumberForAddress(wallet.address)));
    getTHistory();
  }, [wallet]);

  const copy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  return (
    <div className={style.layout}>
      <div className={style.content}>
        <div className={style.header}>
          <h2>
            <span>Account</span> <Close className={style.icon} onClick={close} fill="#fff" />{' '}
          </h2>
          <div className={`${style.account}`}>
            <p>Connected with Metamask</p>
            <div className={style.user}>
              <div className="img" id="avater"></div>
              <p>{tranceAddress(wallet.address)}</p>
            </div>
            <div className={style.tools}>
              {/* <Tooltip placement="top" trigger='click' title='copied'> */}
              {copied ? (
                <div
                  onClick={copy}
                  className={`${style.toolItem} copy ${style.copied}`}
                  data-clipboard-text={wallet.address}
                >
                  <Copied className={style.icon2} />
                  <span>Copied!</span>
                </div>
              ) : (
                <div onClick={copy} className={`${style.toolItem} copy`} data-clipboard-text={wallet.address}>
                  <Copy className={style.icon2} fill="#fff" />
                  <span>Copy Address</span>
                </div>
              )}
              <a href={`${getNetWorkPreLink(wallet.chainId)}${wallet.address}`} target="_blank">
                <div className={style.toolItem}>
                  <Share className={style.icon2} fill="#fff" />
                  <span>View on Explorer</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className={style.trans}>
          <div className={style.title}>
            <p>Recent Transactions</p>
            <span onClick={clearAll}>Clear All</span>
          </div>
          <ul className={style.list} id="list">
            {transactions.map((item: Transaction, index: number) => (
              <li key={index} className={style.tranitem}>
                <p>
                  {' '}
                  <a target="_blank" href={`${getNetWorkPre(wallet.chainId)}/tx/${item.tx}`}>
                    {item.name}
                  </a>
                </p>
                <i className={item.status === '' ? style.unfinish : item.status ? `${style.finish}` : style.erroe}></i>
              </li>
            ))}
          </ul>
          <div className={style.btns}>
            <button onClick={enable}>Disconnect</button>
            {/* <button>Change</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
