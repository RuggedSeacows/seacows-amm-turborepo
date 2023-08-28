import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: Number(process.env.PORT) || 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  web3: {
    name: 'Goerli',
    url: 'https://eth-goerli.g.alchemy.com/v2/-bB-PmLODMFTOBn_29826EICqKjRqZYa',
  },
};

export default (): Config => config;
