import { Component } from '@angular/core';

@Component({
  selector: 'app-page403',
  templateUrl: './page403.component.html',
  styleUrls: ['./page403.component.scss']
})

/**
 * PAges-404 component
 */
export class Page403Component {
  homeUrl = '/' ;
  constructor() {
    window.onpopstate = () => {
      window.location.href = this.homeUrl;
    }; 
    history.pushState({}, '');
  }
}
