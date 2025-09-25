import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import * as crypto from 'crypto-js';
import * as EncUtf8 from 'crypto-js/enc-utf8';
import { LocalStorageKeyEnum } from '../../shared/constants/enums/local-storage-key.enum';

const IGNORE_KEY_LIST: string[] = [
  LocalStorageKeyEnum.MASTER_DATA_CACHED_EXPIRED_KEY,
  LocalStorageKeyEnum.MASTER_DATA_CACHED_KEY
];

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly ignoreKeys: string[] = [];
  private keyMap = {};

  constructor() {
    for (const key of IGNORE_KEY_LIST) {
      this.ignoreKeys.push(this.getKey(key));
    }
  }

  clear(): void {
    const removekeyList = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (this.ignoreKeys.indexOf(key) === -1) {
        removekeyList.push(key);
      }
    }
    for (const key of removekeyList) {
      localStorage.removeItem(key);
    }
  }

  getString(key: string): string | null {
    const value = localStorage.getItem(this.getKey(key));
    return value
      ? crypto.AES.decrypt(value, environment.secret).toString(EncUtf8)
      : value;
  }

  setString(key: string, value: string): void {
    localStorage.setItem(
      this.getKey(key),
      crypto.AES.encrypt(value, environment.secret).toString()
    );
  }

  getObject<T>(key: string, defaultValue?: T): T | null {
    const value = localStorage.getItem(this.getKey(key));
    const decodeValue = value
      ? crypto.AES.decrypt(value, environment.secret).toString(EncUtf8)
      : value;
    return decodeValue
      ? JSON.parse(decodeValue)
      : defaultValue
      ? defaultValue
      : null;
  }

  setObject(key: string, objectValue: object) {
    const value = JSON.stringify(objectValue);
    return this.setString(key, value);
  }

  getNumber(key: string): number | null {
    const value = localStorage.getItem(this.getKey(key));
    return value
      ? +crypto.AES.decrypt(value, environment.secret).toString(EncUtf8)
      : null;
  }

  setNumber(key: string, value: number): void {
    localStorage.setItem(
      this.getKey(key),
      crypto.AES.encrypt('' + value, environment.secret).toString()
    );
  }

  removeKey(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  removeKeys(keys: string[]): void {
    if (keys && keys.length > 0) {
      keys.forEach(key => {
        localStorage.removeItem(this.getKey(key));
      });
    }
  }

  containsKey(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) != null;
  }

  private getKey(rawKey: string): string {
    let key = this.keyMap[rawKey];
    if (!key) {
      key = crypto.SHA256(environment.secret + rawKey).toString();
      this.keyMap[rawKey] = key;
    }
    return key;
  }
}
