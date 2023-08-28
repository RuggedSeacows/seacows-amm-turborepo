import { Module } from '@nestjs/common';
import { MetadataFetchService } from './metadata-fetch.service';
import { EventRecorderService } from './event-recorder.service';
import { EventRecorderStorageService } from './event-recorder-storage.service';
import { SyncRecorderTasksService } from './cronjob.service';
import { HttpModule } from 'nestjs-http-promise';
@Module({
  imports: [HttpModule],
  providers: [
    MetadataFetchService,
    EventRecorderStorageService,
    EventRecorderService,
    SyncRecorderTasksService,
  ],
})
export class EventRecorderModule {}
