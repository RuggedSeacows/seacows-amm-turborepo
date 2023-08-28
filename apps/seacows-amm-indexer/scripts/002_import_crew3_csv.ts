import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';

const SEAPOINT_REGEX = /([0-9]+) SeaPoint .* ([0-9]+) XP/g;

(() => {
  const csvFilePath = path.resolve(__dirname, 'files/SeaCows_Crew3.csv');

  const headers = [
    'Name',
    'Twitter',
    'Discord',
    'DiscordId',
    'Reward',
    null, // answer
    null, // Quest
    'Address',
    'Status',
    'Date',
    null, // ReviewedById
    null, // ReviewDate
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

      console.log('Seapoints campaign result: ', result.length);

      const prisma = new PrismaClient();
      const count = await prisma.campagin_events.count();
      let campaignEventId = count;

      if (count === 0) {
        const result = await prisma.campagin_events.create({
          data: {
            start_date: new Date()
          }
        });
        campaignEventId = result.id;
      }

      await prisma.campaigns.createMany({
        data: result.map((r, index) => {
          const rewardStr = r['Reward'];
          const matches = SEAPOINT_REGEX.exec(rewardStr);

          if (!matches) {
            throw new Error(`Parse Reward string error: ${rewardStr}`);
          }

          const seapoints = Number(matches[1]);
          const numXP = Number(matches[2]);

          if (isNaN(seapoints) || isNaN(numXP)) {
            throw new Error(`Parse Reward substrings error: ` + JSON.stringify({ rewardStr, matches }));
          }

          return {
            campaign_event_id: campaignEventId,
            position: index + 1,
            name: r['Name'],
            email: r['Email'],
            seapoints,
            num_xp: numXP,
            twitter: r['Twitter'],
            discord: `${r['Discord']}#${r['DiscordId']}`,
            status: r['Status'] === 'success',
            wallet_address: r['Address']
          }
        })
      })
    },
  );
})();
