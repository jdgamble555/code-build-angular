import { Component, Inject, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { UserRec } from '@auth/user.model';
import { Post, PostInput, PostType } from '@post/post.model';
import { SeoService } from '@shared/seo/seo.service';
import { NavService } from '@nav/nav.service';
import { PostDbService } from '@db/post/post-db.service';
import { UserDbService } from '@db/user/user-db.service';
import { DarkModeService } from '@shared/dark-mode/dark-mode.service';
import { SchemaService } from '@shared/schema/schema.service';
import { MarkdownService } from 'ngx-markdown';
import removeMd from 'remove-markdown';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnDestroy {

  user$: Observable<UserRec | null> = of(null);
  posts?: Post[];
  total?: number;
  input: PostInput = {};
  username!: string;
  loading = false;
  env: any;
  private routeSub!: Subscription;

  constructor(
    public ps: PostDbService,
    private us: UserDbService,
    private route: ActivatedRoute,
    private router: Router,
    private ms: MarkdownService,
    public ns: NavService,
    public dm: DarkModeService,
    private seo: SeoService,
    private schema: SchemaService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.env = environment;
    this.user$ = this.ns.isBrowser ? this.us.user$ : of(null);
    this.routeSub = this.route.data
      .subscribe(async (p) => this.loadPage(p));
  }

  async loadPage(p: any): Promise<void> {

    this.ns.openLeftNav();
    this.ns.resetBC();

    let count: number | undefined = p.count;
    let data: Post[] | undefined = p.posts;

    // dynamic routes not ssr
    const tag = this.route.snapshot.params['tag'];
    const authorId = this.route.snapshot.params['uid'];
    this.username = this.route.snapshot.params['username'];
    this.input.tag = tag ?? this.input.tag;
    this.input.authorId = authorId ?? this.input.authorId;

    // set dynamic types
    const type = this.ns.type;

    // handle input types
    switch (type) {
      case 'new':
        this.total = count;
        this.posts = data;
        this.meta(type);
        return;
      //break;
      case 'tag':
        this.input.tag = tag;
        this.total = count;
        this.posts = data;
        this.meta(type);
        return;
      //break;
      case 'user':
        this.input.authorId = authorId;
        this.total = count;
        this.posts = data;
        this.meta(type);
        return;
      //break;
      case 'bookmarks':
        this.input.field = 'bookmarks';
        break;
      case 'liked':
        this.input.sortField = 'heartsCount';
        break;
      case 'updated':
        this.input.sortField = 'updatedAt';
        break;
      case 'drafts':
        this.input.drafts = true;
        break;
    }

    // grab posts
    this.loading = true;
    ({ count, data } = await this.ps.getPosts(this.input));
    this.loading = false;

    if (count && data) {
      this.total = count;
      this.posts = data;
    }
    this.meta(type);
  }

  async pageChange(event: PageEvent): Promise<void> {

    // pages
    const paging = {
      page: event.pageIndex + 1,
      pageSize: event.pageSize
    };
    this.loading = true;
    const { data, count, error } = await this.ps.getPosts({
      ...this.input,
      ...paging
    });
    this.loading = false;

    if (error) {
      console.error(error);
    }

    this.total = count;
    this.posts = data;

    // scroll to top
    this.doc.defaultView?.scrollTo(0, 0);
  }

  meta(type: PostType) {

    const username = this.username;
    const posts = this.posts;
    const url = this.router.url;
    const isDash = url === '/dashboard';

    if (isDash) {
      this.ns.addTitle('Dashboard');
    }

    // meta data
    switch (type) {
      case 'bookmarks':
        this.ns.addBC('Bookmarks');
        break;
      case 'tag':
        const tag = this.input.tag;
        const uTag = tag?.charAt(0).toUpperCase() + tag!.slice(1);
        this.ns.setBC(uTag);
        this.seo.generateTags({
          title: uTag + ' - ' + this.env.title + ' ' + this.env.emoji,
          description: uTag + ' content at ' + this.env.title,
          domain: this.env.domain,
          user: this.env.author,
          image: this.env.image
        });
        break;
      case 'user':
        isDash
          ? this.ns.addBC('Posts')
          : (username && this.ns.addTitle(username));
        this.seo.generateTags({
          title: username + ' - ' + this.env.title + ' ' + this.env.emoji,
          description: username + ' content at ' + this.env.title,
          domain: this.env.domain,
          user: this.env.author,
          image: this.env.image
        });
        break;
      case 'liked':
        break;
      case 'updated':
        break;
      case 'drafts':
        this.ns.addBC('Drafts');
        break;
      default:
        this.seo.generateTags({
          title: this.env.title + ' ' + this.env.emoji
        });
        this.ns.resetBC();
        break;
    }

    if (posts && posts.length > 0) {
      const items = posts.map((r) => {
        let description = this.ms.parse(r?.content as string);
        description = removeMd(description.substring(0, 125));
        
        return {
          url: `${environment.site}/p/${r?.id}/${r?.slug}`,
          name: r.title + ' - ' + this.env.title + ' ' + this.env.emoji,
          image: r.image,
          description,
          id: r.id
        };
      });
      this.schema.setListSchema(items);
      this.schema.generateSchema();
    }
  }

  ngOnDestroy(): void {
    // don't use template async for change detection after login
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}
