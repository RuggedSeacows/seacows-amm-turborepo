import style from './index.module.scss';
import { Close, EthLogo } from '@components/index';
import { useState } from 'react';

interface Props {
  sells: any;
  close: Function;
  token: any;
  collection: any;
  data: any;
  confirm?: Function;
}
const ConfirmSwap = (props: Props) => {
  const { sells, close, token, collection, data, confirm } = props;

  const Cnfts = (
    <div className={style.nfts}>
      {sells.map((item: any, index: number) => (
        <div key={index} className={style.nft}>
          <img src={item.smallPreviewImageUrl || item?.metadata?.image || item.image} alt="" />
          <div>
            <span>ID #{item.token_id || item.tokenId}</span>
            <p>
              <EthLogo className={style.icon} />
              {data.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
  const submit = () => {
    confirm && confirm();
  };
  return (
    <div className={style.layout}>
      <div className={style.content}>
        <h2>
          <p>Add Liquidity</p>
          <Close className={style.closeIcon} onClick={() => close(false)} fill="#fff" />
        </h2>
        <div className={style.trans}>
          {collection.icon}
          <div className={style.tokenicon}>{token.icon}</div>
          <p>
            {collection.label}-{token.label}
          </p>
        </div>
        <ul className={style.info}>
          <li>
            <p>{token.label}</p>
            <span>{data.totalPrice}</span>
          </li>
          <li>
            <p>{collection.label}</p>
            <span>{sells.length}</span>
          </li>
        </ul>
        {sells.length <= 9 && Cnfts}
        <ul className={style.info}>
          <li>
            <p>Starting Price</p>{' '}
            <span>
              {data.price} {token.label}
            </span>
          </li>
          <li>
            <p>Swap Fee</p> <span>{data.fee}</span>
          </li>
          <li>
            <p>Bonding Curve</p> <span>{data.curve}</span>
          </li>
          <li>
            <p>Delta</p>{' '}
            <span>
              {data.delta} {data.curve === 'Linear Curve' ? 'ETH' : '%'}
            </span>
          </li>
          <li>
            <p>Price Range</p>{' '}
            <span>
              From {data.from} {token.label} To {data.to} {token.label}
            </span>
          </li>
        </ul>
        <button onClick={submit}>Add Liquidity</button>
      </div>
    </div>
  );
};

export default ConfirmSwap;
