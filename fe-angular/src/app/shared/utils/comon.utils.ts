/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { PACKAGE_TYPES } from '@app/configs/package.constants';
import { ERRORS_CONSTANT } from '../constants/error.constants';

export const CommonUtils = {
  /**
   * getAvatarText - Using for get text display for replace icon.
   * @param text : string
   * @returns text with maximum 2 value
   */
  getAvatarText(text: string) {
    if (text) {
      text = text.replace(/[^a-zA-Z0-9 ]/g, '');
      if (text.split(' ').length > 1) {
        const listTexts = text.split(' ');
        return listTexts[0].charAt(0) + listTexts[1].charAt(0);
      } else {
        return text.substring(0, 2);
      }
    } else {
      return '';
    }
  },

  /**
   * Create array sequence number
   * @param n number
   * @returns Array number
   */
  numSequence(n: number): Array<number> {
    return Array(n);
  },

  /**
   * Convert string with params to normal string
   * @param message string
   * @param params array any
   * @returns string
   */
  normallyMessageWithParams(message: string, params: Array<any> = []) {
    // temp: Message||Value1||Value2
    const messArr = message.split('||');
    if (messArr.length > 1) {
      message = messArr[0];
      messArr.shift();
      params = messArr;
    }
    if (params.length > 0) {
      params.forEach((item, index) => {
        message = message.replace(
          new RegExp('\\{' + index + '\\}', 'g'),
          () => {
            return item;
          },
        );
      });
    }
    return message;
  },

  /**
   * Gen message error
   * @param message string
   * @param obj any
   * @returns string
   */
  genMessageError(
    message: string,
    objKey: any,
    objGeneral: any = ERRORS_CONSTANT.GENERAL,
  ) {
    if (Object.keys(objKey).findIndex((key: string) => key === message) > -1)
      return objKey[message];
    else if (
      Object.keys(objGeneral).findIndex((key: string) => key === message) > -1
    )
      return objGeneral[message];
    return message;
  },

  /**
   * Nomarly  error message when message don't include in ERROR_CONTANT
   * @param objectError ERROR_CONTANT object
   * @param message string, input message from api
   * @param replaceMessage message replace case all message before don't exist
   * @returns string
   */
  getErrorMessage(objectError: any, message: string, replaceMessage?: string) {
    let mess = replaceMessage || message;
    if (objectError[message]) {
      mess = objectError[message];
    }
    return mess;
  },

  /**
   * Compare 2 objects
   * @param object1 object
   * @param object2 object
   * @returns boolean
   */
  objectEqual(object1: any, object2: any) {
    if (!this.isObject(object1) || !this.isObject(object2)) {
      return false;
    }

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = this.isObject(val1) && this.isObject(val2);
      if (
        (areObjects && !this.deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }

    return true;
  },

  /**
   * Check current data is object or not.
   * @param object object
   * @returns boolean
   */
  isObject(object: any) {
    return object != null && typeof object === 'object';
  },

  /**
   * Get package object
   * @param key string, package value
   * @returns package object
   */
  getPackageObj(key: string) {
    return Object.entries(PACKAGE_TYPES).find(
      (item: any) => item[1].key === key,
    );
  },

  /**
   * Get package object
   * @param key string, package value
   * @returns package object
   */
  getPackageKey(url: string) {
    const listPath = url.split('/');
    const listPackageKey = Object.values(PACKAGE_TYPES).map(
      (item: any) => item.key,
    );
    return listPath.find((path: string) => listPackageKey.includes(path));
  },

  /**
   * Get package object
   * @param key string, package value
   * @returns package object
   */
  getPackageKeyByValue(value: number) {
    const listPackageKey = Object.values(PACKAGE_TYPES).map(
      (item: any) => item.key,
    );
    return listPackageKey.find((item: any) => item.value === value);
  },

  /**
   * Escape html
   * @param str string
   * @returns string
   */
  htmlEscape(str: string) {
    return str
      ? str
          .replace(/&/g, '&amp')
          .replace(/'/g, '&apos')
          .replace(/"/g, '&quot')
          .replace(/>/g, '&gt')
          .replace(/</g, '&lt')
      : '';
  },

  /**
   * Unescape html
   * @param str string
   * @returns string
   */
  htmlUnescape(str: string) {
    return str
      ? str
          .replace(/&amp/g, '&')
          .replace(/&apos/g, "'")
          .replace(/&quot/g, '"')
          .replace(/&gt/g, '>')
          .replace(/&lt/g, '<')
      : '';
  },
  /**
   * Formula calculate compare after value with before
   * @param before number, value before
   * @param after number, value after
   * @returns number percent value
   */
  compareFormula(before: number, after: number): number {
    if (before === 0) {
      return 0;
    }
    return +(((after - before) / before) * 100).toFixed(2) || 0;
  },

  /**
   * Compare 2 objects
   * @param object1 object
   * @param object2 object
   * @returns boolean
   */
  compareObjs(obj1: any, obj2: any) {
    if (obj1 === obj2) return true;
    // if both obj1 and obj2 are null or undefined and exactly the same

    if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) return false;
    // if they are not strictly equal, they both need to be Objects

    if (obj1.constructor !== obj2.constructor) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    for (const p in obj1) {
      if (!Object.prototype.hasOwnProperty.call(obj1, p)) continue;
      // other properties were tested using obj1.constructor === obj2.constructor

      if (!Object.prototype.hasOwnProperty.call(obj2, p)) return false;
      // allows to compare obj1[ p ] and obj2[ p ] when set to undefined

      if (obj1[p] === obj2[p]) continue;
      // if they have the same strict value or identity then they are equal

      if (typeof obj1[p] !== 'object') return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

      if (!this.compareObjs(obj1[p], obj2[p])) return false;
      // Objects and Arrays must be tested recursively
    }

    for (const p in obj2)
      if (
        Object.prototype.hasOwnProperty.call(obj2, p) &&
        !Object.prototype.hasOwnProperty.call(obj1, p)
      )
        return false;
    // allows obj1[ p ] to be set to undefined

    return true;
  },

  /**
   * Calculator offset top element
   * @param offsetParent any
   * @param offsetTop number
   * @param totalOffsetTop number
   * @returns number
   */
  calculatorOffsetTopScreen(
    offsetParent: any,
    offsetTop: number,
    totalOffsetTop: number = 0,
  ) {
    try {
      if (!offsetParent) {
        return totalOffsetTop + offsetTop;
      } else {
        const totalOffsetToptemp = totalOffsetTop + offsetTop;
        return this.calculatorOffsetTopScreen(
          offsetParent?.offsetParent,
          offsetParent?.offsetTop,
          totalOffsetToptemp,
        );
      }
    } catch (err) {
      return 0;
    }
  },
};

export const isNotNull = (object: Object) => {
  return object !== undefined && object !== null;
};

export const isNotBlank = (value: string) => {
  return value && value.length > 0;
};

export const cloneObject = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};

export const cloneArrayObject = (array: any) => {
  return array.map(item => JSON.parse(JSON.stringify(item)));
};
