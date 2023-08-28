import { Injectable, Logger } from '@nestjs/common';
import { Web3Service } from 'nest-web3';
import { Log } from 'web3-core';

@Injectable()
export class AmmContractService {
  logger: Logger = new Logger('AmmContractService');
  constructor(private readonly web3Service: Web3Service) {}

  async getPoolAddress(address: string, chain = 'eth') {
    const web3 = this.web3Service.getClient(chain);
    const resp = await web3.eth.getTransactionReceipt(address);
    return resp?.logs[0]?.address;
  }
  async subscriptionForAddress(
    address: string,
    callback: (error: Error, log: Log) => void,
    chain = 'eth'
  ) {
    const web3 = this.web3Service.getClient(chain);
    const resp = await web3.eth
      .subscribe('logs', {
        address,
      })
      .on('connected', function (subscriptionId) {
        this.logger.log(subscriptionId);
      })
      .on('data', function (log) {
        this.logger.log(log);
      })
      .on('changed', function (log) {
        this.logger.log(log);
      });
    return resp;
  }
}
