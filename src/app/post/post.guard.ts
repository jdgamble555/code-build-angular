import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { PostDbService } from '@db/post/post-db.service';
import { NavService } from '@nav/nav.service';
import { StateService } from '@shared/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class PostGuard implements CanActivate {

  constructor(
    private ps: PostDbService,
    private router: Router,
    private state: StateService,
    private ns: NavService
  ) { }

  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {

    let slug = next.paramMap.get('slug');
    let pid = next.paramMap.get('pid');
    const did = next.paramMap.get('did');
    let error = null;
    let data;

    const isDraft = !!did;

    if (isDraft) {
      this.ns.type = 'drafts';
      pid = did;
    }

    if (pid) {

      this.ns.type = 'new';

      ({ data, error } = await this.state.loadState('post', this.ps.getPostById(pid, !isDraft)));
      if (error) {
        console.error(error);
      }

      // handle bad slugs due to renamed posts
      if (slug && data && !Array.isArray(data) && (data.slug === slug)) {

        // use guard as a resolver to pass data to component
        next.data = { ...next.data, post: data };
        return true;
      }

      // get correct slug
      if (data && data.slug) {
        slug = data.slug;
      }
    }
    // redirect to correct location, or go home
    data
      ? this.router.navigate(['/p', data.id, slug])
      : this.router.navigate(['/']);

    return false;
  }
}
