import { Contract, ContractInterface, Event, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { contracts } from '@prisma/client';
import { Logger } from '@nestjs/common';

export abstract class BaseContract extends Contract {
  protected abstract supportedEvents: string[];
  protected abstract readonly logger: Logger;
  protected contractAddress: string;

  constructor(
    contract: string,
    contractInterface: ContractInterface,
    signerOrProvider?: Signer | Provider,
  ) {
    super(contract, contractInterface, signerOrProvider);
    this.contractAddress = contract;
  }

  async filterEvents(fromBlock: number, toBlock: number) {
    this.logger.log('filterEvents', {
      contract: this.contract,
      fromBlock,
      toBlock,
    });

    for await (const topicId of this.supportedEvents) {
      const events = await this.filterEvent(topicId, fromBlock, toBlock);

      await this.processEvents(topicId, events);
    }
  }

  abstract processEvents(topicId: string, events: Event[]): Promise<void>;

  abstract filterEvent(
    topicId: string,
    fromBlock: number,
    toBlock: number,
  ): Promise<Event[]>;
}
