import style from './index.module.scss';
import { Close } from '@components/index';
import { tranceAddress, getNetWorkPreLink } from '@utils/index';
import { useEffect, useState } from 'react';
import { getGroupPrice, web3 } from '@utils/contract/ai';
export default (props: any) => {
  const { data, close, chain, update, tokenAddress } = props;
  const [currentPool, setCurrentPool] = useState(data?.currentPool);
  const [floorPrice, setFloorPrice] = useState('');
  const setPool = (poolId: string) => {
    // data.currentPool = poolId
    setCurrentPool(poolId);
  };
  const submit = () => {
    update(data?.currentPool, currentPool);
    close();
  };
  // useEffect(() => {
  //   getGroupPrice(tokenAddress, chain).then(res => {
  //     setFloorPrice(Number(web3.utils.fromWei(res)).toFixed(4))
  //   })
  // }, [])
  return (
    <div className={style.layout}>
      <div className={style.content}>
        <h3>
          Select a Pool <Close onClick={close} className={style.close} />
        </h3>
        <ul>
          <li>
            <div style={{ width: '10%' }}>Pool</div>
            <div style={{ width: '20%' }}>Current Floor Price</div>
            <div style={{ width: '15%' }}>Number</div>
            <div style={{ width: '15%' }}>Pool value</div>
            <div style={{ width: '15%' }}>Volume(24h)</div>
            <div style={{ width: '25%' }}>Address</div>
          </li>
          {data?.pools.map((item: any, index: number) => (
            <li
              key={index}
              className={`${style.li} ${currentPool === item.id && style.active}`}
              onClick={() => setPool(item.id)}
            >
              <div style={{ width: '10%' }}>
                <div className={`${style.select} ${currentPool === item.id && style.selectActive}`}></div>
              </div>
              <div style={{ width: '20%' }}> - </div>
              <div style={{ width: '15%' }}> - </div>
              <div style={{ width: '15%' }}> - </div>
              <div style={{ width: '15%' }}> - </div>
              <div style={{ width: '25%' }} className={style.address}>
                <a target={'blank'} href={`${getNetWorkPreLink(chain)}${item.id}`}>
                  {tranceAddress(item.id)}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={submit} className={`button ${style.confirm}`}>
          Confirm
        </button>
      </div>
    </div>
  );
};
