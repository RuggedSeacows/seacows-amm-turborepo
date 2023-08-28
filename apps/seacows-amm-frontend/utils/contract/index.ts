import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { networks } from '@lib/net';
export const web3 = new Web3(); // window.web3.currentProvider
import { wallet } from '@utils/wallet';
import {
  LinearCurveAddress,
  ExponentialCurveAddress,
  SeacowsPairFactoryAddress,
  SeacowsPairEnumerableERC20Address,
  SeacowsPairMissingEnumerableERC20Address,
  SeacowsPairEnumerableETHAddress,
  SeacowsPairMissingEnumerableETHAddress,
  SeacowsRouterAddress
} from '@lib/contract';
const ERC20Abi = require('../../lib/abi/ERC20.sol/ERC20.json');
import { Erc721Abi } from '../sol/index';
const LinearCurveAbi = require('../../lib/abi/LinearCurve.sol/LinearCurve.json');
const ExponentialCurveAbi = require('../../lib/abi/ExponentialCurve.sol/ExponentialCurve.json');
const SeacowsPairFactoryAbi = require('../../lib/abi/SeacowsPairFactory.sol/SeacowsPairFactory.json');
const SeacowsPairEnumerableERC20Abi = require('../../lib/abi/SeacowsPairEnumerableERC20.sol/SeacowsPairEnumerableERC20.json');
const SeacowsPairMissingEnumerableERC20Abi = require('../../lib/abi/SeacowsPairMissingEnumerableERC20.sol/SeacowsPairMissingEnumerableERC20.json');
const SeacowsPairEnumerableETHAbi = require('../../lib/abi/SeacowsPairEnumerableETH.sol/SeacowsPairEnumerableETH.json');
const SeacowsPairMissingEnumerableETHAbi = require('../../lib/abi/SeacowsPairMissingEnumerableETH.sol/SeacowsPairMissingEnumerableETH.json');

const setChain = (chain: string) => {
  web3.setProvider(new Web3.providers.HttpProvider(networks[chain as any]));
};

export const ERC20Approved = async (
  address: string,
  chain: string,
  tokenAddress: string,
  approveto = SeacowsPairFactoryAddress
) => {
  // console.log( 'SeacowsRouterAddress', address, SeacowsRouterAddress, approveto, tokenAddress)
  setChain(chain);
  const ERC20 = new web3.eth.Contract(ERC20Abi, tokenAddress);
  return await ERC20.methods.allowance(address, approveto).call();
};

export const approveErc20 = async (
  address: string,
  chain: string,
  tokenAddress: string,
  balance: string,
  approveto = SeacowsPairFactoryAddress
) => {
  console.log(tokenAddress, approveto, balance);
  setChain(chain);
  const ERC20 = new web3.eth.Contract(ERC20Abi, tokenAddress);
  // console.log(String(~~(await web3.eth.estimateGas({ from: address }) / 2)))
  const transactionParameters = {
    to: tokenAddress,
    from: address,
    gas: '20000',
    // gasPrice: String(await web3.eth.estimateGas({ from: address })), // String(await ERC20.methods.approve(approveto, balance).estimateGas()),
    data: ERC20.methods.approve(approveto, balance).encodeABI()
  };
  const _wallet = wallet();
  try {
    const txHash = await _wallet.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters]
    });
    return txHash;
  } catch (error) {
    return false;
  }
};

export const getTransaction = async (transactionHash: string) => {
  const res = await web3.eth.getTransactionReceipt(transactionHash);
  return res || {};
};
export const listenTransaction = async (transactionHash: string, chain: string, call?: Function) => {
  setChain(chain);
  let transaction = await getTransaction(transactionHash);
  console.log(transaction, 'transaction');
  if (typeof transaction?.status !== 'boolean') {
    setTimeout(() => {
      listenTransaction(transactionHash, chain, call);
    }, 500);
  } else {
    call && call(transaction?.status);
  }
};

