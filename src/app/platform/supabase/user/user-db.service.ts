import { Injectable } from '@angular/core';
import { UserRec, UserRequest } from '@auth/user.model';
import { DbModule } from '@db/db.module';
import { supabase_to_user_rec, supabase_user } from '@db/supabase.types';
import { User } from '@supabase/supabase-js';
import { map, Observable, of, switchMap } from 'rxjs';
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
    this.user$ = this.userSub();
  }

  private userSub(): Observable<UserRec | null> {
    return this.sb.authState().pipe(
      switchMap(user =>
        user
          ? this.sb.subWhere<supabase_user>('profiles', 'id', user?.id)
          : of(null)
      ),
      map(user => user ? supabase_to_user_rec(user) : null)
    );
  }

  async getUser(): Promise<UserRequest> {
    const user = (await this.sb.supabase.auth.getSession()).data.session?.user;
    let { data, error } = await this.sb.supabase.from('profiles').select('*').eq('id', user?.id).single();
    data = { ...data, email: user?.email };
    return { data: data ? supabase_to_user_rec(data) : null, error };
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
    const { data, error } = await this.sb.supabase.from('profiles').select('*').eq('id', uid).single();
    console.log(data);
    return { data, error };
  }

  async logout(): Promise<void> {
    const { error } = await this.sb.supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
  }
}
