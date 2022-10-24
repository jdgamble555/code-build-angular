import { Injectable } from '@angular/core';
import { AuthAction } from '@auth/user.model';
import { DbModule } from '@db/db.module';
import { environment } from '@env/environment';
import { Provider } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: DbModule
})
export class AuthService {

  constructor(
    private sb: SupabaseService
  ) { }

  async emailLogin(email: string, password: string): Promise<AuthAction> {
    const { error } = await this.sb.supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async emailSignUp(email: string, password: string): Promise<AuthAction> {
    const { error } = await this.sb.supabase.auth.signUp({ email, password });
    return { error };
  }

  async sendEmailLink(email: string): Promise<AuthAction> {
    const { error } = await this.sb.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: environment['site']
      }
    });
    return { error };
  }

  async sendVerificationEmail(): Promise<AuthAction> {
    // not available for supabase
    return { error: null };
  }

  async confirmSignIn(url: string, email?: string): Promise<AuthAction> {
    // not necessary for supabase
    return { isConfirmed: false, error: null };
  }

  async resetPassword(email: string): Promise<AuthAction> {
    const { error } = await this.sb.supabase.auth.resetPasswordForEmail(email);
    return { error };
  }

  async oAuthLogin(p: string): Promise<AuthAction> {
    p = p.replace('.com', '');
    const { error } = await this.sb.supabase.auth.signInWithOAuth({
      provider: p as Provider,
      options: {
        redirectTo: environment['site']
      }
    });
    return { error };
  }
}
