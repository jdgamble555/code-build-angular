import { Injectable } from '@angular/core';
import { UserRec, UserRequest } from '@auth/user.model';
import { DbModule } from '@db/db.module';
import { User } from '@supabase/supabase-js';
import { map, Observable, of, switchMap } from 'rxjs';
import { sb_User, SupabaseService } from '../supabase.service';

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

  // todo - fix all this mapping crap
  private mapUser = (user: sb_User): UserRec => ({
    uid: user?.id,
    photoURL: user?.photo_url,
    displayName: user?.display_name,
    createdAt: user?.created_at,
    updatedAt: user?.updated_at,
    username: user?.username,
    email: user?.email,
    role: user?.role as any
  });

  private userSub(): Observable<UserRec | null> {
    return this.sb.authState().pipe(
      switchMap((user: User | null) =>
        user
          ? this.sb.subWhere<sb_User>('profiles', 'id', user?.id)
          : of(null)
      ),
      map(user => user ? this.mapUser(user) : null)
    );
  }

  async getUser(): Promise<UserRequest> {
    const user = (await this.sb.supabase.auth.getSession()).data.session?.user;
    let { data, error } = await this.sb.supabase.from('profiles').select('*').eq('id', user?.id).single();
    data = { ...data, email: user?.email };
    return { data: data ? this.mapUser(data) : null, error };
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
    return { data: data.username, error };
  }

  async logout(): Promise<void> {
    const { error } = await this.sb.supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
  }
}
