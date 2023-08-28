import style from './index.module.scss';
import { Close, EthLogo } from '@components/index';
import Search from '@components/Search';
import { useState } from 'react';
import { tokens, Token } from '@lib/index';
interface Props {
  close: Function;
  change?: Function;
  token: string;
}
const SelectToken = (props: Props) => {
  const { close, change, token } = props;
  const [current, setCurrent] = useState(token || '');
  const [tokenList, setTokenList] = useState<Array<Token>>(tokens);
  const filterToken = (val: string) => {
    setTokenList(
      tokens.filter(
        (item: Token) => !val || item.text.indexOf(val.toLowerCase()) > -1 || item.text.indexOf(val.toUpperCase()) > -1
      )
    );
  };
  return (
    <div className={style.layout}>
      <div className={style.content}>
        <h2>
          <p>Select a Token</p>
          <Close className={style.closeIcon} onClick={() => close(false)} fill="#fff" />
        </h2>
        <div className={style.searchbox}>
          <Search placeholder="Search name or paste address" change={filterToken} />
        </div>
        <ul className={style.slist}>
          {tokens
            .filter((item: Token, index: number) => index < 3)
            .map((item: Token, index: number) => (
              <li
                key={index}
                className={`${current === item.text && style.active}`}
                onClick={() => {
                  setCurrent(item.text);
                  change && change(item.text);
                  close(false);
                }}
              >
                {item.icon}
                <p>{item.text}</p>
              </li>
            ))}
        </ul>
        <ul className={style.listall}>
          {!tokenList.length && <p className={style.empty}>empty</p>}
          {tokenList.map((item: Token, index: number) => (
            <li
              key={index}
              onClick={() => {
                setCurrent(item.text);
                change && change(item.text);
                close(false);
              }}
            >
              {item.icon}
              <div>
                <p>{item.text}</p>
                <span>{item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectToken;
