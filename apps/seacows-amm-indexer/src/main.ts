import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './modules/app.module';
import 'reflect-metadata';
import { PrismaService } from './modules/prisma/prisma.service';
import { ListenerService } from './modules/listener/listener.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const prisma = app.get<PrismaService>(PrismaService);

  app.use(helmet());
  app.enableCors({
    origin: [
      'https://testnet.app.seacows.io',
      /https:\/\/seacows-amm-turborepo-(.*)-yolominds.vercel.app/,
      'http://localhost:3000',
    ],
    methods: ['GET', 'HEAD', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'Origin'],
    // exposedHeaders: [],
    credentials: true,
    maxAge: 86400,
  });

  // Connect to DB eagerly
  await prisma.$connect();
  prisma.enableShutdownHooks(app);

  // Start listener
  const listener = app.get<ListenerService>(ListenerService);
  listener.listenToNewBlocks();

  // // Parse missing blocks
  // listener.parseMissingBlocks();

  // listener.parsePastLogs();

  await app.listen(port);
  logger.log(
    `Application started on port: ${port}, url: ${await app.getUrl()}`,
  );
}

bootstrap();
