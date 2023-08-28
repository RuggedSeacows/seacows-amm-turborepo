import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '@components/Layout';
import Earn from '@src/components/Earn';
@inject('globalStore')
@observer
class CEarn extends React.Component {
  render(): React.ReactNode {
    return <Layout {...this.props} Earn={Earn} />;
  }
}
export default CEarn;
