import styleLayout from '../dashboard/index.module.scss';
import Header from '@components/Header';
import Menu from '@components/Menu';
import ExploreList from '@src/components/Explore/ExploreList';
import React from 'react';
import { inject, observer } from 'mobx-react';
@inject('globalStore')
@observer
class Dashboard extends React.Component {
  render(): React.ReactNode {
    const { globalStore, cart } = this.props as any;
    return (
      <div className={styleLayout.layer}>
        <Header {...this.props} />
        <div className={styleLayout.content}>
          <Menu active={1} />
          <div className={styleLayout.main}>
            <ExploreList />
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
