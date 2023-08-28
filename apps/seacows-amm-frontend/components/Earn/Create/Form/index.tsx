import style from './index.module.scss';
import Card from '../index.module.scss';
import {
  Close,
  Add,
  Helphover,
  Stepstitlen1default,
  Stepstitlen1hoveractive,
  Stepstitlen2default,
  Stepstitlen2hoveractive,
  Stepstitlen3default,
  Stepstitlen3hoveractive,
  Stepsfinished
} from '@components/index';
import { useState } from 'react';
import Input from '@src/components/Common/Input';
import Warning from '@src/components/Common/Warning';
import { getCardSize, getNFTsForContract, getNetWorkPre } from '@utils/index';
import {
  web3,
  ERC20Approved,
  approveErc20,
  listenTransaction,
  getSellInfo,
  getBuyInfo,
  needApprove as isNeedApprove,
  approve,
  createPair
} from '@utils/contract/index';
import { getGroupPrice } from '@utils/contract/ai';
import { coin2$ } from '@utils/coinGecko';
import { useEffect } from 'react';
import NftCard from '@components/NftCard';
import { Tooltip } from 'antd';
import ResetPrice from './ResetPrice';
import ResetDelta from './ResetDelta';
import Confirm from '@src/components/Common/Confirm';
import ConfirmCreate from '@components/ConfirmCreate';
import Tip from '@components/Tip';
import Router from 'next/router';
import { addHistory } from '@utils/wallet';
import { SeacowsEther, SeacowsNFTworlds, SeacowsOtherdeedNFT } from '@lib/index';
import { getOwnedByAccount } from '@api/center';
import Notifaction from '@components/Common/Notifaction';
interface Step2 {
  curve: string;
  delta: string | number;
}
export default (props: any) => {
  const { close, collection, token, wallet, globalStore } = props;
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [cursor, setCursor] = useState('');
  const [nfts, setNfts] = useState<any>([]);
  const [size, setSize] = useState(120);
  const [step, setStep] = useState(1);
  const [usd, setUsd] = useState(1);
  const [step1, setStep1] = useState({ price: '1', fee: '0.5%' });
  const [resetPrice, setResetprice] = useState(false);
  const [resetDelta, setResetDelta] = useState(false);
  const [step2, setStep2] = useState<Step2>({ curve: 'Linear Curve', delta: '0.2' });
  const [step3, setStep3] = useState<any>({ nfts: 4, token: 0.2, from: 0, to: 0, totalPrice: 0, inputValue: '' });
  const [buynfts, setbuynfts] = useState<number | string>(0);
  const [aiPrice, setAiPrice] = useState('');
  const [needApprove, setNeedApprove] = useState(true);
  const [needApproveERC20, setNeedApproveERC20] = useState(false);
  const [approving, setApproving] = useState(false);
  const [cartdata, setCartData] = useState<any>([]);
  const [showConfirmCLose, setShowConfirmClose] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hoverStep, setHoverStep] = useState(0);
  const [showConfirmAddTip, setShowConfirmAddTip] = useState(false);
  const [showConfirmSuccessTip, setShowConfirmSuccessTip] = useState(false);
  const [showConfirmRejectedTip, setShowConfirmRejectedTip] = useState(false);
  const [showDeltaWarning, setShowDeltaWarning] = useState('');
  const [txhash, setTxHash] = useState('');
  let loading = false;
  const getCurve = async () => {
    let resp: any = await getSellInfo(
      {
        spotPrice: Number(step1.price),
        delta: Number(step2.delta),
        fee: step1.fee,
        numNFTs: ~~buynfts,
        curve: step2.curve
      },
      wallet.chainId
    );
    if (!aiPrice) {
      let buyInfo = await getBuyInfo(
        {
          spotPrice: String(step1.price),
          delta: Number(step2.delta),
          fee: step1.fee,
          numNFTs: cartdata.length,
          curve: step2.curve
        },
        wallet.chainId
      );
      setStep3({
        ...step3,
        from: resp.newSpotPrice,
        to: buyInfo.newSpotPrice,
        totalPrice: resp.protocolFee,
        nfts: cartdata.length,
        inputValue: resp.inputValue
      });
    } else {
      setStep3({
        ...step3,
        from: resp.min,
        to: resp.max,
        totalPrice: resp.protocolFee,
        nfts: cartdata.length,
        inputValue: resp.inputValue
      });
    }

    if (token.erc20) {
      let needAppriveErc20 = await ERC20Approved(wallet.address, wallet.chainId, token.token_address);
      // console.log(needAppriveErc20, 'needAppriveErc20', token)
      if (Number(needAppriveErc20) < Number(resp.inputValue)) {
        setNeedApproveERC20(true);
      }
    }
  };
  const init = async () => {
    setSize(getCardSize(window.innerWidth - 691, ~~((window.innerWidth - 691) / 5)));
    isNeedApprove(wallet.address, collection.tokenAddress, wallet.chainId).then((res) => {
      // console.log(res , 'nftNeedApprove')
      setNeedApprove(res);
    });
    coin2$(wallet.chainId).then((res) => {
      setUsd(res);
    });
    if (
      (!token.erc20 || token.token_address.toLowerCase() === SeacowsEther.toLowerCase()) &&
      (SeacowsNFTworlds === collection.tokenAddress.toLowerCase() ||
        SeacowsOtherdeedNFT === collection.tokenAddress.toLowerCase())
    ) {
      const aiPrice = await getGroupPrice(collection.tokenAddress, wallet.chainId);
      console.log(aiPrice, 'aiPrice');
      setStep1({
        ...step1,
        price: web3.utils.fromWei(aiPrice)
      });
      setAiPrice(web3.utils.fromWei(aiPrice));
    } else {
      setAiPrice('');
    }
    // let res: any = await getNFTsForContract(wallet.address, collection.tokenAddress, wallet.chainId, limit, cursor)
    let centerNfts = await getOwnedByAccount(wallet.address, wallet.chainId, {
      collection: collection.tokenAddress,
      limit,
      offset
    });
    console.log('getOwnedByAccount', centerNfts);
    setNfts(
      centerNfts.items.map((item: any) => ({
        token_address: item.address,
        token_id: item.tokenId,
        smallPreviewImageUrl: item.smallPreviewImageUrl,
        ...item
      }))
    );
    if (centerNfts.items.length === 20) {
      setOffset(20);
    }
  };
  const getMoreNfts = async (e: any) => {
    if (loading) return;
    const formDom = document.getElementById('form') as unknown as HTMLElement;
    if (formDom?.scrollTop + formDom?.clientHeight > formDom?.scrollHeight - 10 && offset !== 0) {
      loading = true;
      // let res: any = await getNFTsForContract(wallet.address, collection.tokenAddress, wallet.chainId, limit, cursor)
      let res: any = await getOwnedByAccount(wallet.address, wallet.chainId, {
        collection: collection.tokenAddress,
        limit,
        offset
      });
      console.log(res, 'getNFTsForContract');
      setNfts([
        ...nfts,
        ...res.items.map((item: any) => ({
          token_address: item.address,
          token_id: item.tokenId,
          smallPreviewImageUrl: item.smallPreviewImageUrl,
          ...item
        }))
      ]);
      if (res.items.length === 20) {
        setOffset(offset + limit);
      } else {
        setOffset(0);
      }
      setTimeout(() => {
        loading = false;
      }, 500);
    }
  };
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    // step 3
    if (step === 3 && ~~buynfts > 0) getCurve();
  }, [step, buynfts, step1, step2, cartdata]);
  useEffect(() => {
    setStep3({ ...step3, nfts: cartdata.length });
  }, [cartdata]);
  const getBtnText = () => {
    if (step < 3) {
      return 'Continue';
    } else if (needApprove && approving) {
      return `Approving ${collection.label}`;
    } else if (needApproveERC20 && approving) {
      return `Approving ${token.label}...`;
    } else if (needApprove) {
      return `Approve ${collection.label}...`;
    } else if (needApproveERC20) {
      return `Approve ${token.label}`;
    } else {
      return 'Preview';
    }
  };
  const addLiquidity = async () => {
    setShowConfirm(false);
    setShowConfirmAddTip(true);
    const poolHex = await createPair(
      {
        ...step1,
        ...step2,
        ...step3,
        ...wallet,
        tokenAddress: collection.tokenAddress,
        ids: cartdata.map((item: any) => item.tokenId),
        isErc20: token.erc20,
        erc20Address: token.token_address
      },
      wallet.chainId
    );
    setShowConfirmAddTip(false);
    if (poolHex) {
      setTxHash(poolHex);
      addHistory({
        tx: poolHex,
        name: `Add ${collection.label}- ${token.label} Liquidity`,
        status: '',
        address: wallet.address,
        chain: wallet.chainId
      });
      globalStore.updateTx();
      setShowConfirmSuccessTip(true);
    } else {
      setShowConfirmRejectedTip(true);
    }
  };
  const submit = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  const changNtfNum = (e: any) => {
    let number = Number(e.target.value);
    if (number > 20) number = 20;
    setStep3({
      ...step3,
      nfts: number
    });
  };
  const preview = () => {
    if (step3.totalPrice > wallet.balance) return;
    if (step2.curve === 'Linear Curve' && ~~(Number(step1.price) / Number(step2.delta)) < buynfts) return;
    if (!cartdata.length) return;
    if (!buynfts) return;
    if (approving) return;
    if (needApprove) {
      if (nfts.length) {
        approve(wallet.address, collection.tokenAddress, wallet.chainId).then(async (txhex: string) => {
          if (txhex) {
            addHistory({
              tx: txhex,
              name: `Approve ${collection.label}`,
              status: '',
              address: wallet.address,
              chain: wallet.chainId
            });
            setApproving(true);
            listenTransaction(txhex, wallet.chainId, () => {
              isNeedApprove(wallet.address, collection.tokenAddress, wallet.chainId).then((res) => {
                setNeedApprove(res);
                setApproving(false);
                Notifaction({
                  type: 'defSuccess',
                  description: `Approve ${collection.label}`,
                  content: (
                    <a className={style.view} target="_blank" href={`${getNetWorkPre(wallet.chainId)}/tx/${txhex}`}>
                      View on Explorer
                    </a>
                  )
                });
              });
            });
          }
        });
      }
      return;
    }
    if (needApproveERC20) {
      approveErc20(wallet.address, wallet.chainId, token.token_address, token.balance).then(async (txhex: string) => {
        if (txhex) {
          addHistory({
            tx: txhex,
            name: `Approve ${token.label}`,
            status: '',
            address: wallet.address,
            chain: wallet.chainId
          });
          setApproving(true);
          listenTransaction(txhex, wallet.chainId, () => {
            ERC20Approved(wallet.address, wallet.chainId, token.token_address).then((res) => {
              setNeedApproveERC20(false);
              setApproving(false);
              Notifaction({
                type: 'defSuccess',
                description: `Approve ${collection.label}`,
                content: (
                  <a className={style.view} target="_blank" href={`${getNetWorkPre(wallet.chainId)}/tx/${txhex}`}>
                    View on Explorer
                  </a>
                )
              });
            });
          });
        }
      });
      return;
    }
    setShowConfirm(true);
  };
  const toggleNft = (item: any) => {
    const index = cartdata.findIndex((_item: any) => _item.tokenId === item.tokenId);
    if (index > -1) {
      const _cartData = JSON.parse(JSON.stringify(cartdata));
      _cartData.splice(index, 1);
      setCartData(_cartData);
    } else {
      setCartData(cartdata.concat([item]));
    }
  };
  useEffect(() => {
    validateDelta();
  }, [step2.delta]);
  const validateDelta = () => {
    if (step2.curve === 'Linear Curve' && Number(step2.delta) > Number(step1.price)) {
      setShowDeltaWarning('Delta must be smaller than the Starting Price.');
    } else if (Number(step2.delta) <= 0) {
      setShowDeltaWarning('Delta must be greater than 0.');
    } else {
      setShowDeltaWarning('');
    }
  };
  return (
    <div className={style.form} onScroll={getMoreNfts} id="form">
      <Close className={style.closeIcon} onClick={() => setShowConfirmClose(true)} fill="#fff" />
      <div className={style.steps}>
        <span onMouseEnter={() => setHoverStep(1)} onMouseLeave={() => setHoverStep(0)}>
          {step > 1 && hoverStep !== 1 ? (
            <Stepsfinished style={{ cursor: 'pointer' }} />
          ) : step === 1 || hoverStep == 1 ? (
            <Stepstitlen1hoveractive onClick={() => setStep(1)} style={{ cursor: 'pointer' }} />
          ) : (
            <Stepstitlen1default />
          )}
        </span>
        <div className={`${style.line} ${step > 1 && style.active}`}></div>
        <span
          onMouseEnter={() => {
            step > 2 && setHoverStep(2);
          }}
          onMouseLeave={() => setHoverStep(0)}
        >
          {step > 2 && hoverStep !== 2 ? (
            <Stepsfinished style={{ cursor: 'pointer' }} />
          ) : step === 2 || hoverStep == 2 ? (
            <Stepstitlen2hoveractive onClick={() => setStep(2)} style={{ cursor: 'pointer' }} />
          ) : (
            <Stepstitlen2default />
          )}
        </span>

        <div className={`${style.line} ${step > 2 && style.active}`}></div>
        <span onMouseEnter={() => setHoverStep(3)} onMouseLeave={() => setHoverStep(0)}>
          {step > 3 ? <Stepsfinished /> : step === 3 ? <Stepstitlen3hoveractive /> : <Stepstitlen3default />}
        </span>
      </div>
      <div className={style.creatbody}>
        <div className={`${style.step12} ${step !== 1 && style.hidden}`}>
          <h3>Set Starting Price</h3>
          <p>All NFTs in your pool will share the same price at the starting point.</p>
          <Input
            change={(value: string) => setStep1({ ...step1, price: value })}
            value={step1.price}
            desc={`${token.label}/NFT`}
            style={{ marginTop: '16px' }}
          />
          {aiPrice && aiPrice !== step1.price && (
            <div style={{ marginTop: '16px' }}>
              <Warning
                text={`${aiPrice} ${token.label} is the best starting price for this collection. Self-adjustment will reduce the accuracy of AI price evaluation.`}
              />
            </div>
          )}
          <h3 style={{ marginTop: '48px' }}>Set Swap Fee</h3>
          <div className={`${style.btns} ${style.btnstep1}`}>
            <button
              className={`${step1.fee === '0.5%' && style.swapactive}`}
              onClick={() => setStep1({ ...step1, fee: '0.5%' })}
            >
              0.5%
            </button>
            <button
              className={`${step1.fee === '1.0%' && style.swapactive}`}
              onClick={() => setStep1({ ...step1, fee: '1.0%' })}
            >
              1.0%
            </button>
            <button
              className={`${step1.fee === '1.5%' && style.swapactive}`}
              onClick={() => setStep1({ ...step1, fee: '1.5%' })}
            >
              1.5%
            </button>
          </div>
          <Input
            change={(value: string) => setStep1({ ...step1, fee: value })}
            value={step1.fee.replace('%', '')}
            desc="%"
            style={{ marginTop: '16px' }}
          />
          <p>
            <span>0.5% </span> is best for most pools with established NFTs and tokens. Go higher for more exotic NFTs
            or tokens.
          </p>
          <button onClick={submit} className={`${style.submit} button`}>
            {getBtnText()}
          </button>
        </div>

        <div className={`${style.step12} ${step !== 2 && style.hidden}`}>
          <h3>Bonding Curve</h3>
          <p>Bonding Curve controls how fast the price of your pools will change.</p>
          <div className={`${style.btns} ${style.btnstep2}`}>
            <button
              className={`${step2.curve === 'Linear Curve' && style.btnactive}`}
              onClick={() => setStep2({ ...step2, curve: 'Linear Curve' })}
            >
              Linear Curve
            </button>
            <button
              className={`${step2.curve === 'Exponential Curve' && style.btnactive}`}
              onClick={() => setStep2({ ...step2, curve: 'Exponential Curve' })}
            >
              Exponential Curve
            </button>
          </div>
          <h3 style={{ marginTop: '48px' }}>Delta</h3>
          <p>
            Delta is a parameter for your bonding curve. Lower delta means smaller price change of NFTs in the pool
            after each buying or selling.
          </p>
          <Input
            change={(value: string) => {
              setStep2({ ...step2, delta: value });
            }}
            value={step2.delta}
            desc={step2.curve === 'Linear Curve' ? token.label : '%'}
            style={{ marginTop: '16px' }}
            blur={() => setStep2({ ...step2, delta: Math.abs(Number(step2.delta)) })}
          />
          {showDeltaWarning && (
            <div style={{ marginTop: '16px' }}>
              <Warning text="Delta must be smaller than the Starting Price." />
            </div>
          )}
          <p>
            Each time your pool buys/sells an NFT, your buy price will adjust down/up by{' '}
            <span>
              {step2.delta} {step2.curve === 'Linear Curve' ? token.label : '%'}
            </span>
          </p>
          <button onClick={submit} className={`${style.submit} button`}>
            {getBtnText()}
          </button>
        </div>

        <div className={`${style.step3} ${step !== 3 && style.hidden}`}>
          <div className={Card.createbody}>
            <div className={Card.card} style={{ marginTop: '16px' }}>
              <h4>Deposit NFT</h4>
              <div className={style.collectionname}>
                <div>
                  {collection.icon}
                  <p>{collection.label}</p>
                </div>
                <span onClick={() => setCartData([])}>Clear</span>
              </div>
              <div className={style.total}>
                <input type="text" readOnly value={step3.nfts} onChange={changNtfNum} />
                <div>
                  <span>ALL: {nfts.length}</span>
                  <button onClick={() => setCartData(nfts)}>Select all</button>
                </div>
              </div>
              <div className={Card.join}>
                <Add />
              </div>
            </div>
            <div className={Card.card} style={{ marginTop: '2px' }}>
              <h4>Deposit Token</h4>
              <p className={style.buytitle}>Buy up to</p>
              <Input
                change={(value: string) => setbuynfts(value)}
                value={buynfts}
                desc={'NFT'}
                style={{ marginTop: '16px', background: '#47494F' }}
                blur={() => setbuynfts(~~Number(buynfts))}
              />
              <p style={{ marginTop: '24px' }} className={style.buytitle}>
                You will deposit
              </p>
              {step2.curve === 'Linear Curve' && ~~(Number(step1.price) / Number(step2.delta)) < buynfts && (
                <p className={style.nftsTip}>
                  You can only buy up to {~~(Number(step1.price) / Number(step2.delta))} NFTs at the current price
                  curve. Either increase the <i onClick={() => setResetprice(true)}>Starting Price</i> or decrease the{' '}
                  <i onClick={() => setResetDelta(true)}>Delta</i> to allow for more buys.
                </p>
              )}

              <div className={style.tokenname}>
                <div>{token.icon}</div>
                <div>
                  <p>
                    {web3.utils.fromWei(step3.inputValue)} {token.label}
                  </p>
                  <span>$ {Number(web3.utils.fromWei(step3.inputValue || '')) * usd}</span>
                </div>
              </div>
            </div>
            <p className={style.range}>
              Price Range From <span>{step3.from}</span> {token.label} To <span>{step3.to}</span> {token.label}
            </p>
            {Number(web3.utils.fromWei(step3.inputValue)) > Number(web3.utils.fromWei(token.balance)) && (
              <div style={{ marginTop: '16px' }}>
                <Warning
                  text={
                    <>
                      Exceeds wallet balance. You can either decrease NFT buying amount or decrease{' '}
                      <span onClick={() => setResetprice(true)}>Starting Price.</span>{' '}
                    </>
                  }
                />
              </div>
            )}
            <button
              onClick={preview}
              className={`button ${style.step3btn} ${
                (step3.totalPrice > Number(web3.utils.fromWei(token.balance)) ||
                  !cartdata.length ||
                  !buynfts ||
                  (step2.curve === 'Linear Curve' && ~~(Number(step1.price) / Number(step2.delta)) < buynfts)) &&
                style.disable
              }`}
            >
              {getBtnText()}
            </button>
          </div>
          <div className={style.mynfts}>
            <h4>
              My Items
              <Tooltip
                placement="right"
                title="According to the AI evaluation, the higher the tier, the higher the price of NFT."
              >
                <Helphover data-tip="" data-for="test" fill="rgba(255, 255, 255, 0.4)" />
              </Tooltip>
            </h4>
            <ul className={style.list}>
              {nfts.map((item: any, index: number) => (
                <NftCard
                  size={size}
                  key={index}
                  aiPrice={aiPrice}
                  item={{ ...item, active: cartdata.some((_item: any) => item.tokenId === _item.tokenId) }}
                  toggleNft={toggleNft}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      {resetPrice && (
        <ResetPrice
          unit={token.label}
          close={() => setResetprice(false)}
          value={step1.price}
          aiPrice={aiPrice}
          change={(value: string) => setStep1({ ...step1, price: value })}
        />
      )}
      {resetDelta && (
        <ResetDelta
          close={() => setResetDelta(false)}
          value={step2.delta}
          change={(value: string) => setStep2({ ...step2, delta: value })}
          desc={step2.curve === 'Linear Curve' ? token.label : '%'}
        />
      )}
      {showConfirmCLose && (
        <Confirm
          cancel={() => setShowConfirmClose(false)}
          confirm={() => close()}
          desc="If you close this page, all data will be lost. Are you sure you want to close this page?"
        />
      )}
      {showConfirm && (
        <ConfirmCreate
          confirm={addLiquidity}
          data={{ ...step1, ...step2, ...step3 }}
          collection={collection}
          sells={cartdata}
          close={() => setShowConfirm(false)}
          token={token}
        />
      )}
      {showConfirmAddTip && (
        <Tip
          close={setShowConfirmAddTip}
          type="load"
          title="Waiting For Confirmation"
          tip={
            <>
              Adding {collection.label}-{token.label} Liquidity
            </>
          }
          desc="Confirm this transaction in you wallet"
          showbtn={false}
        />
      )}
      {showConfirmRejectedTip && (
        <Tip
          close={setShowConfirmRejectedTip}
          type="danger"
          title="Transaction Rejected"
          text="Dismiss"
          showbtn={true}
          btnClick={() => setShowConfirmRejectedTip(false)}
        />
      )}
      {showConfirmSuccessTip && (
        <Tip
          close={setShowConfirmSuccessTip}
          type="success"
          tip={
            <a target="_blank" href={`${getNetWorkPre(wallet.chainId)}/tx/${txhash}`}>
              {'View on Explorer'}
            </a>
          }
          title="Transaction Submitted"
          showbtn={true}
          closeIcon={false}
          text="Close"
          btnClick={() => Router.push('/earn')}
        />
      )}
    </div>
  );
};
