import style from '../ConfirmCreate/index.module.scss';
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
          <img
            src={item.smallPreviewImageUrl || item.image_preview_url || item?.metadata?.image || item.image}
            alt=""
          />
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
          <p>Withdraw Liquidity</p>
          <Close className={style.closeIcon} onClick={() => close(false)} fill="#fff" />
        </h2>
        <div className={style.trans}>
          {collection.icon}
          <div className={style.tokenicon}>{token.icon}</div>
          <p>
            {collection.name}-{token.name}
          </p>
        </div>
        <ul className={style.info}>
          <li>
            <p>Pooled {token.name}</p>
            <span>{data.widthdrawTokens}</span>
          </li>
          <li>
            <p>Pooled {collection.name}</p>
            <span>{sells.length}</span>
          </li>
        </ul>
        {sells.length <= 9 && Cnfts}
        <button onClick={submit}>Withdraw</button>
      </div>
    </div>
  );
};

export default ConfirmSwap;
