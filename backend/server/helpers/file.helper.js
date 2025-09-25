import fs from 'fs';
import execa from 'execa';
import logger from '../util/logger';

/**
 * Remove local file on server with filePath
 * @param filePath
 * @returns {boolean}
 */
export function removeFile(filePath) {
  if (!filePath) {
    return true;
  }
  try {
    execa.commandSync(`rm ${filePath}`);
    return true;
  } catch (error) {
    logger.error('removeFile execa error:', error);
    logger.error('removeFile execa error, filePath:', filePath);
    throw error;
  }
}
/**
 * Create folder if not existed
 * @param path
 * @returns {boolean}
 */
export function mkDir(path) {
  if (!path) {
    return true;
  }
  try {
    // if (!fs.existsSync(path)) {
    //   execa.commandSync(`mkdir -p ${path}`);
    // }

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    return true;
  } catch (error) {
    logger.error('mkdir error:');
    logger.error(error);
    throw error;
  }
}
