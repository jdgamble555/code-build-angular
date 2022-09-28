import { Injectable } from '@angular/core';
import { DbModule } from '@db/db.module';
import { decode } from '@db/sb-tools';
import { supabase_to_post } from '@db/supabase.types';
import { PostInput, PostListRequest, PostRequest } from '@post/post.model';
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
    const { error, count } = await this.sb.supabase.from(col)
      .select(undefined, { count: 'exact' });
    return { error, count };
  }

  async getPostById(id: string, published = true): Promise<PostRequest> {
    const pid = decode(id);
    let error: any;
    let data: any;

    ({ data, error } = await this.sb.supabase.from(published ? 'posts_hearts_tags' : 'drafts')
      .select('*, author!inner(*)').eq('id', pid).limit(1));
    if (error) {
      console.error(error);
    }
    data = data?.length ? supabase_to_post(data[0]) : undefined;
    return { data, error };
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
    authorId,
    tag,
    sortField = 'created_at',
    sortDirection = 'desc',
    pageSize = 5,
    page = 1,
    drafts = false
  }: PostInput = {}): Promise<PostListRequest> {

    const _sorts: any = {
      'updatedAt': 'updated_at',
      'createdAt': 'created_at',
      'heartsCount': 'hearts_count'
    };

    sortField = _sorts[sortField] ?? sortField;

    let error = null;
    let count = null;
    let data = null;

    const { from, to } = ((page: number, size: number) => {
      const limit = size ? +size : 3;
      const from = page ? page * limit : 0;
      const to = page ? from + size - 1 : size - 1;
      return { from, to };
    })(page - 1, pageSize);

    let q = this.sb.supabase.from(drafts ? 'drafts' : 'posts_hearts_tags')
      .select('*, author!inner(*)', { count: 'exact' });

    if (tag) {

      // tag query
      q = q.contains('tags', [tag]);

    } else if (authorId) {

      // author query
      q = q.eq('author.id', decode(authorId));
    }

    // get results
    ({ data, count } = await q.order(sortField, { ascending: sortDirection === 'asc' })
      .range(from, to));

    if (count && count > 0) {

      // translate results
      data = data?.map((_p: any) => supabase_to_post(_p));
    }
    return { error, data, count };
  }
}
