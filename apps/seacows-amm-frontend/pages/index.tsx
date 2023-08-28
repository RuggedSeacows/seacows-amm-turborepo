import React from 'react';
import Dashboard from './dashboard';
import { inject, observer } from 'mobx-react';
@inject('globalStore')
@observer
class Home extends React.Component {
  render(): React.ReactNode {
    return (
      <div>
        <Dashboard {...this.props} />
      </div>
    );
  }
}

export default Home;