export const getBuyInfo = async (data: any, chain: string) => {
  setChain(chain);
  const spotPrice = web3.utils.toWei(data.spotPrice);
  let delta = new BigNumber(data.delta * 10 ** 18).toString();
  if (data.curve != 'Linear Curve') {
    delta = new BigNumber(data.delta * 10 ** 16).plus(1 * 10 ** 18).toString();
  }
  const numItems = data.numNFTs;
  const feeMultiplier = new BigNumber(Number(data.fee.replace('%', '')) * 10 ** 16).toString();
  const protocolFeeMultiplier = new BigNumber(0.5 * 10 ** 16).toString();
  let resp: any = null;
  if (data.curve === 'Linear Curve') {
    const LinearCurve = new web3.eth.Contract(LinearCurveAbi, LinearCurveAddress);
    resp = await LinearCurve.methods
      .getBuyInfo(spotPrice, delta, numItems, feeMultiplier, protocolFeeMultiplier)
      .call();
  } else {
    const ExponentialCurve = new web3.eth.Contract(ExponentialCurveAbi, ExponentialCurveAddress);
    resp = await ExponentialCurve.methods
      .getBuyInfo(spotPrice, delta, numItems, feeMultiplier, protocolFeeMultiplier)
      .call();
  }
  if (resp?.error === '1') {
    return {
      min: 0,
      max: 0,
      protocolFee: 0,
      inputValue: 0,
      newSpotPrice: 0,
      error: true
    };
  }
  console.log(resp, 'getBuyInfo');
  return {
    protocolFee: web3.utils.toWei(resp.protocolFee),
    newSpotPrice: web3.utils.fromWei(resp.newSpotPrice),
    inputValue: resp.inputValue
  };
};

export const getSellInfo = async (data: any, chain: string) => {
  setChain(chain);
  const spotPrice = new BigNumber(data.spotPrice * 10 ** 18).toString();
  let delta = new BigNumber(data.delta * 10 ** 18).toString();
  if (data.curve != 'Linear Curve') {
    delta = new BigNumber(data.delta * 10 ** 16).plus(1 * 10 ** 18).toString();
  }
  const numItems = data.numNFTs;
  const feeMultiplier = new BigNumber(Number(data.fee.replace('%', '')) * 10 ** 16).toString(); // String(Number(data.fee.replace('%', '')) * 10**10) + '00000000'
  const protocolFeeMultiplier = new BigNumber(0.5 * 10 ** 16).toString();
  let resp: any = null;
  console.log(
    `spotPrice: ${spotPrice}, delta: ${delta}, numItems: ${numItems}, feeMultiplier: ${feeMultiplier}, protocolFeeMultiplier: ${protocolFeeMultiplier}`
  );
  if (data.curve === 'Linear Curve') {
    const LinearCurve = new web3.eth.Contract(LinearCurveAbi, LinearCurveAddress);
    resp = await LinearCurve.methods
      .getSellInfo(spotPrice, delta, numItems, feeMultiplier, protocolFeeMultiplier)
      .call();
  } else {
    const ExponentialCurve = new web3.eth.Contract(ExponentialCurveAbi, ExponentialCurveAddress);
    resp = await ExponentialCurve.methods
      .getSellInfo(spotPrice, delta, numItems, feeMultiplier, protocolFeeMultiplier)
      .call();
  }
  console.log(resp, resp.error, 'getSellInfo');
  if (resp?.error === '1') {
    return {
      min: 0,
      max: 0,
      protocolFee: 0,
      inputValue: 0,
      newSpotPrice: 0,
      error: true
    };
  }
  let linear = Object.keys(resp)
    .filter((item: string) => /\d+/.test(item))
    .map((item: string) => resp[item])
    .sort((a: string, b: string) => Number(a) - Number(b));
  return {
    min: (Number(linear.shift()) / 10 ** 18).toFixed(2),
    max: (Number(linear.pop()) / 10 ** 18).toFixed(2),
    protocolFee: Number(resp.protocolFee) / 10 ** 18,
    newSpotPrice: web3.utils.fromWei(resp.newSpotPrice),
    inputValue: resp.outputValue
  };
};

export const needApprove = async (
  address: string,
  token_address: string,
  chain: string,
  contract = SeacowsPairFactoryAddress
) => {
  setChain(chain);
  const current = new web3.eth.Contract(Erc721Abi, token_address);
  console.log(current, 'isApprovedForAll');
  return !(await current.methods.isApprovedForAll(address, contract).call());
};

export const approve = async (
  address: string,
  token_address: string,
  chain: string,
  bool = true,
  contract = SeacowsPairFactoryAddress
) => {
  setChain(chain);
  const Erc721 = new web3.eth.Contract(Erc721Abi, token_address);
  const transactionParameters = {
    to: token_address,
    from: address,
    gas: '20000',
    // gasPrice: String(await web3.eth.estimateGas({ from: address })), // String(await Erc721.methods.setApprovalForAll(contract, bool).estimateGas()),
    data: Erc721.methods.setApprovalForAll(contract, bool).encodeABI()
  };
  const _wallet = wallet();
  try {
    const txHash = await _wallet.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters]
    });
    return txHash;
  } catch (error) {
    return false;
  }
};

