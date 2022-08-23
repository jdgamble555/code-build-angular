import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { UserRec } from '@auth/user.model';
import { Post } from '@post/post.model';
import { MarkdownService } from 'ngx-markdown';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private markdownService: MarkdownService,
    @Inject(DOCUMENT) private document: Document
  ) { }
  //
  // User
  //

  getUsername(uid: string): Observable<string | null> {
    return of(null);
  }

  hasUsername(uid: string): Observable<boolean> {
    return of(true);
  }

  validUsername(name: string): Observable<boolean> {
    return of(true);
  }

  async updateUsername(username: string, uid: string, currentUsername?: string): Promise<any> {
    return;
  }

  async createUser(user: UserRec, id: string): Promise<void> {
    return;
  }

  async updateUser(user: any, id: string): Promise<void> {
    return;
  }

  async deleteUser(id: string): Promise<void> {
    return;
  }
  //
  // Posts
  //

  /**
    * Get latest version of post
    * @param id
    * @returns
    */
  getPostData(id: string): Observable<Post> {
    return of({});
  }
  /**
   * Edit an existing post / create new post
   * @param id doc id
   * @param data doc data
   * @returns void
   */
  async setPost(data: Post, id = this.getId(), publish = false): Promise<string> {
    return '';
  }
  /**
   * Delete Post by ID
   * @param id
   */
  async deletePost(id: string, uid: string): Promise<void> {
    return;
  }
  //
  // Images
  //

  /**
   * Add image to post doc
   * @param id
   * @param url
   */
  async addPostImage(id: string, url: string): Promise<void> {
    return;
  }
  /**
   * Delete image from post doc
   * @param id
   * @param url
   */
  async deletePostImage(id: string, url: string): Promise<void> {
    return;
  }

  /**
  * Generates an id for a new firestore doc
  * @returns
  */
  getId(): string {
    return '';
  }

  //
  // Search Index
  //

  /**
   * Create Post Index
   * @param id
   * @param data
   */
  async indexPost(id: string, data: any): Promise<void> {
    return;
  }

}
