import { Ethlogobg, Bnblogo } from '@components/index';
export interface Net {
  text: string;
  icon: any;
  chainId: string;
  RPC?: string;
  dote?: string;
  unit: string;
  coinaddress: string;
  desc?: string;
  link?: string;
  href?: string;
}
export const nets: Array<Net> = [
  // {
  //   text: 'Rinkeby Testnet',
  //   icon: <Ethlogobg />,
  //   unit: 'ETH',
  //   chainId: '0x4',
  //   link: 'https://rinkeby.etherscan.io/address/',
  //   href: 'https://rinkeby.etherscan.io/',
  //   coinaddress: 'https://rinkebyfaucet.com',
  //   desc: 'Rinkby ETH'
  // },
  {
    text: 'Goerli Testnet',
    icon: <Ethlogobg />,
    unit: 'ETH',
    chainId: '0x5',
    link: 'https://goerli.etherscan.io/address/',
    href: 'https://goerli.etherscan.io',
    coinaddress: 'https://faucet.paradigm.xyz/',
    desc: 'Goerli ETH'
  }
  // {
  //   text: 'BSC Testnet',
  //   icon: <Bnblogo />,
  //   chainId: '0x61',
  //   unit: 'BNB',
  //   link: 'https://testnet.bscscan.com/address/',
  //   href: 'https://testnet.bscscan.com',
  //   RPC: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  //   dote: 'tBNB',
  //   coinaddress: 'https://testnet.bscscan.com',
  //   desc: 'Testnet BNB'
  // }
];

export const networks: any = {
  '0x4': 'https://rinkeby.infura.io/v3/9a3f14b3724843eba39371fa3886319b',
  '0x5': 'https://goerli.infura.io/v3/9a3f14b3724843eba39371fa3886319b',
  '0x61':
    'https://multi-cosmological-patina.bsc-testnet.discover.quiknode.pro/efffa96adc67e556bee59943b17e186f84280a67/'
};
