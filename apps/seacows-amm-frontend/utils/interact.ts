import { getCoinbase } from '@utils/index';
declare const window: any;
import { transBalance, tranceAddress, getTokens } from '@utils/index';

export const getMetaChainId = async () => {
  return window.ethereum.request({ method: 'eth_chainId' });
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const balance = await getMetaMaskBalance(addressArray[0]);
      const chainId = await getMetaChainId();
      const tokens = await getTokens(addressArray[0], chainId);
      const obj = {
        status: '👆🏽 Write a message in the text-field above.',
        address: addressArray[0],
        balance: transBalance(balance),
        chainId,
        tokens
      };
      return obj;
    } catch (err: any) {
      return {
        address: '',
        status: '😥 ' + err.message,
        balance: '',
        chainId: '',
        tokens: []
      };
    }
  }
};

export const chainChange = (call: any) => {
  if (window.ethereum)
    window.ethereum.on('chainChanged', (chainId: string) => {
      call && call(chainId);
    });
};

export const accountChange = (call: Function) => {
  if (window.ethereum)
    window.ethereum.on('accountsChanged', (accounts: string) => {
      call && call(accounts);
    });
};
export const disconnect = (call: Function) => {
  debugger;
  if (window.ethereum)
    window.ethereum.on('disconnect', (error: string) => {
      call && call(error);
    });
};

export const switchEthereumChain = async (chainId: string, data: any) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }]
    });
  } catch (switchError: any) {
    console.log(switchError);
    // debugger
    if (switchError.code === 4902 || switchError == '-3260') {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: data.chainId,
              chainName: data.text,
              rpcUrls: [data.RPC],
              nativeCurrency: {
                name: data.dote,
                symbol: data.dote, // 2-6 characters long
                decimals: 17
              }
            }
          ]
        });
      } catch (addError) {
        console.log(addError, '999');
      }
    }
  }
};

export const getMetaMaskBalance = async (address: string) => {
  return window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] });
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    // var web3 = new Web3();
    // web3.setProvider(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/9a3f14b3724843eba39371fa3886319b"))
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts'
      });
      if (addressArray.length > 0) {
        const balance = await getMetaMaskBalance(addressArray[0]);
        const chainId = await getMetaChainId();
        const tokens = await getTokens(addressArray[0], chainId);
        return {
          address: addressArray[0],
          status: '👆🏽 Write a message in the text-field above.',
          balance: transBalance(balance),
          chainId,
          tokens
        };
      } else {
        return {
          address: '',
          status: '🦊 Connect to Metamask using the top right button.',
          balance: '',
          chainId: '',
          tokens: []
        };
      }
    } catch (err: any) {
      return {
        address: '',
        status: '😥 ' + err?.message
      };
    }
  }
};

export const enable = () => {
  localStorage.removeItem('wallet');
  location.reload();
};