export const createPair = async (data: any, chain: string) => {
  setChain(chain);
  const SeacowsPairFactory = new web3.eth.Contract(SeacowsPairFactoryAbi, SeacowsPairFactoryAddress);
  const { ids, tokenAddress, erc20Address, isErc20, inputValue, address, chainId, price } = data;
  const curveaddressmap: any = {
    'Linear Curve': LinearCurveAddress,
    'Exponential Curve': ExponentialCurveAddress
  };
  const spotPrice = new BigNumber(data.price * 10 ** 18).toString();
  let delta = new BigNumber(Number(data.delta) * 10 ** 18).toString();
  // let delta = new BigNumber( data.delta * 10 ** 18).toString()
  if (data.curve != 'Linear Curve') {
    delta = new BigNumber(data.delta * 10 ** 16).plus(1 * 10 ** 18).toString();
  }
  const fee = new BigNumber(Number(data.fee.replace('%', '')) * 10 ** 18).toString();
  const _assetRecipient = '0x0000000000000000000000000000000000000000';
  const _bondingCurve = curveaddressmap[data.curve];
  const _poolType = '2';
  let sendData = null;
  let transactionParameters: any = null;
  let allowed = await SeacowsPairFactory.methods.bondingCurveAllowed(_bondingCurve).call(); // 合约开关
  if (!allowed) return; // TODO 给提示
  if (!isErc20) {
    console.log(
      'createPairETH',
      tokenAddress,
      _bondingCurve,
      _assetRecipient,
      _poolType,
      delta,
      fee,
      spotPrice,
      ids,
      Web3.utils.numberToHex(inputValue)
    );
    sendData = SeacowsPairFactory.methods
      .createPairETH(tokenAddress, _bondingCurve, _assetRecipient, _poolType, delta, fee, spotPrice, ids)
      .encodeABI();
    transactionParameters = {
      to: SeacowsPairFactoryAddress,
      from: address,
      data: sendData,
      gas: '200000',
      chainId: chainId,
      value: Web3.utils.numberToHex(inputValue)
    };
  } else {
    console.log(
      'createPairERC20',
      erc20Address,
      tokenAddress,
      _bondingCurve,
      _assetRecipient,
      _poolType,
      delta,
      fee,
      spotPrice,
      ids,
      inputValue
    );
    sendData = SeacowsPairFactory.methods
      .createPairERC20([
        erc20Address,
        tokenAddress,
        _bondingCurve,
        _assetRecipient,
        _poolType,
        delta,
        fee,
        spotPrice,
        ids,
        inputValue
      ])
      .encodeABI();
    transactionParameters = {
      to: SeacowsPairFactoryAddress,
      from: address,
      data: sendData,
      gas: '200000',
      chainId: chainId
    };
  }
  const _wallet = wallet();
  try {
    const txHash = await _wallet.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters]
    });
    console.log(txHash, 'txHash');
    return txHash;
  } catch (error) {
    return false;
  }
};

export const getTempalte = async (contract: string, chain: string) => {
  setChain(chain);
  const SeacowsPairFactory = new web3.eth.Contract(SeacowsPairFactoryAbi, SeacowsPairFactoryAddress);
  let isPair0 = await SeacowsPairFactory.methods.isPair(contract, 0).call();
  let isPair1 = await SeacowsPairFactory.methods.isPair(contract, 1).call();
  let isPair2 = await SeacowsPairFactory.methods.isPair(contract, 2).call();
  let isPair3 = await SeacowsPairFactory.methods.isPair(contract, 3).call();
  if (isPair0) {
    return 0;
  } else if (isPair1) {
    return 1;
  } else if (isPair2) {
    return 2;
  } else if (isPair3) {
    return 3;
  } else {
    return -1;
  }
};
// 0 对应说明这个pair 是enmuerableETHtemplate， 1: enmuerableERC20template
// 2: MissingenmuerableETHtemplate ； 3: MissingenmuerableERC20template
export const getTemplateContracts = () => {
  return [
    new web3.eth.Contract(SeacowsPairEnumerableETHAbi, SeacowsPairEnumerableETHAddress),
    new web3.eth.Contract(SeacowsPairEnumerableERC20Abi, SeacowsPairEnumerableERC20Address),
    new web3.eth.Contract(SeacowsPairMissingEnumerableETHAbi, SeacowsPairMissingEnumerableETHAddress),
    new web3.eth.Contract(SeacowsPairMissingEnumerableERC20Abi, SeacowsPairMissingEnumerableERC20Address)
  ];
};
const TemplateContracts = [
  new web3.eth.Contract(SeacowsPairEnumerableETHAbi, SeacowsPairEnumerableETHAddress),
  new web3.eth.Contract(SeacowsPairEnumerableERC20Abi, SeacowsPairEnumerableERC20Address),
  new web3.eth.Contract(SeacowsPairMissingEnumerableETHAbi, SeacowsPairMissingEnumerableETHAddress),
  new web3.eth.Contract(SeacowsPairMissingEnumerableERC20Abi, SeacowsPairMissingEnumerableERC20Address)
];

