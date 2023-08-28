import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';

(() => {
  const csvFilePath = path.resolve(__dirname, 'files/SeaCows_Gleam.csv');

  const headers = [
    'Position',
    'Prize Name',
    'SeaPoints awarded',
    'Name',
    null,
    null,
    'Email',
    null,
    null,
    'Entries',
    null,
    null,
    null,
    null,
    null,
    null,
    'Twitter',
  ];

  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
      fromLine: 2,
    },
    async (error, result: any[]) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log('Seapoints campaign length', result.length);

      const prisma = new PrismaClient();

      await prisma.campagin_events.create({
        data: {
          start_date: new Date()
        }
      });

      // await prisma.campaigns.createMany({
      //   data: result.map(r => ({
      //     campaign_event_id: 1,
      //     position: Number(r['Position']),
      //     name: r['Name'],
      //     email: r['Email'],
      //     seapoints: Number(r['SeaPoints awarded']),
      //     prize_name: r['Prize Name'],
      //     entries: Number(r['Entries']),
      //     twitter: r['Twitter'],
      //     wallet_address: ethers.constants.AddressZero
      //   }))
      // })
    },
  );
})();
