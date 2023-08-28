import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '@components/Layout';
import Widthdraw from '@components/Earn/widthdraw';

@inject('globalStore')
@observer
class CEarn extends React.Component {
  render(): React.ReactNode {
    return <Layout {...this.props} Earn={Widthdraw} />;
  }
}
export default CEarn;
