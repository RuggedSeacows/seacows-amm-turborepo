import 'antd/dist/antd.dark.css';
import '../styles/globals.css';
import App from 'next/app';
import Head from 'next/head';
// import 'animate.css'
import { Provider } from 'mobx-react'; // @ts-ignore
import { withMobx } from 'next-mobx-wrapper';
import * as getStores from '@src/store';

class MyApp extends App {
  render() {
    const { Component, pageProps, store } = this.props as any;
    const { globalStore, cart } = store;
    return (
      <Provider {...store}>
        <Head>
          <title>Seasows-AMM</title>
          <meta name="description" content="seasows website" />
          <meta
            name="keywords"
            content="Seacows; Seacows nft; nft amm; Seacows amm; nft trading; nft defi; nft marketplace; NFT price evaluation; gamefi nft"
          />
          <meta
            name="description"
            content="SeaCows is a decentralized NFT AMM powered by AI-driven price oracles to enable instant NFT trading"
          />
          <link href="https://fonts.font.im/css?family=Rubik" rel="stylesheet"></link>
          <link href="/reset.css" rel="stylesheet"></link>
          <link rel="icon" href="/favicon.png" />
          <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>
        </Head>
        <Component {...pageProps} globalStore={globalStore} cart={cart} />
      </Provider>
    );
  }
}

export default withMobx(getStores)(MyApp);
