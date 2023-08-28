import style from './index.module.scss';
import Search from '@src/components/Search';
import Select from '@components/Select';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { EthLogo } from '@src/components';
import { useEffect, useState } from 'react';
import { getCollection, getCollections } from '@src/api/indexer';
const filters: Array<any> = [
  'Sort by Volume',
  'Floor Price: High to Low',
  'Floor Price: Low to High',
  'Sort by NFT Number'
];
interface Collection {
  address: string;
  image_url: string;
  symbol: string;
  name: string;
  num_assets: number;
  // icon: any
  // floor: number | string
}
export const ExploreList = () => {
  const router = useRouter();
  const [collections, setCollections] = useState<Array<Collection>>([]);
  const { data: poolCollections } = useSWR('/collections', getCollections);

  useEffect(() => {
    const updateCollectionMetadata = async () => {
      if (poolCollections?.data) {
        const collectionsWithoutMetadata = poolCollections.data.filter((c: Collection) => !c.name);
        const collectionsWithMetadata = poolCollections.data.filter((c: Collection) => !!c.name);

        const updatedCollections = await Promise.all(
          collectionsWithoutMetadata.map((c: Collection) => getCollection(c.address).then((c) => c.data))
        );

        setCollections([...collectionsWithMetadata, ...updatedCollections]);
      }
    };

    updateCollectionMetadata();
  }, [poolCollections?.data]);

  const toCollection = (collection: string) => {
    router.push(`/explore/collection?collection=${collection}`);
  };

  return (
    <>
      <div className={style.title}>
        <h2>Explore</h2>
        <p>Explore NFTs and swap whichever instantaneously</p>
      </div>
      <div className={style.filterbox}>
        {/* <div style={ { width: '500px' } }>
        <Search placeholder='Search Collection' />
      </div> */}
        {/* <Select def='Sort by Volume' list={ filters } call={ filterNfts } /> */}
      </div>
      <ul className={style.list}>
        {collections.map((item: Collection, index: number) => (
          <li key={index} onClick={() => toCollection(item.address)}>
            <img src={item.image_url || '/img/nonft.png'} alt="" />
            <p>{item.name}</p>
            {/* <div className={ style.info }>
              <div >{ item.nfts } NFTs</div>
              <div>Floor <EthLogo /> { item.floor }</div>
            </div> */}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ExploreList;
