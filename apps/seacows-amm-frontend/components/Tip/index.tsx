import style from './index.module.scss';
import { Close, Succeed, Danger, Loadwhite } from '@components/index';

interface Props {
  close: Function;
  type?: string;
  title?: string;
  tip?: any;
  desc?: string;
  showbtn?: boolean;
  text?: string;
  btnClick?: Function;
  closeIcon?: boolean;
}
const Cicon: any = {
  load: <Loadwhite className={`${style.icon} ${style.loading}`} stroke="#01ECFA" />,
  success: <Succeed className={style.icon} />,
  danger: <Danger className={style.icon} />
};
const Tip = (props: Props) => {
  const { close, type = 'load', title, tip, desc, showbtn, text, btnClick, closeIcon = true } = props;

  return (
    <div className={style.tip}>
      <div className={style.content}>
        <div className={style.icobnbox}>
          <p>{type === 'danger' && 'Error'}</p>
          {closeIcon && <Close className={style.closeIcon} onClick={() => close(false)} fill="#fff" />}
        </div>
        <div className={style.type}>{Cicon[type]}</div>
        <p className={`${style.title} ${type === 'danger' && style.danger}`}>{title}</p>
        {!!tip && <p className={style.tips}>{tip} </p>}
        {desc && <div className={style.desc}>{desc}</div>}
        {showbtn && (
          <button className={style.btn} onClick={() => btnClick && btnClick()}>
            {text}
          </button>
        )}
      </div>
    </div>
  );
};

export default Tip;
