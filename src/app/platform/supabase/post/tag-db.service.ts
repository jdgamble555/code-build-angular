import { Injectable } from '@angular/core';
import { DbModule } from '@db/db.module';
import { SupabaseService } from '@db/supabase.service';
import { Tag } from '@post/post.model';

@Injectable({
  providedIn: DbModule
})
export class TagDbService {

  constructor(private sb: SupabaseService) { }

  async getTags(): Promise<{ data: Tag[] | null, error: any }> {
    const { error, data } = await this.sb.supabase.from('tag_cloud')
      .select('*');
    return { data: data as any, error };
  }
}
