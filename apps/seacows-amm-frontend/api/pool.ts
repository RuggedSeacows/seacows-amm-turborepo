import client from '@utils/apollo';
import gql from 'graphql-tag';

interface querypool {
  first?: number;
  where?: any;
  skip?: number;
}
export function queryPool(params: querypool) {
  return client.query({
    query: gql`
      query ($first: Int, $where: Pair_filter, $skip: Int) {
        pairs(first: $first, where: $where, skip: $skip) {
          id
          owner
          collection
          createdTx
          createdAt
        }
      }
    `,
    variables: {
      first: params.first || 20,
      where: params.where,
      skip: params.skip || 0
    }
  });
}
