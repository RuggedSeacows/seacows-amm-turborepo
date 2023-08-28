import style from './index.module.scss';
import { EthLogo, Cardcirclehover, Cardcircleaction, Tokenheadplaceholder } from '@components/index';
import { getGroupId, web3, getGroupPrice } from '@utils/contract/ai';
import { useEffect, useState } from 'react';

const imgs: any = {
  '0': <img src="/img/tier5.png" className={style.tag} alt="" />,
  '1': <img src="/img/tier4.png" className={style.tag} alt="" />,
  '2': <img src="/img/tier3.png" className={style.tag} alt="" />,
  '3': <img src="/img/tier2.png" className={style.tag} alt="" />,
  '4': <img src="/img/tier1.png" className={style.tag} alt="" />
};
const NftCard = (props: any) => {
  const { toggleNft, item, size = 120, aiPrice, priceKey = 'newSpotPrice' } = props;
  const [img, setImg] = useState<any>(null);
  useEffect(() => {
    if (aiPrice) {
      setImg(imgs[getGroupId(item.tokenAddress._value, item.token_id || item.tokenId) as any]);
    }
  }, [aiPrice]);
  return (
    <li
      style={{ width: `${size}px` }}
      className={`${item.active ? style.liactive : ''} ${style.li}`}
      onClick={() => {
        toggleNft(item);
      }}
    >
      {img}
      <Cardcirclehover className={`${style.cardHover} hoverdef`} fill="rgba(255, 255, 255, 0.2);" />
      <Cardcircleaction className={`${style.cardHover} hoverearn`} />
      <img
        src={
          item.image_preview_url || item.smallPreviewImageUrl || item.image || item?.metadata?.image || '/img/nonft.png'
        }
        style={{ width: `${size}px`, height: `${size}px` }}
        alt=""
      />
      <p>#{item.token_id || item.tokenId}</p>
      {item.price && (
        <div key={item?.price?.newSpotPrice}>
          {item.tokenMetaData.icon || <Tokenheadplaceholder style={{ fontSize: '14px' }} />}
          &nbsp;&nbsp;
          <span>{item?.price[priceKey] && Number(web3.utils.fromWei(item?.price[priceKey])).toFixed(4)}</span>
        </div>
      )}
    </li>
  );
};

export default NftCard;
