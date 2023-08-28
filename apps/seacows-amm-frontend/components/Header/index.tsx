import style from './index.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import SelectNet from './SelectNet';
import Wallet from './Wallet';
import Cart from './Cart';
import Receive from './Receive';
import React from 'react';
import { inject, observer } from 'mobx-react';
@inject('globalStore')
@observer
class Header extends React.Component {
  render(): React.ReactNode {
    const { globalStore, cart, data } = this.props as any;

    return (
      <header className={style.header}>
        <Link href={'/'}>
          <span>
            <Image src="/img/logo.png" alt="seacows" width={121} height={32} />
          </span>
        </Link>
        <div className={style.tools}>
          <Link href={'/requesttestnetnft'}>
            <div className={style.testnet}>
              Request Testnet NFT <i>Free</i>
            </div>
          </Link>
          <SelectNet {...this.props} wallet={globalStore.walletData} />
          <Wallet {...this.props} wallet={globalStore.walletData} />
          <Receive />
          <Cart data={cart.collection} globalStore={globalStore} cart={cart} />
        </div>
      </header>
    );
  }
}

export default Header;
