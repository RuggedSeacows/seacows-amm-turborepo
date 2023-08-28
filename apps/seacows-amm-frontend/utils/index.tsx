import Web3 from 'web3';
export const web3 = new Web3(); // window.web3.currentProvider
import Moralis from 'moralis';
import { nets, Net } from '@lib/net';
import { Tokenheadplaceholder, Nftheadplaceholder } from '@components/index';
import { networks } from '@lib/net';
import { getmultipleAssets } from '@api/center';
import { Erc20Client } from '@utils/contract/erc20';
Moralis.start({ apiKey: 'fRurSRrghQHbMig7bAfG4LzGtVQDtvW30awEPf6nxeLtuouGhBlM6tg4In67vISE' });

export const transBalance = (hex: string) => {
  try {
    return Web3.utils.hexToNumber(hex) || '0.00';
  } catch (error) {
    return (parseInt(hex, 16) / 10 ** 18).toFixed(4);
  }
};
const setChain = (chain: string) => {
  web3.setProvider(new Web3.providers.HttpProvider(networks[chain as any]));
};

export const getNetWorkPreLink = (chain: string) => {
  return nets.find((item: Net) => item.chainId === chain)?.link;
};
export const getNetWorkPre = (chain: string) => {
  return nets.find((item: Net) => item.chainId === chain)?.href;
};

export const getCoinbase = async (chain: string) => {
  setChain(chain);
  return await web3.eth.getCoinbase();
};

export const tranceAddress = (address: string): string => {
  if (!address) return '';
  return address.slice(0, 6) + '....' + address.substring(address.length - 4);
};

export const jsNumberForAddress = (address: string): number => {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
};

export async function getNFTMetadata(address: string, tokenId: string, chain: string) {
  return await Moralis.EvmApi.nft.getNFTMetadata({
    address,
    tokenId: tokenId,
    chain
  });
}

export async function getTokenMetadata(address: string, chain: string) {
  let token = {};
  const tokens = await getTokens(address, chain);
  if (tokens.length) {
    const _token = tokens[0];
    token = {
      name: _token.name,
      symbol: _token.symbol,
      balance: web3.utils.fromWei(_token.balance),
      icon: _token.logo ? <img src={_token.logo} alt="" /> : null,
      token_address: _token.token_address
    };
  } else {
    const balance = await getNativeBalance(address, chain);
    token = {
      name: nets.find((item: Net) => item.chainId === chain)?.unit,
      balance: web3.utils.fromWei(balance.raw.balance),
      icon: nets.find((item: Net) => item.chainId === chain)?.icon
    };
  }
  return token;
}

export async function getTokenMetadataByType(tokenStr: string, account: string, chain: string) {
  // get data from contract
  let token = {};
  if (tokenStr === 'ETH') {
    const net = nets.find((item: Net) => item.chainId === chain);
    token = {
      name: net?.unit,
      icon: net?.icon,
      balance: Number(web3.utils.fromWei(await getBalance(account, chain))).toFixed(4)
    };
  } else {
    const erc20Client = await Erc20Client(tokenStr, chain);
    token = {
      name: await erc20Client.methods.name().call(),
      symbol: await erc20Client.methods.symbol().call(),
      balance: Number(web3.utils.fromWei(await erc20Client.methods.balanceOf(account).call())).toFixed(4),
      icon: null,
      token_address: tokenStr
    };
  }
  return token;
}

export const getNativeBalance = async (address: string, chain: string) => {
  return await Moralis.EvmApi.balance.getNativeBalance({
    chain: chain,
    address: address
  });
};

export const getBalance = async (address: string, chain: string) => {
  setChain(chain);
  return web3.eth.getBalance(address);
};

