import styleLayout from '../../pages/dashboard/index.module.scss';
import Header from '@components/Header';
import Menu from '@components/Menu';
import React from 'react';
import { inject, observer } from 'mobx-react';
@inject('globalStore')
@observer
class Dashboard extends React.Component<any> {
  render(): React.ReactNode {
    const { globalStore, cart, Earn } = this.props;
    return (
      <div className={styleLayout.layer}>
        <Header {...this.props} />
        <div className={styleLayout.content}>
          <Menu active={2} />
          <div className={styleLayout.main}>
            <Earn
              login={globalStore.connect}
              store={globalStore}
              globalStore={globalStore}
              wallet={globalStore.walletData}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
