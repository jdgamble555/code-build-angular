import { Injectable } from '@angular/core';
import { UserRec, UserRequest } from '@auth/user.model';
import { DbModule } from '@db/db.module';
import { combine_user, supabase_user } from '@db/supabase.types';
import { User } from '@supabase/supabase-js';
import { decode } from 'j-supabase';
import { map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: DbModule
})
export class UserDbService {

  user$: Observable<UserRec | null>;

  constructor(
    private sb: SupabaseService
  ) {

    // get user rec if logged in
    this.user$ = this.userSub().pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  // todo - merge auth and user

  private userSub(): Observable<UserRec | null> {
    return this.sb.authState().pipe(
      switchMap(user => user
        ? this._subUserRec(user)
        : of(null)
      )
    );
  }

  private _subUserRec(user: User): Observable<UserRec | null> {
    return this.sb.subWhere<supabase_user>('profiles', 'id', user.id)
      .pipe(
        map(data => data ? combine_user(user, data) : null)
      );
  }

  async getUser(): Promise<UserRequest> {
    const user = (await this.sb.supabase.auth.getSession()).data.session?.user;
    let data = null;
    let error = null;
    if (user) {
      ({ data, error } = await this.sb.supabase.from('profiles').select('*').eq('id', user.id).single());
      data = data ? combine_user(user, data) : null;
    }
    return { data, error };
  }

  async createUser(user: UserRec, id: string): Promise<UserRequest> {
    const { error } = await this.sb.supabase.from('profiles').upsert({
      id,
      photo_url: user.photoURL,
      phone_number: user.phoneNumber,
      display_name: user.displayName
    });
    return { error };
  }

  async getUsernameFromId(uid: string): Promise<UserRequest> {
    const id = decode(uid);
    const { data, error } = await this.sb.supabase.from('profiles').select('*').eq('id', id).single();
    return { data, error };
  }

  async logout(): Promise<void> {
    const { error } = await this.sb.supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
  }
}
