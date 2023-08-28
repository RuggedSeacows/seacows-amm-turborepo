import style from './index.module.scss';
import { Close } from '@components/index';
import Input from '@src/components/Common/Input';
import Warning from '@src/components/Common/Warning';
import { useState } from 'react';
import { web3 } from '@utils/contract/index';

export default (props: any) => {
  const { change, value, aiPrice, close, unit } = props;
  const [price, setPrice] = useState(value);
  const confirm = () => {
    change(price);
    close();
  };
  return (
    <div className={style.layout}>
      <div className={style.content}>
        <h2>
          <p>Set Starting Price</p>
          <Close className={style.closeIcon} onClick={() => close()} fill="#fff" />
        </h2>
        <p>All NFTs in your pool will share the same price at the starting point.</p>
        <Input
          change={(value: string) => setPrice(value)}
          value={price}
          desc={`${unit}/NFT`}
          style={{ marginTop: '16px', borderColor: '#8F909A' }}
        />
        {aiPrice && aiPrice != price && (
          <div style={{ marginTop: '16px' }}>
            <Warning
              text={`${web3.utils.fromWei(
                aiPrice
              )} ${unit} is the best starting price for this collection. Self-adjustment will reduce the accuracy of AI price evaluation.`}
            />
          </div>
        )}
        <button onClick={confirm}>Reset</button>
      </div>
    </div>
  );
};
