import { Injectable } from '@angular/core';
import { UserRec } from '@auth/user.model';
import { Post, Tag } from '@post/post.model';
import { combineLatest, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
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
    this.userRec = this.auth.user$.pipe(
      switchMap((user: any | null) =>
        user
          ? this.getUser(user.uid)
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
  //
  // User
  //

  /**
   * Get user document
   * @param id
   * @returns
   */
  getUser(id: string): Observable<any> {
    return of(null);
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
