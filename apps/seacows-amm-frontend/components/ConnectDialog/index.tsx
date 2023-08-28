import style from './index.module.scss';
import { Close, MetaMask, WalletConnect, Right } from '../index';
import { connectWallet } from '../../utils/interact';
interface Wallet {
  text: string;
  icon: any;
}
interface Props {
  close: Function;
  success: Function;
}

const wallets: Array<Wallet> = [
  {
    text: 'MetaMask',
    icon: MetaMask
  }
  // {
  //   text: 'Wallet Connect',
  //   icon: WalletConnect
  // }
];

const ConnectWallet = (props: Props) => {
  const { close, success } = props;

  const connect = async (text: string) => {
    close(false);
    const walletResponse: any = await connectWallet();
    localStorage.setItem('wallet', text);
    success({
      ...walletResponse,
      type: text
    });
  };
  return (
    <div className={style.dialgo}>
      <div className={style.content}>
        <h2>
          {' '}
          <span>Connect a wallet</span>{' '}
          <Close onClick={() => close(false)} style={{ marginRight: '-6px' }} className={style.icon} fill="#fff" />{' '}
        </h2>
        <img src="/img/wallet.png" alt="wallet" />
        <ul className={style.list}>
          {wallets.map((item: Wallet, index: number) => (
            <li key={index} className={style.wallet} onClick={() => connect(item.text)}>
              <item.icon className={style.icon} />
              <p>{item.text}</p>
              <Right className={style.icon} fill="#fff" />
            </li>
          ))}
        </ul>
        <p>Haven’t got a crypto wallet yet? </p>
        <span>Set up an Ethereum Wallet to swap and earn here. </span>
        <a href="https://ethereum.org/en/wallets/" target={'_blank'} rel="noreferrer">
          Learn more
        </a>
        {/* <p className={ style.tip } >By connecting a wallet, I agree to Seacows Foundation’s <a>Terms of Use</a> and <a>Cookies Policy.</a></p> */}
      </div>
    </div>
  );
};

export default ConnectWallet;
