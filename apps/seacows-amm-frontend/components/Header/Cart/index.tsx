import style from './index.module.scss';
import { Switch } from '@components/index';
import { useRouter } from 'next/router';

const Cart = (props: any) => {
  const router = useRouter();
  const { pathname } = router;
  const { collection } = router.query;
  const { data, cart } = props;
  const num = data[collection as any]?.reduce((total: number, item: any) => total + item.items.length, 0);
  return (
    <>
      {pathname === '/explore/collection' ? (
        <div className={style.cart} onClick={cart.toggleShow}>
          <Switch className={style.switch} />
          {!!data[collection as any]?.length && <i>{num}</i>}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Cart;
