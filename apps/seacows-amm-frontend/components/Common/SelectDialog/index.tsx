import Style from './index.module.scss';
import { Downhover, Close } from '@components/index';
import { useState } from 'react';
import Search from '@components/Search';
import { useEffect } from 'react';
import { isAddress } from '@utils/index';
export const SelectDialog = (props: any) => {
  const { DefIcon, placeholder, style, list = [], success, value, disable, search } = props;
  const [show, setShow] = useState(false);
  const [thisList, setThisList] = useState<any>(list);
  const [index, setIndex] = useState<any>(null);
  const [searchkeyword, setSearchKeyWord] = useState('');
  const filter = async (key: string) => {
    setSearchKeyWord(key);
    const _list = list.filter(
      (item: any) => !key || item.label.toLowerCase().indexOf(key) > -1 || item.tokenAddress === key
    );
    console.log(isAddress(key));
    if (!_list.length && isAddress(key)) {
      search ? setThisList(await search(key)) : setThisList(_list);
    } else {
      setThisList(_list);
    }
  };
  useEffect(() => {
    setThisList(list);
  }, []);
  useEffect(() => {
    const index = list.findIndex((item: any) => item.label === value || item.token_address == value);
    if (index > -1) {
      setIndex(index);
    }
  }, [value]);
  useEffect(() => {
    setThisList(list);
  }, [list]);
  const select = (item: any) => {
    setShow(false);
    success && success(item);
  };

  return (
    <div>
      <div
        className={`${Style.SelectDialog} ${disable && Style.disable}`}
        style={style}
        onClick={() => !disable && setShow(true)}
      >
        {typeof index === 'number' ? list[index]?.icon : <DefIcon />}
        <p className={`${!value && Style.placeholder}`}>
          {(value && list.find((item: any) => item.label === value || item.token_address == value)?.label) ||
            placeholder}
        </p>
        <Downhover className={Style.icon} fill="#fff" />
      </div>

      {show && (
        <div className={Style.layout}>
          <div className={Style.content}>
            <h3>
              <p>{placeholder}</p>
              <Close className={Style.icon} fill="#fff" onClick={() => setShow(false)} />
            </h3>
            <div className={Style.searchbox}>
              <Search placeholder="Search name or paste address" change={filter} />
            </div>
            <ul className={Style.list}>
              {!thisList.length && searchkeyword && <li className={Style.active}>Not Found</li>}
              {thisList.map((item: any, index: number) => (
                <li
                  key={index}
                  className={`${value && (item.label === value || item.token_address === value) && Style.active}`}
                  onClick={() => select(item)}
                >
                  {item.icon}
                  <div>
                    <p>{item.label}</p>
                    {item.desc && <span>{item.desc}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
