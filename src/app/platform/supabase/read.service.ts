import { Injectable } from '@angular/core';
import { UserRec } from '@auth/user.model';
import { Post, Tag } from '@post/post.model';
import { User } from '@supabase/supabase-js';
import { Observable, of, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ReadService {

  userRec: Observable<UserRec | null>;

  constructor(
    private auth: AuthService
  ) {

    // get user doc if logged in
    this.userRec = this.userSub();
  }

  subRecord(col: string, field: string, value: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.auth.supabase.from(col).select('*').eq(field, value).single().then((payload: any) => {
        subscriber.next(payload.data);
      });
      return this.auth.supabase.from(`${col}:${field}=eq.${value}`).on('*', (payload: any) => {
        subscriber.next(payload.new);
      }).subscribe();
    });
  }

  //
  // User
  //

  async getUser(): Promise<UserRec | null> {
    const id = this.auth.supabase.auth.user()?.id;
    const { data, error } = await this.auth.supabase.from<UserRec>('profiles').select('*').eq('id', id).single();
    return data ? data : null;
  }

  userSub(): Observable<UserRec | null> {
    return this.auth.user$.pipe(
      switchMap((user: User | null) =>
        user
          ? this.subRecord('profiles', 'id', user?.id)
          : of(null)
      )
    );
  }

  /**
   * Get a total count for the collection
   * @param col - Collection Path
   * @returns - total count
   */
  getTotal(col: string): Observable<string> {
    return of('');
  }
  /**
   * Get all tags and their count
   * @returns tags
   */
  getTags(): Observable<Tag[]> {
    return of([]);
  }
  /**
   * Get tag count from tag doc
   * @param t - tag
   * @returns
   */
  getTagTotal(t: string): Observable<string> {
    return of('');
  }

  /**
   * Return total number of docs by a user
   * @param uid - user id
   * @param col - column
   * @returns
   */
  getUserTotal(uid: string, col: string): Observable<string> {
    return of('');
  }

  //
  // Hearts and Bookmarks
  //

  async actionPost(postId: string, userId: string, action: string): Promise<void> {
    return;
  }

  async unActionPost(postId: string, userId: string, action: string): Promise<void> {
    return;
  }

  getAction(id: string, uid: string, action: string): Observable<boolean> {
    return of(true);
  }
  //
  // Posts
  //

  /**
  * Search posts by term
  * @param term
  * @returns Observable of search
  */
  searchPost(term: string): Observable<Post[]> {
    return of([]);
  }
  /**
   * Gets all posts
   * @returns posts joined by authorDoc
   */
  getPosts({
    sortField = 'createdAt',
    sortDirection = 'desc',
    pageSize = 5,
    authorId,
    page = 1,
    tag,
    uid,
    field,
    drafts = false
  }: {
    sortField?: string,
    sortDirection?: 'desc' | 'asc',
    tag?: string,
    uid?: string,
    authorId?: string,
    field?: string,
    page?: number,
    pageSize?: number,
    drafts?: boolean
  } = {}): {
    count: Observable<string>,
    posts: Observable<Post[]>
  } {

    const _limit = page * pageSize;
    const _offset = (page - 1) * pageSize;
    return { count: of(''), posts: of([]) }
  }


  /**
   * Get Post by post id
   * @param id post id
   * @returns post observable joined by author doc
   */
  getPostById(id: string, user?: UserRec): Observable<Post | null> {
    return of(null);
  }
  /**
   * SEO by Post ID
   * @param id
   * @returns
   */
  async seoPostById(id: string): Promise<Post | undefined> {
    return;
  }
  /**
   * Get post by slug, use is mainly for backwards compatibility
   * @param slug
   * @returns
   */
  getPostBySlug(slug: string): Observable<Post> {
    return of({});
  }
}
