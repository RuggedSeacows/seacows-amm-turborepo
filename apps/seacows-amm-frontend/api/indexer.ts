const collectionCache: Record<string, any> = {};

interface Params {
  [key: string]: any;
}
const getParams = (params: Params) => {
  return Object.keys(params)
    .map((item: string) => `${item}=${params[item]}`)
    .join('&');
};

const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_API_URL;

// const corsAnywhere = 'https://cors-anywhere.herokuapp.com/'
const corsAnywhere = '';

const fetchIndexer = (resources?: string) =>
  fetch(`${corsAnywhere}${INDEXER_URL}/${resources}`).then((res) => res.json());

export const getUserPools = (owner: string, skip?: number, limit?: number) => {
  return fetchIndexer(`pools?owner=${owner}${skip ? '&skip=' + skip : ''}${limit ? '&limit=' + limit : ''}`);
};

export const getAllPools = (skip?: number, limit?: number) => {
  return fetchIndexer(`pools?${skip ? 'skip=' + skip : ''}${limit ? '&limit=' + limit : ''}`);
};

export const getPoolsBy24HrVolumes = () => {
  return fetchIndexer(`pools/24hr-volumes`);
};

export const getPoolsByVolumes = () => {
  return fetchIndexer(`pools/volumes`);
};

export const getPoolsByCollection = (collection: string) => {
  return fetchIndexer(`pools?nft_address=${collection}`);
};

export const getCollection = (collection: string) => {
  return collectionCache[collection]
    ? Promise.resolve(collectionCache[collection])
    : fetchIndexer(`collections/${collection}`).then((res) => {
        collectionCache[collection] = res;
        return res;
      });
};

export const getCollections = () => {
  return fetchIndexer('collections');
};
