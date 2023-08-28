import style from './index.module.scss';
import { Downhover, Verify } from '../index';
import { useState, useEffect } from 'react';
interface Props {
  list: Array<any>;
  call: Function;
  labelKey?: string;
  def?: string;
}
const SelectNet = (props: Props) => {
  const { list, call, labelKey: string = '', def = '' } = props;
  const [current, setItem] = useState(def);
  const [show, setShow] = useState(false);
  let time: any = 0;
  const showList = () => {
    clearTimeout(time);
    setShow(true);
  };
  const hiddenList = () => {
    time = setTimeout(() => {
      setShow(false);
    }, 300);
  };
  const switecItem = async (text: string) => {
    setItem(text);
    call(text);
  };
  const List = (
    <ul className={style.list}>
      {list.map((item: any, index: number) => (
        <li
          key={index}
          onClick={() => {
            switecItem(item);
            setShow(false);
          }}
          className={`${current === item && style.liactive}`}
        >
          <p>{item}</p>
          {current === item && <Verify className={style.icon} fill="#fff" />}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`${style.net}`} onMouseEnter={showList} onMouseLeave={hiddenList}>
      <p>{current}</p>
      <Downhover className={style.iconhover} fill="#fff" />
      {show && List}
    </div>
  );
};

export default SelectNet;
