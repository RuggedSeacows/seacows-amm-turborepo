import { Network, AppConfig } from './type';

function loadConfig() {
  const RPC_URL = process.env.RPC_URL;
  const NETWORK = (process.env.NETWORK || 'mainnet') as Network;
  const REDIS_URL = process.env.REDIS_URL;
  const FILTER_BLOCK_STEP = JSON.parse(process.env.FILTER_BLOCK_STEP || '3000');

  if (!RPC_URL) {
    throw new Error('RPC_URL is not provided');
  }

  if (!REDIS_URL) {
    throw new Error('REDIS_URL is not provided');
  }

  const config: AppConfig = {
    RPC_URL,
    NETWORK,
    REDIS_URL,
    ADDRESSES: {
      mainnet: {
        SeacowsPairFactory: '',
      },
      goerli: {
        SeacowsPairFactory: '0x4AA65D5886Cb59Df1616E86fEC1fFe01b7Ece5B7',
      },
    },
    FILTER_BLOCK_STEP,
  };

  return config;
}

export default loadConfig;
