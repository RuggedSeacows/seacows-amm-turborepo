import style from '../ResetPrice/index.module.scss';
import { Close } from '@components/index';
import Input from '@src/components/Common/Input';
import Warning from '@src/components/Common/Warning';
import { useState } from 'react';

export default (props: any) => {
  const { change, value, desc, close } = props;
  const [price, setPrice] = useState(value);
  const confirm = () => {
    change(price);
    close();
  };
  return (
    <div className={style.layout}>
      <div className={style.content}>
        <h2>
          <p>Delta</p>
          <Close className={style.closeIcon} onClick={() => close()} fill="#fff" />
        </h2>
        <p>
          Delta is a parameter for your bonding curve. Lower delta means smaller price change of NFTs in the pool after
          each buying or selling.
        </p>
        <Input
          change={(value: string) => setPrice(value)}
          value={price}
          desc={desc}
          style={{ marginTop: '16px', borderColor: '#8F909A' }}
        />
        <button onClick={confirm}>Reset</button>
      </div>
    </div>
  );
};
