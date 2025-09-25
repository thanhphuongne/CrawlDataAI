import cron from 'cron';
import logger from '../util/logger';

const time = '*/3 * * * * *'; // every 3 seconds

function doSomethings() {
  console.log('doSomethings');
}

const doSomethingsCron = {
  cronTime: time,
  onTick: async () => {
    await doSomethings();
  },
  start: false,
  runOnInit: false,
};

export async function run() {
  try {
    logger.info('RUN CRON');
    const someCron = new cron.CronJob(doSomethingsCron);
    someCron.start();
    return true;
  } catch (error) {
    logger.error('doSomethings cron run error:', error);
    throw error;
  }
}
