import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { PostEditModule } from '@db/post-edit.module';
import { post_to_supabase } from '@db/supabase.types';
import { Post, PostRequest } from '@post/post.model';
import { MarkdownService } from 'ngx-markdown';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: PostEditModule
})
export class PostEditService {

  constructor(
    private markdownService: MarkdownService,
    @Inject(DOCUMENT) private document: Document,
    private sb: SupabaseService
  ) { }

  /**
   * Edit an existing post / create new post
   * @param id doc id
   * @param data doc data
   * @returns void
   */
  async setPost(data: Post, id: string | undefined = undefined, published = false): Promise<PostRequest> {
    // todo - figure out how to get rid of getId() and possibly enable images in UI normally

    if (published && id) {
      const { error } = await this.deletePost(id);
      if (error) {
        console.error(error);
      }
    }
    const _data = post_to_supabase({ ...data, published });
    const { id: _tmp, ...new_data  } = _data;
    const { error, data: _d } = await this.sb.supabase.from('posts').upsert(new_data).select().single();
    return { error, data: _d };
  }
  /**
   * Delete Post by ID
   * @param id
   */
  async deletePost(id: string, published = true): Promise<PostRequest> {
    const { error } = await this.sb.supabase.from('posts').delete().eq('id', id).eq('published', published);
    return { error };
  }
  //
  // Images
  //

  /**
   * Add image to post doc
   * @param id
   * @param url
   */
  async addPostImage(id: string, url: string): Promise<PostRequest> {
    let error = null;
    return { error };
  }
  /**
   * Delete image from post doc
   * @param id
   * @param url
   */
  async deletePostImage(id: string, url: string): Promise<PostRequest> {
    let error = null;
    return { error };
  }

  //
  // Search Index
  //

  /**
   * Create Post Index
   * @param id
   * @param data
   */
  async indexPost(id: string, data: any): Promise<PostRequest> {
    let error = null;
    return { error };
  }
}