export const getUserNfts = async (address: string, chain: string, limit?: number, cursor?: string) => {
  const options = {
    chain: chain,
    address: address,
    limit: limit || 100,
    cursor
  };
  const nfts = await Moralis.EvmApi.nft.getWalletNFTs(options);
  console.log(nfts, 'nfts');
  const centerMetaData: any = await getmultipleAssets(
    nfts.result.map((item: any) => ({ address: item.result.tokenAddress._value, tokenID: item.result.tokenId })),
    chain
  );
  if (limit) {
    return {
      ...nfts,
      raw: nfts.raw,
      result: nfts.result.map((item: any, index: number) => ({
        result: { ...item.result, image: centerMetaData[index]?.small_preview_image_url }
      }))
    };
  }
  return nfts.result.map((item: any, index: number) => ({
    ...item.result,
    image: centerMetaData[index]?.small_preview_image_url
  }));
};
export const getNFTsForContract = async (
  address: string,
  tokenAddress: string,
  chain: string,
  limit = 100,
  cursor?: string
) => {
  const options = {
    chain: chain,
    token_addresses: [tokenAddress],
    address: address,
    limit,
    cursor
  };
  const nfts = await Moralis.EvmApi.nft.getWalletNFTs(options);
  const centerMetaData: any = await getmultipleAssets(
    nfts.result.map((item: any) => ({ address: item.result.tokenAddress._value, tokenID: item.result.tokenId })),
    chain
  );
  if (limit) {
    return {
      ...nfts,
      raw: nfts.raw,
      result: nfts.result.map((item: any, index: number) => ({
        result: { ...item.result, image: centerMetaData[index].small_preview_image_url }
      }))
    };
  }
  return nfts.result.map((item: any, index: number) => ({
    ...item.result,
    image: centerMetaData[index].small_preview_image_url
  }));
};

export const getTokens = async (address: string, chain: string) => {
  const options = {
    chain: chain,
    address: address
  };
  const Balance = await Moralis.EvmApi.token.getWalletTokenBalances(options);
  return Balance.raw
    .filter((item: any) => item.balance != '0')
    .map((item: any) => ({
      ...item,
      label: item.name,
      desc: item.symbol,
      icon: item.logo
    }));
};

export const getCardSize = (width: number, defWidth = 120, maxWidth = 200) => {
  let _width = defWidth;
  if (defWidth < 120) _width = 120;
  if (defWidth > maxWidth) _width = maxWidth;
  const num = width / (_width + 16);
  const lave = Math.floor(width % (_width + 16));
  return Math.floor(_width + lave / num);
};

export const isAddress = (string: string) => {
  return Web3.utils.isAddress(string);
};

export const getTransactions = async (address: string, chain: string, limit = 10, cursor?: string) => {
  return await Moralis.EvmApi.transaction.getWalletTransactions({
    address: address,
    chain: chain,
    limit,
    cursor
  });
};

export const getPoolMetaDate = async (address: string, chain: string) => {
  return Promise.all([
    new Promise(async (resolve, rejects) => {
      const native = await getBalance(address, chain);
      let token = {};
      if (native !== '0') {
        token = {
          logo: nets.find((item: Net) => item.chainId === chain)?.icon,
          name: nets.find((item: Net) => item.chainId === chain)?.unit
        };
      } else {
        const res = await getTokens(address, chain);
        token = {
          ...(res[0] || {}),
          logo:
            res[0] && res[0]?.logo ? (
              <img src={res[0].logo} alt="" />
            ) : (
              <Tokenheadplaceholder style={{ fontSize: '48px' }} />
            )
        };
      }
      resolve(token);
    }),
    new Promise(async (resolve, rejects) => {
      setTimeout(async () => {
        const res: any = await getUserNfts(address, chain, 1);
        const image = res.result[0]?.result?.image || res.result[0]?.result?.metadata?.image;
        resolve({
          ...res.result[0]?.result,
          logo: image ? <img src={image} alt="" /> : <Nftheadplaceholder style={{ fontSize: '48px' }} />
        });
      }, 100);
    })
  ]);
};

export const getTransactionReceipt = async (tx: string, chain: string) => {
  setChain(chain);
  return await web3.eth.getTransactionReceipt(tx);
};
