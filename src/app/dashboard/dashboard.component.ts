import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserRec } from '@auth/user.model';
import { AuthService } from '@db/auth.service';
import { ReadService } from '@db/read.service';
import { NavService } from '@nav/nav.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  displayName!: string;

  tabName = 'posts';

  pCount: number | undefined = 0;
  dCount: number | undefined = 0;
  bCount: number | undefined = 0;

  user!: UserRec | null;

  constructor(
    public read: ReadService,
    private auth: AuthService,
    private router: Router,
    private ns: NavService
  ) {
    // see if logged in
    const user = this.auth.getUser();
    if (user) {
      // see if user is in db
      this.read.getUser()
        .then((userRec: UserRec | null) => {
          if (userRec) {
            if (userRec.username) {
              // update count views
              this.user = userRec;
              this.pCount = userRec.postsCount;
              this.bCount = userRec.bookmarksCount;
              this.dCount = userRec.draftsCount;
              if (userRec.display_name) {
                this.displayName = userRec.display_name;
              }
            } else {
              this.router.navigate(['/username']);
            }
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
    this.ns.closeLeftNav();
    this.ns.addTitle('Dashboard');
  }

  tabChange(index: number) {
    if (index === 1) {
      this.tabName = 'drafts';
    } else if (index === 2) {
      this.tabName = 'bookmarks';
    } else {
      this.tabName = 'posts';
    }
  }
}
