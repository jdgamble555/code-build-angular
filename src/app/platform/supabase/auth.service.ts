import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Provider, User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { DbService } from './db.service';
import { SupabaseService } from './supabase.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;

  private messages = {
    accountRemoved: 'Your account has been deleted and you have been logged out.',
    emailUpdated: 'Your Email Address has been updated.',
    emailVerifySent: 'A verification email has been sent.',
    passUpdated: 'Your Password has been updated.',
    profileUpdated: 'Your Profile has been updated.',
    providerRemoved: '{0} has been removed from the account.',
    resetPassword: 'Your password reset link has been sent.',
    usernameUpdated: 'Your username has been updated!',
    sendEmailLink: 'Your email login link has been sent.'
  };

  private errors = {
    removeProvider: 'You must have at least one linked account or password.',
    updateProfile: 'Your profile could not be updated.'
  };

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private sb: SupabaseService,
    private db: DbService
  ) {

    this.user$ = this.sb.authState();

  }

  getUser(): User | null {
    return this.sb.supabase.auth.user();
  }

  //
  // Login
  //

  async emailLogin(email: string, password: string): Promise<any> {
    return await this.sb.supabase.auth.signIn({ email, password });
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    return await this.sb.supabase.auth.signUp({ email, password });
  }

  async sendEmailLink(email: string): Promise<any> {
    return await this.sb.supabase.auth.signIn({ email });
  }

  async confirmSignIn(url: string, email?: string): Promise<boolean> {

    return false;
  }

  async resetPassword(email: string): Promise<any> {

    // sends reset password email
    return { message: this.messages.resetPassword };
  }

  async oAuthLogin(p: string): Promise<boolean> {
    const { user, session, error } = await this.sb.supabase.auth.signIn({
      provider: p as Provider,
    });
    return false;
  }

  async oAuthReLogin(p: string): Promise<any> {
    return;
  }

  async logout(): Promise<any> {
    return await this.sb.supabase.auth.signOut();
  }

  //
  // Providers
  //

  async getProviders(): Promise<any[]> {
    return [];
  }

  async addProvider(p: string): Promise<any> {
    return;
  }

  async removeProvider(p: string): Promise<any> {
    return;
  }

  //
  // Profile
  //

  async updateUsername(username: string, currentUsername?: string) {
    return { message: '' };
  }

  async updateEmail(email: string): Promise<any> {

    return;
  }

  async sendVerificationEmail() {

    return;
  }

  async updatePass(pass: string): Promise<any> {
    // update in firebase authentication
    return;
  }

  async updateProfile(profile: {
    displayName?: string | null | undefined;
    photoURL?: string | null | undefined;
  }): Promise<any> {
    // update in firebase authentication
    return;
  }

  async deleteUser(): Promise<any> {
    // delete user from firebase authentication
    return;
  }

  //
  // Tools
  //

  /**
   * Replaces variables and shows a message
   * @param msg message with {0} in it
   * @param v variable to replace
   */
  private replaceMsg(msg: string, v: string): string {
    const sFormat = (str: string, ...args: string[]) => str.replace(/{(\d+)}/g, (undefined, index) => args[index] || '');
    return sFormat(msg, v);
  }
}

/**
 * export interface Profile {
    username: string;
    website: string;
    photo_url: string;
};

export const _getProfile = async (): Promise<DB> => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, photo_url`);
    return { data: data[0], error: error?.message };
};

export const _updateProfile = async ({ username, website, photo_url }: Profile): Promise<DB> => {
    const user = supabase.auth.user();
    const { data, error } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
        website,
        photo_url
    });
    return { data: data[0], error: error?.message };
};
 */
