// not being imported for the moment...

import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { UserRec } from '@auth/user.model';
import { firstValueFrom, Observable, share, Subscription } from 'rxjs';
import { UserDbService } from './user/user-db.service';

@Injectable()
export class UserHook implements OnDestroy {

    private _user: UserRec | null;
    private _userObs: Observable<UserRec | null>;
    private _userSub!: Subscription;

    constructor(
        private us: UserDbService,
        //private cdr: ChangeDetectorRef
    ) {
        this._user = null;
        this._userObs = this.us.user$.pipe(share());
        this._userSub = this._userObs.subscribe(_user => {
            //this.cdr.markForCheck();
            this._user = _user;
        });
    }

    async toPromise() {
        return await firstValueFrom(this._userObs);
    }

    get user(): UserRec | null {
        return this._user;
    }

    ngOnDestroy(): void {
        this._userSub.unsubscribe();
    }
}