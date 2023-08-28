import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, "query", false> {
  constructor() {
    super({
      log: [
        "info", "warn", "error",
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    if (process.env.NODE_ENV === 'development') {
      this.enableLogQuery();
    }
  }

  async enableLogQuery() {
    this.$on('query', async (e) => {
      console.warn(`Query: ${e.query}`);
      console.warn(`Params: ${e.params}`);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
