import { CollectionMetadata } from 'src/utils/types';
import axios from 'axios';

const CENTER_API_KEY = () => process.env.CENTER_API_KEY;

const networks: any = {
  '0x4': 'ethereum-rinkeby',
  '0x5': 'ethereum-goerli',
  '0x61': 'bsc-testnet',
};

interface Params {
  [key: string]: any;
}
const getParams = (params: Params) => {
  return Object.keys(params)
    .map((item: string) => `${item}=${params[item]}`)
    .join('&');
};

export const getNftCollections = (
  address: string,
  network?: string,
): Promise<CollectionMetadata> => {
  const pNetwork = network
    ? networks[network]
    : process.env.NETWORK === 'mainnet'
    ? 'ethereum'
    : 'ethereum-goerli';

  return axios
    .get(`https://api.center.dev/v1/${pNetwork}/${address}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CENTER_API_KEY(),
      },
    })
    .then((res) => res.data);
};
