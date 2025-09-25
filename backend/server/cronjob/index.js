import * as FtxCron from './ftx.cron';
import logger from '../util/logger';

export default async function runCronJobs() {
  try {
    await FtxCron.run();
    return true;
  } catch (error) {
    logger.error(`runCronJobs error: ${error}`);
    throw error;
  }
}
