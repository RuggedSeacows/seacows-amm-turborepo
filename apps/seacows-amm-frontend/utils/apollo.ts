import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// 与 API 的 HTTP 连接
const httpLink = createHttpLink({
  // 你需要在这里使用绝对路径
  // uri: 'https://seacows-amm-server-production.up.railway.app/graphql',
  // uri: 'https://api.thegraph.com/subgraphs/name/lljxx1/seawcows-dev'
  // uri: 'https://api.studio.thegraph.com/query/15300/seacowsgoerliv001/v0.0.1'
  uri: 'https://api.studio.thegraph.com/query/15300/seacowsgoerliv002/v0.0.2'
});

// 缓存实现
const cache = new InMemoryCache();

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});

export default apolloClient;
