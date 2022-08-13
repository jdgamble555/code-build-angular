import { Component, isDevMode } from '@angular/core';



@Component({
  selector: 'app-leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.scss']
})
export class LeftnavComponent {

  //total: Observable<string>;

  isDev: boolean;

  constructor() {
    this.isDev = isDevMode();
  }

}
