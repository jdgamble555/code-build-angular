import { Injectable } from '@angular/core';
import { DbModule } from '@db/db.module';
import { Tag } from '@post/post.model';

@Injectable({
  providedIn: DbModule
})
export class TagDbService {

  constructor() { }

  async getTags(): Promise<{ data: Tag[] | null, error: any }> {
    let error = null;
    let data = null;
    return { data, error };
  }

}
