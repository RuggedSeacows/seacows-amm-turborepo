import style from '../ConfirmSwap/index.module.scss';
import { Close } from '@components/index';
import { useEffect, useState } from 'react';
import { Tokenheadplaceholder } from '@components/index';
import { nets, Net } from '@lib/net';
import { web3, swapNFTsForToken } from '@utils/contract';
import { getDetails } from '@utils/contract/ai';
import { addHistory } from '@utils/wallet';
interface Props {
  sells: any;
  close: Function;
  onsubmit: Function;
  wallet: any;
}
const ConfirmSwap = (props: Props) => {
  const { sells, close, onsubmit, wallet } = props;
  const [step, setSetp] = useState(0);
  useEffect(() => {
    console.log(sells);
  }, []);
  const Cnfts = (
    <div className={style.nfts}>
      {sells[step]?.items.map((item: any, index: number) => (
        <div key={index} className={style.nft}>
          <img src={item.smallPreviewImageUrl || '/img/nonft.png'} alt="" />
          <div>
            <span>ID #{item.tokenId}</span>
            <p>
              {item.tokenMetaData.token_address ? (
                <Tokenheadplaceholder style={{ fontSize: '12px' }} />
              ) : (
                nets.find((item: Net) => item.chainId === wallet.chainId)?.icon
              )}
              &nbsp;
              <strong>{Number(web3.utils.fromWei(item?.price?.inputAmount)).toFixed(4)}</strong>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
  const submit = async () => {
    if (step !== sells.length - 1) {
      setSetp(step + 1);
    } else {
      onsubmit();
    }
  };
  const currentTotal = () => {
    return sells.length > 1 && sells.length - 1 === step
      ? sells
          .reduce(
            (total: number, item: any) =>
              item.items.reduce(
                (_total: number, _item: any) => Number(web3.utils.fromWei(_item?.price?.inputAmount)) + _total,
                0
              ) + total,
            0
          )
          .toFixed(4)
      : sells[step]?.items
          .reduce(
            (total: number, currentValue: any) => Number(web3.utils.fromWei(currentValue?.price?.inputAmount)) + total,
            0
          )
          .toFixed(4);
  };
  return (
    <div className={style.layout}>
      <div className={style.content}>
        <h2>
          <p>Confirm Swap</p>
          <Close className={style.closeIcon} onClick={() => close(false)} fill="#fff" />
        </h2>
        <div className={style.trans}>
          {/* <img src={ sells[step]?.items[0]?.image }  alt="" /> */}
          <div className={style.tokenicon}>
            {/* { sells[step]?.tokenMetaData?.icon || <Tokenheadplaceholder style={{ fontSize: '14px' }} /> } */}
          </div>
          {/* <p>{ sells[step]?.name }-{ sells[step]?.tokenMetaData?.name }</p> */}
        </div>
        <ul className={style.info}>
          <li>
            <p>Expected Received CryptoPunks: </p>{' '}
            <span>
              {step === sells.length - 1
                ? sells.reduce((total: number, currentValue: any) => currentValue?.items?.length + total, 0)
                : sells[step]?.items.length}
            </span>
          </li>
          {sells.length > 1 && (
            <li>
              <p>Pay:</p>{' '}
              <span>
                {sells[step].items.reduce(
                  (total: number, currentValue: any) =>
                    Number(web3.utils.fromWei(currentValue?.price?.inputAmount)) + total,
                  0
                )}{' '}
                {sells[step].tokenMetaData?.name}
              </span>
            </li>
          )}
        </ul>
        {sells.length === 1 && Cnfts}
        {sells.length === 1 && (
          <ul className={style.info}>
            <li>
              <p>Pay:</p>{' '}
              <span>
                {currentTotal()} {sells[step].tokenMetaData?.name}
              </span>
            </li>
          </ul>
        )}
        {sells.length > 1 && Cnfts}
        {sells.length > 1 && sells.length - 1 === step && (
          <div className={style.total}>
            <p>Total Pay:</p>
            <div>
              {sells.map((item: any, index: number) => (
                <div key={index}>
                  <span>
                    {item.items.reduce(
                      (total: number, currentValue: any) =>
                        Number(web3.utils.fromWei(currentValue?.price?.inputAmount)) + total,
                      0
                    )}{' '}
                    {item.tokenMetaData?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={submit}>{sells.length - 1 === step ? 'Confirm Swap' : 'Continue'} </button>
      </div>
    </div>
  );
};

export default ConfirmSwap;
