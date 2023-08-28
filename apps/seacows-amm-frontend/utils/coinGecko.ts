import { CoinGeckoClient } from 'coingecko-api-v3';
import { Net, nets } from '@lib/net';
const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true
});

export const coin2$ = async (chainId?: any) => {
  const coinIds: any = {
    ETH: 'ethereum',
    BNB: ''
  };
  let ids = coinIds[nets.find((item: Net) => item.chainId === chainId)?.unit || 'ethereum'];
  // let coin = await client.coinList({include_platform: true })
  // console.log(coin, 'coinList')
  const price = await client.simplePrice({ ids, vs_currencies: 'usd' });
  return price[ids].usd;
};
