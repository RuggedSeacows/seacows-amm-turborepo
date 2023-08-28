import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueError,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { contracts } from '@prisma/client';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Job } from 'bull';
import { AppConfig } from 'src/config/type';
import { getRpcProvider } from 'src/utils/rpc';
import { BaseContract } from 'src/web3/contracts/base';
import { ContractService } from '../contract/contract.service';
import { EventService } from '../event/event.service';
import { PairFactoryContract } from 'src/web3/contracts/pairFactory';
import { PoolService } from '../pool/pool.service';

type ReadJobPayload = {
  contract: contracts;
  from: number;
  to: number;
};

type InitJobPayload = {
  contractId: number;
  from: number;
  to: number;
  jobCount: number;
};

@Processor('blocks')
export class ListenerProcessor {
  private readonly logger = new Logger('ListenerProcessor');
  private readonly rpcProvider: JsonRpcProvider;

  private jobRuns: Record<string, number> = {};
  private initJobs: Record<number, InitJobPayload> = {};

  constructor(
    private readonly eventService: EventService,
    private readonly poolService: PoolService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly contractService: ContractService,
  ) {
    this.rpcProvider = getRpcProvider(
      this.configService.get('RPC_URL', { infer: true }),
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}...`,
    );

    if (job.name === 'read') {
      // find Job that matches the range
      const data: ReadJobPayload = job.data;
      const initJob = this.initJobs[data.contract.id];

      if (!initJob) {
        console.error('Job not found', { data });
        return;
      }

      if (
        data.from >= initJob.from &&
        data.to <= initJob.to &&
        data.from <= data.to
      ) {
        const key = this.getjobRunsKey(initJob);

        this.jobRuns[key]++;

        this.logger.log('OnQueueCompleted read job', {
          initJob,
          pass: this.jobRuns[key],
        });

        if (this.jobRuns[key] >= initJob.jobCount) {
          this.contractService.updateReadPastBlockStatus(
            initJob.contractId,
            'completed',
          );
        }
      }
    }
  }

  @OnQueueError()
  onError(error: Error) {
    console.error('onQueueError', error);
    this.logger.error(`OnQueueError... ${JSON.stringify(error)}`, { error });
  }

  @Process('init')
  async handleInit(job: Job<InitJobPayload>) {
    const { data } = job;
    const { contractId } = data;

    this.jobRuns[this.getjobRunsKey(job.data)] = 0;
    this.initJobs[contractId] = data;

    await this.contractService.updateReadPastBlockStatus(contractId, 'active');
  }

  @Process('read')
  async handleReadBlocks(job: Job<ReadJobPayload>) {
    const { contract, from, to } = job.data;

    let contractInstance: BaseContract = null;

    if (contract.type === 'SeacowsPairFactory') {
      contractInstance = new PairFactoryContract(
        this.configService,
        this.contractService,
        this.poolService,
        contract,
        this.rpcProvider,
      );
    } else {
      this.logger.error('Unidentified contract type: ' + contract.type, {
        contract,
      });
    }

    // Filter all events in the given block range
    await contractInstance.filterEvents(from, to);
  }

  private getjobRunsKey(data: InitJobPayload) {
    return `${data.contractId}:[${data.from}, ${data.to}]`;
  }
}
