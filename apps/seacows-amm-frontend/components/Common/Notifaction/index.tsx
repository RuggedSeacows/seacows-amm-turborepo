import style from './index.module.scss';
import { notification } from 'antd';
import { ReactNode } from 'react';
import { Warninghover, TickCircle, Info, Error } from '@components/index';
interface Props {
  message?: string;
  description?: string;
  duration?: number;
  call?: Function;
  content?: ReactNode | string;
  type: string;
}
interface Icons {
  [key: string]: ReactNode;
}
const icons: Icons = {
  error: <Error className={style.icon} />,
  info: <Info className={style.icon} />,
  success: <TickCircle className={style.icon} fill="#78CE7B" />,
  defSuccess: <TickCircle className={style.icon} />,
  defwarning: <Error className={style.icon} />
};
export default (props: Props) => {
  const { message, description, duration = 5, call, content, type } = props;
  notification.open({
    message,
    className: `${style.mynot} ${style[type]}`,
    duration,
    top: 100,
    description: (
      <div className={`${style.description} ${style[type]}`}>
        {icons[type]}
        <div className={style.content}>
          <p>{description}</p>
          {content}
        </div>
      </div>
    ),
    onClick: () => {
      call && call();
    }
  });
};
