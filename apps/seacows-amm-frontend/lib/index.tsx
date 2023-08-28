import { EthLogo, EthIcon, Bnblogo, Ethlogobg } from '@components/index';
import style from '../styles/index.module.scss';
export interface Token {
  text: string;
  icon: any;
  icon2?: any;
  desc: string;
}
export const tokens: Array<Token> = [
  {
    text: 'ETH',
    desc: 'desc',
    icon: <EthLogo className={style.icon} />,
    icon2: <EthIcon />
  },
  {
    text: 'BNB',
    desc: 'desc',
    icon: <Bnblogo className={style.icon} />
  },
  {
    text: 'ETH2',
    desc: 'desc',
    icon: <EthLogo className={style.icon} />,
    icon2: <EthIcon />
  },
  {
    text: 'ETH3',
    desc: 'desc',
    icon: <EthLogo className={style.icon} />,
    icon2: <EthIcon />
  },
  {
    text: 'ETH4',
    desc: 'desc',
    icon: <EthLogo className={style.icon} />,
    icon2: <EthIcon />
  }
];

export const coins: any = {
  '0x4': {
    label: 'ETH',
    desc: 'ether',
    icon: <Ethlogobg className={style.icon} />,
    token_address: 'eth'
  },
  '0x5': {
    label: 'ETH',
    desc: 'ether',
    icon: <Ethlogobg className={style.icon} />,
    token_address: 'eth'
  }
};

export const SeacowsEther = '0xbF42fb20703d2B32d4580EFA4BB20F2D4FacbBca';
export const SeacowsNFTworlds = '0x85c88f2b64B0DEdbC7c69CD44Cc1c1cA1E235f72';
export const SeacowsOtherdeedNFT = '0xa44d5f2954Eb528E9cDa391C63EFfe56B38D6556';
export const SeacowsBLOCWARSAPT = '0x167Cf7364Fa1E13cd2CE7C0A85fe566f235118e2';
export const SeacowsOasis = '0x3a364eDbFdC74220fbA451034362ad31427e81e9';
