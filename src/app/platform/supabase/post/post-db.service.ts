import { Injectable } from '@angular/core';
import { UserRec } from '@auth/user.model';
import { DbModule } from '@db/db.module';
import { decode, encode } from '@db/sb-tools';
import { UserDbService } from '@db/user/user-db.service';
import { Post, PostInput } from '@post/post.model';
import { SupabaseService } from '../supabase.service';
import { ActionDbService } from './action-db.service';
import { TagDbService } from './tag-db.service';


@Injectable({
  providedIn: DbModule
})
export class PostDbService {

  constructor(
    private as: ActionDbService,
    private ts: TagDbService,
    private us: UserDbService,
    private sb: SupabaseService
  ) { }

  /**
  * Get a total count for the collection
  * @param col - Collection Path
  * @returns - total count
  */
  async getTotal(col: string): Promise<{ data: string | null, error: any }> {
    let error = null;
    let data = null;
    return { error, data };
  }


  async getPostById(id: string): Promise<{ data: Post | null, error: any }> {
    let data: any = null;
    let error = null;
    ({ data, error } = await this.sb.supabase.from('posts').select('*, author!inner(*)').eq('id', id).eq('published', true).single());
    data = () => ({
      ...data,
      //author: { ..._d.author, id: encode(_d.author.id) },
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
    return { data, error };
  }


  /**
 * Search posts by term
 * @param term
 * @returns Observable of search
 */
  async searchPost(term: string): Promise<{ data: Post[] | null, error: any }> {
    let data = null;
    let error = null;
    return { data, error };
  }

  async getPosts({
    sortField = 'createdAt',
    sortDirection = 'desc',
    pageSize = 5,
    authorId,
    page = 1,
    tag,
    uid,
    field,
    drafts = false
  }: PostInput = {}): Promise<{ error: any, data: Post[] | null, count: string | null }> {

    let error = null;
    let posts = null;
    let count = null;
    let data = null;

    ({ data, count } = await this.sb.supabase.from('posts').select('*, author!inner(*)', { count: 'exact' }).eq('published', true));

    data = data?.map(_d => ({
      ..._d,
      //author: { ..._d.author, id: encode(_d.author.id) },
      createdAt: _d.created_at,
      updatedAt: _d.updated_at
    }));
    return {
      error,
      data: data || null,
      count: count?.toString() || null
    };

  }
}
