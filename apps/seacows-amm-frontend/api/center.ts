const XAPIKey = 'key-73e4c51ff1eb-f47955001d15';

const networks: any = {
  '0x4': 'ethereum-rinkeby',
  '0x5': 'ethereum-goerli',
  '0x61': 'bsc-testnet'
};

interface Params {
  [key: string]: any;
}
const getParams = (params: Params) => {
  return Object.keys(params)
    .map((item: string) => `${item}=${params[item]}`)
    .join('&');
};

export const getOwnedByAccount = (address: string, network: string, params?: Params) => {
  return fetch(
    `https://api.center.dev/v1/${networks[network]}/account/${address}/assets-owned?${getParams(params || {})}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': XAPIKey
      }
    }
  ).then((res) => res.json());
};

export const getNftCollections = (address: string, network: string) => {
  return fetch(`https://api.center.dev/v1/${networks[network]}/${address}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': XAPIKey
    }
  }).then((res) => res.json());
};

export const collectionSearch = (address: string, network: string) => {
  return fetch(`https://api.center.dev/v1/${networks[network]}/search?query=${address}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': XAPIKey
    }
  }).then((res) => res.json());
};

interface Assets {
  address: string;
  tokenID: string;
}
export const getmultipleAssets = (assets: Array<Assets>, network: string) => {
  return fetch(`https://api.center.dev/v1/${networks[network]}/assets`, {
    method: 'POST',
    body: JSON.stringify({ assets }),
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': XAPIKey
    }
  }).then((res) => res.json());
};
