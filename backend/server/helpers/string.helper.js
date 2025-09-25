import mongoose from 'mongoose';
import crypto from 'crypto';

export function generateRandom6Digits() {
  return Math.floor(100000 + Math.random() * 100000);
}

export function getObjectId(objectId) {
  try {
    if (typeof objectId === 'string') {
      return mongoose.Types.ObjectId(objectId);
    }
    return objectId;
  } catch (error) {
    throw error;
  }
}

/**
 * Get current date by format dd-mm-yyyy
 * @param {string} separator
 * @returns {string}
 */
export function getCurrentDateString(separator = '-') {
  const currentDate = new Date();
  const dateValues = [currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear()];
  return dateValues.join(separator);
}

/**
 * 
 * Get current time by format hhmmss
 * @returns {string}
 */
export function getCurrentTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}${minutes}${seconds}`;
}

/**
 * Return sha1 string
 * @param {String} data
 * @returns {string}
 */
export function getSha1(data) {
  return crypto.createHash('sha1')
  .update(data)
  .digest('hex');
}

export function makeId(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function makeSlugId() {
  const result = makeId(10);
  return `${result.slice(0, 3)}-${result.slice(3, 7)}-${result.slice(7, 10)}`;
}

export function hideString(theString, keepLength) {
  const hideNum = [];
  for (let i = 0; i < theString.length; i += 1) {
    if (i < theString.length - keepLength) {
      hideNum.push('*');
    } else {
      hideNum.push(theString[i]);
    }
  }
  return hideNum.join('');
}

export function hideLeftString(theString, hideLength) {
  const arrStr = theString.split(' ');
  const endWord = arrStr[arrStr.length - 1];
  const hideNum = [];
  for (let i = 0; i < endWord.length; i += 1) {
    if (endWord.length - i > hideLength) {
      hideNum.push(endWord[i]);
    } else {
      hideNum.push('*');
    }
  }
  arrStr[arrStr.length - 1] = hideNum.join('');
  return arrStr.join(' ');
}
