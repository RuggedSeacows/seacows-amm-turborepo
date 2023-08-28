import style from './index.module.scss';
import { EthLogo } from '../index';
const EthIcon = () => {
  return (
    <div className={style.ethicon}>
      <EthLogo className={style.icon} />
    </div>
  );
};

export default EthIcon;
