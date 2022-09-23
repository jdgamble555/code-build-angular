import { Injectable } from '@angular/core';
import { UserRec, UserRequest } from '@auth/user.model';
import { AuthEditModule } from '@db/auth-edit.module';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: AuthEditModule
})
export class UserEditService {

  constructor(private sb: SupabaseService) { }

  async getUid(): Promise<string | null> {
    return (await this.sb.supabase.auth.getUser()).data.user?.id || null;
  }

  async updateUser({ displayName, photoURL, phoneNumber, email }: UserRec): Promise<{ error: any }> {
    // don't need email for supabase
    const uid = await this.getUid();
    const { error } = await this.sb.supabase.from('profiles').upsert({
      id: uid,
      photo_url: photoURL,
      phone_number: phoneNumber,
      display_name: displayName
    });
    return { error };
  }

  async deleteUser(): Promise<UserRequest> {
    const id = await this.getUid();
    const { error } = await this.sb.supabase.from('profiles').delete().eq('id', id);
    return { error };
  }

  async validUsername(name: string): Promise<UserRequest> {
    const { error, count } = await this.sb.supabase.from('profiles').select('username', { count: 'exact' }).eq('username', name);
    return { error, exists: (count !== 0) };
  }

  async updateUsername(username: string, currentUsername?: string): Promise<UserRequest> {
    const id = await this.getUid();
    const { error } = await this.sb.supabase.from('profiles').update({ username }).eq('id', id);
    return { error };
  }

  async hasUsername(): Promise<UserRequest> {
    const id = await this.getUid();
    const { error, data } = await this.sb.supabase.from('profiles').select('username').eq('id', id).not('username', 'is', null);
    return { error, exists: !!data };
  }
}
