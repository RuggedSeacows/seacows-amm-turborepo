import style from './index.module.scss';
import React from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Sell from './Sell';
import { inject, observer } from 'mobx-react';
@inject('globalStore')
@observer
class Dashboard extends React.Component {
  render(): React.ReactNode {
    const { globalStore, Cart } = this.props as any;
    return (
      <div className={style.layer}>
        <Header {...this.props} />
        <div className={style.content}>
          <Menu />
          <div className={style.main}>
            <Sell
              login={globalStore.connect}
              globalStore={globalStore}
              store={globalStore}
              wallet={globalStore.walletData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
