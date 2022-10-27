import { Injectable } from '@angular/core';
import { PostDbService } from '@db/post/post-db.service';
import { PostRequest } from '@post/post.model';
import { StateService } from '@shared/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class LeftnavService {

  // service to preload post count

  postTotal?: number;

  constructor(
    private state: StateService,
    private ps: PostDbService
  ) { }

  // preload post count
  async preloadPostCount(): Promise<void> {
    this.postTotal = await this.state.loadState('post-count', this._getPostCount());
  }

  private async _getPostCount(): Promise<number | undefined> {
    const { count, error } = await this.ps.getTotal('posts');
    if (error) {
      console.error(error);
    }
    return count || undefined;
  }
}
