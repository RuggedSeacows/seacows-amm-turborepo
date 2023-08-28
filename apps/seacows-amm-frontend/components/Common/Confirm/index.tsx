import style from './index.module.scss';
import { Close } from '@components/index';
interface Confirm {
  desc: string;
  confirm: Function;
  cancel: Function;
  title?: string;
}
export default (props: Confirm) => {
  const { desc, confirm, cancel, title = 'confirm' } = props;
  return (
    <div className={style.layout}>
      <div className={style.content}>
        <h5>
          <p> {title}</p>
          <Close className={style.closeIcon} onClick={() => cancel && cancel()} fill="#fff" />
        </h5>
        <p>{desc}</p>
        <div className={style.btns}>
          <button onClick={() => confirm && confirm()}>Yes, close</button>
          <button onClick={() => cancel && cancel()}>No, keep</button>
        </div>
      </div>
    </div>
  );
};
