import { Component, isDevMode, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavService } from './nav/nav.service';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  routerSub!: Subscription;

  constructor(
    public router: Router,
    public ns: NavService
  ) {
    if (!isDevMode()) {
      this.routerSub = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          gtag('config', 'G-VXHF3QQQ2S', { 'page_path': event.urlAfterRedirects });
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
  }
}