const sendTransaction = async (params: any) => {
  const _wallet = wallet();
  try {
    const txHash = await _wallet.request({
      method: 'eth_sendTransaction',
      params: [params]
    });
    console.log(txHash, 'txHash');
    return txHash;
  } catch (error) {
    return false;
  }
};
export const withdrawERC721 = async (
  type: number,
  address: string,
  contract: string,
  tokenAddress: string,
  ids: number | string,
  chain: string
) => {
  setChain(chain);
  const currentContract = getTemplateContracts()[type];
  if (currentContract) {
    const transactionParameters = {
      to: contract,
      from: address,
      data: currentContract.methods.withdrawERC721(tokenAddress, ids).encodeABI(),
      gas: '200000',
      chainId: chain
    };
    return await sendTransaction(transactionParameters);
  }
  return false;
};

export const withdrawERC20 = async (
  type: number,
  address: string,
  contract: string,
  tokenAddress: string,
  amount: number | string,
  chain: string
) => {
  setChain(chain);
  const currentContract = TemplateContracts[type];
  if (currentContract) {
    const transactionParameters = {
      to: contract,
      from: address,
      data: currentContract.methods.withdrawERC20(tokenAddress, web3.utils.toWei(String(amount))).encodeABI(),
      gas: '200000',
      chainId: chain
    };
    return await sendTransaction(transactionParameters);
  }
  return false;
};
export const withdrawETH = async (
  type: number,
  address: string,
  contract: string,
  amount: number | string,
  chain: string
) => {
  setChain(chain);
  const currentContract = TemplateContracts[type];
  if (currentContract) {
    // console.log(currentContract)
    const transactionParameters = {
      to: contract,
      from: address,
      data: currentContract.methods.withdrawETH(web3.utils.toWei(String(amount))).encodeABI(),
      gas: '200000',
      chainId: chain
    };
    return await sendTransaction(transactionParameters);
  }
  return false;
};

// TODO
export const swapNFTsForToken = async (
  swapList: any,
  minAmount: any,
  address: string,
  chain: string,
  deadline = Date.now() + 1000 * 60 * 10
) => {
  console.log(swapList, minAmount, address, chain);
  // return
  setChain(chain);
  const pair_client = await new web3.eth.Contract(
    require('../../lib/abi/SeacowsRouter.sol/SeacowsRouter.json'),
    SeacowsRouterAddress
  );
  console.log(pair_client, swapList, minAmount, address, chain, SeacowsRouterAddress);
  const transactionParameters = {
    to: SeacowsRouterAddress,
    from: address,
    data: pair_client.methods.swapNFTsForToken(swapList, String(minAmount), address, deadline).encodeABI(),
    gas: '200000',
    chainId: chain
  };
  return await sendTransaction(transactionParameters);
};

export const swapETHForAnyNFTs = async (
  swapList: any,
  priceValue: number,
  address: string,
  chain: string,
  deadline = Date.now() + 1000 * 60 * 10
) => {
  console.log(swapList, address, chain, priceValue, Web3.utils.numberToHex(priceValue));
  setChain(chain);
  const pair_client = await new web3.eth.Contract(
    require('../../lib/abi/SeacowsRouter.sol/SeacowsRouter.json'),
    SeacowsRouterAddress
  );
  const transactionParameters = {
    to: SeacowsRouterAddress,
    from: address,
    data: pair_client.methods.swapETHForSpecificNFTs(swapList, address, address, deadline).encodeABI(),
    gas: '200000',
    chainId: chain,
    value: Web3.utils.numberToHex(priceValue)
  };
  return await sendTransaction(transactionParameters);
};

export const swapERC20ForAnyNFTs = async (
  swapList: any,
  inputAmount: string,
  address: string,
  chain: string,
  deadline = Date.now() + 1000 * 60 * 10
) => {
  console.log(swapList, address, chain, inputAmount);
  setChain(chain);
  const pair_client = await new web3.eth.Contract(
    require('../../lib/abi/SeacowsRouter.sol/SeacowsRouter.json'),
    SeacowsRouterAddress
  );
  const transactionParameters = {
    to: SeacowsRouterAddress,
    from: address, // swapERC20ForSpecificNFTs
    data: pair_client.methods.swapERC20ForSpecificNFTs(swapList, inputAmount, address, deadline).encodeABI(),
    gas: '200000',
    chainId: chain
  };
  return await sendTransaction(transactionParameters);
};
