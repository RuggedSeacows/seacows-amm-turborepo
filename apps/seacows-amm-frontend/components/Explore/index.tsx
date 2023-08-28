import style from './index.module.scss';
import Cart from './Cart';
import React from 'react';
import { inject, observer } from 'mobx-react';
@inject('globalStore')
@inject('cart')
@observer
class Explore extends React.Component<any> {
  state: any = {
    path: ''
  };
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    this.setState({
      path: window.location.href
    });
  }
  render(): React.ReactNode {
    const { List, show, wallet } = this.props as any;
    const { path } = this.state as any;
    return (
      <div className={style.layout}>
        <div style={{ width: `calc(100vw - ${show ? '600px' : '230px'} )` }}>
          <List {...this.props} wallet={wallet} />
        </div>
        {path.indexOf('/explore/collection') > -1 && show && <Cart {...this.props} />}
      </div>
    );
  }
}

export default Explore;
