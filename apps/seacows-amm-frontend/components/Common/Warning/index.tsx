import style from './inde.module.scss';
import { Warninghover } from '@components/index';

const colors: any = {
  warning: '#F6B672'
};
interface Warning {
  text: string | any;
  Icon?: any;
  type?: string;
}
export default (props: Warning) => {
  const { Icon = Warninghover, text, type = 'warning' } = props;
  return (
    <div className={`${style.info} ${style[type]}`}>
      <Icon fill={colors[type]} />
      <p>{text}</p>
    </div>
  );
};
