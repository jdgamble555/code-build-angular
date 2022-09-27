import { Injectable } from '@angular/core';
import { DbModule } from '@db/db.module';
import { decode } from '@db/sb-tools';
import { supabase_post, supabase_to_post } from '@db/supabase.types';
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
    const { error, count } = await this.sb.supabase.from(col)
      .select(undefined, { count: 'exact' });
    return { error, count };
  }


  async getPostById(id: string, published = true): Promise<PostRequest> {
    let data: any;
    let error: any;
    const pid = decode(id);

    const db = async (pub: boolean) => await this.sb.supabase.from(pub ? 'posts' : 'drafts')
      .select('*, author!inner(*)').eq('id', pid).limit(1);

    const { count: heartsCount } = await this.sb.supabase.from('hearts').select(undefined, { count: 'exact' }).eq('pid', pid);
    if (!published) {
      ({ data, error } = await db(published));
      if (data.length) {
        return { data: data[0], error };
      }
    }
    ({ data, error } = await db(true));
    data = data.length ? { ...data[0], heartsCount } : undefined;

    // get tags
    const { data: tags, error: _e } = await this.sb.supabase.from('tags').select('name').eq('pid', pid)
      .then((t: any) => ({ data: t.data.map((s: any) => s.name), error }));
    if (_e) {
      console.error(_e);
    }
    data = { ...supabase_to_post(data), tags };
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
    sortField = 'created_at',
    sortDirection = 'desc',
    pageSize = 5,
    authorId,
    page = 1,
    tag,
    uid,
    field,
    drafts = false
  }: PostInput = {}): Promise<PostListRequest> {

    if (sortField === 'updatedAt') {
      sortField = 'updated_at';
    }
    let error = null;
    let count = null;
    let data = null;

    const { from, to } = ((page: number, size: number) => {
      const limit = size ? +size : 3;
      const from = page ? page * limit : 0;
      const to = page ? from + size - 1 : size - 1;
      return { from, to };
    })(page - 1, pageSize);

    let q: any;

    if (sortField === 'heartsCount') {

      // hearts count view query
      q = this.sb.supabase.from('hearts_count')
        .select('*, pid!inner(*, author!inner(*))', { count: 'exact' })
        .order('count', { ascending: sortDirection === 'asc' })
        .range(from, to).then(p => ({
          data: p.data ? p.data.map(_p => _p.pid) : p,
          count: p.count,
          error: p.error
        }));

    } else if (tag) {

      // tag query
      q = this.sb.supabase.from('tags')
        .select('*, pid!inner(*, author!inner(*))', { count: 'exact' })
        .eq('name', tag)
        .order('created_at', { foreignTable: 'pid', ascending: sortDirection === 'asc' })
        .range(from, to)
        .then(p => ({
          data: p.data ? p.data.map(_p => _p.pid) : p,
          count: p.count,
          error: p.error
        }));

    } else {

      // normal query
      q = this.sb.supabase.from(drafts ? 'drafts' : 'posts')
        .select('*, author!inner(*)', { count: 'exact' })
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range(from, to);
    }

    if (authorId) {
      q = q.eq('author.id', decode(authorId));
    }

    ({ data, count } = await q);

    if (count && count > 0) {

      // get hearts count from View
      const q2 = (pid: string) => this.sb.supabase.from('hearts_count').select('*').eq('pid', pid).single();

      // get tags
      const q3 = (pid: string) => this.sb.supabase.from('tags').select('name').eq('pid', pid)
        .then((t: any) => ({ data: t.data.map((s: any) => s.name) }));

      let hearts: any[] = [];
      let tags: any[] = [];

      // translate post, add new count query
      data = data?.map((_d: supabase_post) => {
        hearts.push(q2(_d.id));
        tags.push(q3(_d.id));
        return { ...supabase_to_post(_d) };
      });

      // get all hearts count and tags
      hearts = await Promise.all(hearts);
      tags = await Promise.all(tags);

      // add count to posts
      data = data?.map((_p: any, i: number) => ({ ..._p, heartsCount: hearts[i].data?.count, tags: tags[i].data }));
    }
    return { error, data, count };
  }
}
