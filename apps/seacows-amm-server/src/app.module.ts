import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AppController } from './app.controller';
import config from 'src/common/configs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './gql-config.service';
import { AmmPoolModule } from './amm-pool/amm-pool.module';
import { HttpModule } from 'nestjs-http-promise';
import { AmmContractModule } from './amm-contract/amm-contract.module';
import { Web3Module } from 'nest-web3';
import { EventRecorderService } from './event-recorder/event-recorder.service';
import { EventRecorderModule } from './event-recorder/event-recorder.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    HttpModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    Web3Module.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('web3'),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    AmmPoolModule,
    AmmContractModule,
    EventRecorderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
