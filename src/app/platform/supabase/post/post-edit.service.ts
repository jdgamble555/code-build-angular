import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { PostEditModule } from '@db/post-edit.module';
import { decode } from '@db/sb-tools';
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

    id = id ? decode(id) : undefined;

    // update post
    const new_data: any = {
      title: data.title,
      content: data.content,
      image: data.image,
      slug: data.slug,
      minutes: data.minutes,
      author: decode(data.author.id),
      imageUploads: data.imageUploads,
      created_at: data.createdAt,
      updated_at: data.updatedAt
    };

    // add post
    const { error, data: _d } = await this.sb.supabase
      .from(published ? 'posts' : 'drafts')
      .upsert(id ? { ...new_data, id } : new_data)
      .select()
      .single();

    if (published && id && !error) {

      // remove all tags
      const { error: _e2 } = await this.sb.supabase.from('tags').delete().eq('pid', id);
      if (_e2) {
        console.error(_e2);
      }

      // add tags
      const { error: _e1, data: _d } = await this.sb.supabase
        .from('tags').upsert(data.tags.map((_t: string[]) => ({ pid: id, name: _t })));
      if (_e1) {
        console.error(_e1);
      }

      // remove draft
      const { error: _e } = await this.deletePost(id, false);
      if (_e) {
        console.error(_e);
      }
    }
    return { error, data: _d };
  }
  /**
   * Delete Post by ID
   * @param id
   */
  async deletePost(id: string, published = true): Promise<PostRequest> {
    const { error } = await this.sb.supabase.from(published ? 'posts' : 'drafts').delete().eq('id', id);
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
