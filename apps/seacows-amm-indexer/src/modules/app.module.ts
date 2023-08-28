import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import appConfig from '../config/app';
import { AppController } from './app.controller';
import { AuthModule } from './../auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ListenerModule } from './listener/listener.module';
import { EventModule } from './event/event.module';
import { AppConfig } from 'src/config/type';
import { ContractModule } from './contract/contract.module';
import { PoolModule } from './pool/pool.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [appConfig],
    }),
    BullModule.forRootAsync({
      useFactory(configService: ConfigService<AppConfig, true>) {
        const redisUrl = configService.get('REDIS_URL', { infer: true });

        return {
          redis: redisUrl,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      // https://github.com/liaoliaots/nestjs-redis/blob/main/docs/latest/redis.md#usage
      useFactory(configService: ConfigService<AppConfig, true>) {
        const url = configService.get('REDIS_URL', { infer: true });

        return {
          readyLog: true,
          config: {
            url,
          },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    AuthModule,

    PrismaModule,
    EventModule,
    ListenerModule,
    ContractModule,
    CollectionModule,
    PoolModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
