import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private isHome = new BehaviorSubject<boolean>(true);
  isShowNavigation = this.isHome.asObservable();

  constructor() {}

  setIsHome = (value: boolean) => {
    this.isHome.next(value);
  };
}
