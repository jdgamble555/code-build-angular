import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';

export interface Profile {
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key);
  }

  get user() {
    return this.supabase.auth.user();
  }

  get session() {
    return this.supabase.auth.session(); 
  }

  get profile() {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', this.user?.id)
      .single();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signIn({ email });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

}
