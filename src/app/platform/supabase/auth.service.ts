import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Role } from '@auth/user.model';
import { firstValueFrom, Observable, of } from 'rxjs';
import { DbService } from './db.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO - fix type here
  user$: Observable<any | null>;

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
    private db: DbService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.user$ = of({});
  }

  async getUser(): Promise<any | null> {
    return;
  }

  //
  // Login
  //

  async emailLogin(email: string, password: string): Promise<any> {
    return;
  }

  async emailSignUp(email: string, password: string): Promise<void> {

    return;
  }

  async sendEmailLink(email: string): Promise<any> {
    return;
  }

  async confirmSignIn(url: string, email?: string): Promise<boolean> {

    return false;
  }

  async resetPassword(email: string): Promise<any> {

    // sends reset password email
    return { message: this.messages.resetPassword };
  }

  async oAuthLogin(p: string): Promise<boolean> {

    return false;
  }

  async oAuthReLogin(p: string): Promise<any> {
    return;
  }

  logout(): void {
    return;
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

  async updateUsername(username: string, currentUsername?: string): Promise<any> {
    // update in firebase authentication
    const user = await this.getUser();

    if (user) {
      try {
        await this.db.updateUsername(username, user.uid, currentUsername);
      } catch (e: any) {
        console.error(e);
      }
      return { message: this.messages.usernameUpdated };
    }
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
