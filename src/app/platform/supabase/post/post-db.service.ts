import { Injectable } from '@angular/core';
import { DbModule } from '@db/db.module';
import { decode } from '@db/sb-tools';
import { supabase_to_post } from '@db/supabase.types';
import { Post, PostInput, PostListRequest, PostRequest } from '@post/post.model';
import { SupabaseService } from '../supabase.service';


@Injectable({
  providedIn: DbModule
})
export class PostDbService {

  constructor(private sb: SupabaseService) { }

  /**
  * Get a total count for the collection
  * @param col - Collection Path
  * @returns - total count
  */
  async getTotal(col: string): Promise<PostRequest> {
    let error = null;
    let data;
    return { error, data };
  }


  async getPostById(id: string): Promise<PostRequest> {
    let _data;
    const pid = decode(id);
    let { data, error, count } = await this.sb.supabase.from('posts').select('*, author!inner(*)').eq('id', pid);
    _data = data ? supabase_to_post(count === 2 ? data[0].published ? data[0] : data[1] : data[0]) : _data;
    return { data: _data, error };
  }


  /**
 * Search posts by term
 * @param term
 * @returns Observable of search
 */
  async searchPost(term: string): Promise<PostListRequest> {
    let data;
    let error;
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
  }: PostInput = {}): Promise<PostListRequest> {

    let error = null;
    let posts = null;
    let count = null;
    let data = null;

    ({ data, count } = await this.sb.supabase.from('posts').select('*, author!inner(*)', { count: 'exact' }).eq('published', drafts));

    data = data?.map(_d => supabase_to_post(_d));

    return {
      error,
      data,
      count
    };

  }
}
