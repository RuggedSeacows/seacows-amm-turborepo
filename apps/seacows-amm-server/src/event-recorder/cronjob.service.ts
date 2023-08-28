import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventRecorderStorageService } from './event-recorder-storage.service';
@Injectable()
export class SyncRecorderTasksService {
  private readonly logger = new Logger(SyncRecorderTasksService.name);
  constructor(
    private readonly eventRecorderStorageService: EventRecorderStorageService
  ) {}

  @Cron('0 * * * * *')
  async syncCollections() {
    this.logger.log('start syncCollections');
    try {
      await this.eventRecorderStorageService.syncPoolCreateEvent();
    } catch (err) {
      this.logger.verbose(err.stack);
      this.logger.error(err);
    }
  }
}
