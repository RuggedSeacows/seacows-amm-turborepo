import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '@components/Layout';
import Create from '@components/Earn/Create';
@inject('globalStore')
@observer
class CEarn extends React.Component {
  render(): React.ReactNode {
    return <Layout {...this.props} Earn={Create} />;
  }
}
export default CEarn;
