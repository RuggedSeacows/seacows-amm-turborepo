import style from './index.module.scss';
import { Close } from '@components/index';
import { useState } from 'react';
import { Tokenheadplaceholder } from '@components/index';
import { web3, swapNFTsForToken } from '@utils/contract';
import { getDetails } from '@utils/contract/ai';
import { addHistory } from '@utils/wallet';
interface Props {
  sells: any;
  close: Function;
  token: string;
  wallet: any;
  onsubmit: Function;
}
const ConfirmSwap = (props: Props) => {
  const { sells, close, token, wallet, onsubmit } = props;
  const [step, setSetp] = useState(0);

  const Cnfts = (
    <div className={style.nfts}>
      {sells[step]?.items.map((item: any, index: number) => (
        <div key={index} className={style.nft}>
          <img src={item.image || item?.metadata?.image || '/img/nonft.png'} alt="" />
          <div>
            <span>ID #{item.tokenId}</span>
            <p>
              {item?.tokenMetaData?.icon || <Tokenheadplaceholder style={{ fontSize: '14px' }} />}&nbsp;&nbsp;
              <strong>{Number(web3.utils.fromWei(item?.price?.newSpotPrice)).toFixed(4)}</strong>
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
                (_total: number, _item: any) => Number(web3.utils.fromWei(_item?.price?.newSpotPrice)) + _total,
                0
              ) + total,
            0
          )
          .toFixed(4)
      : sells[step]?.items
          .reduce(
            (total: number, currentValue: any) => Number(web3.utils.fromWei(currentValue?.price?.newSpotPrice)) + total,
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
          <img src={sells[step]?.items[0]?.image} alt="" />
          <div className={style.tokenicon}>
            {sells[step]?.tokenMetaData?.icon || <Tokenheadplaceholder style={{ fontSize: '14px' }} />}
          </div>
          <p>
            {sells[step]?.name}-{sells[step]?.tokenMetaData?.name}
          </p>
        </div>
        <ul className={style.info}>
          <li>
            <p>{step === sells.length - 1 ? 'Bored Ape Yacht Club:' : 'CryptoPunks:'} </p>{' '}
            <span>
              {step === sells.length - 1
                ? sells.reduce((total: number, currentValue: any) => currentValue?.items?.length + total, 0)
                : sells[step]?.items.length}
            </span>
          </li>
          {sells.length > 1 && (
            <li>
              <p>Expected Received:</p>{' '}
              <span>
                {currentTotal()} {sells[step].tokenMetaData?.name}
              </span>
            </li>
          )}
        </ul>
        {sells.length === 1 && Cnfts}
        {sells.length === 1 && (
          <ul className={style.info}>
            <li>
              <p>Expected Received:</p> <span>{currentTotal()} ETH</span>
            </li>
            {/* <li><p>price impact:</p> <span>14%</span></li> */}
          </ul>
        )}
        {sells.length > 1 && Cnfts}
        {sells.length > 1 && sells.length - 1 === step && (
          <div className={style.total}>
            {' '}
            <p>Total Expected Received:</p> <span>{currentTotal()} ETH</span>
          </div>
        )}
        <button onClick={submit}>{sells.length - 1 === step ? 'Confirm Swap' : 'Continue'} </button>
      </div>
    </div>
  );
};

export default ConfirmSwap;
