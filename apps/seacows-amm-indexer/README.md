# AMM Backend (Indexer and REST api)

Indexes smart contract events of the AMM protocol, with self-backfilling ability, considering the cases of server/RPC down, or any other issues, feeling you comfortable not to miss any transfers.

For all active contracts registered in `contracts` table, the indexer tracks

- `Transfer` events under `Transfer(address,address,uint256)` topic id.

- For adding new pools, it tracks `NewPair(address,uint256,uint256)` topic id.

## Architecture

_TO BE UPDATED since introduced contract abstraction logic_

## How to run

### Development

```
pnpm
pnpm dev
```

### Production

```
pnpm
pnpm start:prod
```

