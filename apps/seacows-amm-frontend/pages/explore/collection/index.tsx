import styleLayout from '../../dashboard/index.module.scss';
import Header from '@components/Header';
import Menu from '@components/Menu';
import Explore from '@src/components/Explore';
import CollectionList from '@src/components/Explore/CollectionList';
import React from 'react';
import { inject, observer } from 'mobx-react';
@inject('globalStore')
@inject('cart')
@observer
class Dashboard extends React.Component {
  render(): React.ReactNode {
    const { globalStore, cart } = this.props as any;
    console.log('Dashboard', { cart, data: cart.data });
    return (
      <div className={styleLayout.layer}>
        <Header {...this.props} />
        <div className={styleLayout.content}>
          <Menu active={1} />
          <div className={styleLayout.main}>
            <Explore
              show={cart.show}
              List={CollectionList}
              cart={cart}
              data={cart.data}
              globalStore={globalStore}
              wallet={globalStore.walletData}
              login={globalStore.connect}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
