import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';

@Module({
  imports: [PrismaModule],
  providers: [CollectionService],
  exports: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
