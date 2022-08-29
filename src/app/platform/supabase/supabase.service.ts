import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  public supabase: SupabaseClient;

  constructor() {

    // init supabase
    this.supabase = createClient(
      environment.supabase_url,
      environment.supabase_key
    );
  }

  authState(): Observable<User | null> {
    return new Observable((subscriber: Subscriber<User | null>) => {
      subscriber.next(this.supabase.auth.user());
      const auth = this.supabase.auth.onAuthStateChange(async (event, session) => {
        subscriber.next(session?.user);

        // todo - pipe this
        // add event & session

        // add info on sign in
        if (event === 'SIGNED_IN') {
          const { error } = await this.supabase.from('profiles').upsert({
            id: session?.user?.id,
            photo_url: session?.user?.user_metadata['avatar_url'],
            display_name: session?.user?.user_metadata['full_name']
          });
          if (error) {
            console.error(error);
          }
        }
      });
      return auth.data?.unsubscribe;
    });
  }

  subWhere(col: string, field: string, value: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.supabase.from(col).select('*').eq(field, value).single().then((payload: any) => {
        subscriber.next(payload.data);
      });
      return this.supabase.from(`${col}:${field}=eq.${value}`).on('*', (payload: any) => {
        subscriber.next(payload.new);
      }).subscribe();
    });
  }

}
