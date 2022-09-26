import { Injectable } from '@angular/core';
import { ActionRequest } from '@auth/user.model';
import { DbModule } from '@db/db.module';
import { decode } from '@db/sb-tools';
import { SupabaseService } from '@db/supabase.service';

@Injectable({
  providedIn: DbModule
})
export class ActionDbService {

  constructor(private sb: SupabaseService) { }

  async getActionExists(postId: string, userId: string, action: string): Promise<ActionRequest> {
    const { error, count } = await this.sb.supabase.from(action)
      .select('*', { count: 'exact' })
      .eq('pid', decode(postId))
      .eq('uid', decode(userId));
    return { error, data: !!(count && count > 0) }
  }

  async actionPost(postId: string, userId: string, action: string): Promise<ActionRequest> {
    const { error } = await this.sb.supabase.from(action)
      .insert({ pid: decode(postId), uid: decode(userId) });
    return { error };
  }

  async unActionPost(postId: string, userId: string, action: string): Promise<ActionRequest> {
    const { error } = await this.sb.supabase.from(action)
      .delete()
      .eq('uid', decode(userId))
      .eq('pid', decode(postId));
    return { error };
  }
}
