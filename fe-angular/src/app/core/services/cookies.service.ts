import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class CookiesService {
  constructor() {}

  clear(): void {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  /**
   * Remove cookie
   * @param key string, cookie name
   * @param domain string, accept domain
   */
  removeCookie(key: string): void {
    this.setCookie(key, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
  }
  /**
   * Get cookie
   * @param key string, cookie name
   * @returns string
   */
  getCookie(key: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${key}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    } else {
      return '';
    }
  }

  /**
   * Set cookie
   * @param key string, cookie name
   * @param value string, cookie value
   * @param expiredTime string, expired time
   */
  setCookie(key: string, value: string, expiredTime?: string): void {
    const cookie = `${key}=${value ?? value};path=/;${
      expiredTime ? 'expires=' + expiredTime + ';' : ''
    }`;
    document.cookie = cookie;
  }
}
