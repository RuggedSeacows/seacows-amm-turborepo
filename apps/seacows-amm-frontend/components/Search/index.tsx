import style from './index.module.scss';
import { Search } from '@components/index';

interface Props {
  placeholder?: string;
  change?: Function;
}
const SearchCom = (props: Props) => {
  const { placeholder, change } = props;
  const changeValue = (e: any) => {
    change && change(e.target.value);
  };
  return (
    <div className={style.searchbox}>
      <Search className={style.icon} fill="rgba(255, 255, 255, 0.6)" />
      <input placeholder={placeholder} onChange={changeValue} type="text" />
    </div>
  );
};

export default SearchCom;
