import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutSubcriptionService {
  layoutShowNavSubject = new Subject<boolean>();
  getLayoutObs = this.layoutShowNavSubject.asObservable();

  /**
   * set show nav sidebar
   * @param nav array
   */
  setShowNav(showNav: boolean) {
    this.layoutShowNavSubject.next(showNav);
  }
}
