import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRec } from '@auth/user.model';
import { UserDbService } from '@db/user/user-db.service';
import { environment } from '@env/environment';
import { NavService } from '@nav/nav.service';
import { SchemaService } from '@shared/schema/schema.service';
import { SeoService } from '@shared/seo/seo.service';
import { MarkdownService } from 'ngx-markdown';
import { Observable, of, Subscription } from 'rxjs';
import { Post } from './post.model';
import removeMd from 'remove-markdown';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  preserveWhitespaces: true
})
export class PostComponent implements OnDestroy {

  routeSub!: Subscription;
  post!: Post | null;
  user$: Observable<UserRec | null> = of(null);
  postId!: string;
  slug!: string;

  env: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private us: UserDbService,
    private seo: SeoService,
    public ns: NavService,
    private ms: MarkdownService,
    private schema: SchemaService
  ) {
    this.env = environment;
    this.ns.openLeftNav();
    this.routeSub = this.route.data.subscribe(data => {
      const post = data['post'];
      this.post = post;
      this.meta(post);
    });
    this.user$ = this.ns.isBrowser ? this.us.user$ : of(null);
  }

  meta(r: Post) {
    const did = this.router.url.startsWith('/d');

    // add bread crumbs
    this.ns.setBC(r?.title as string);
    let description = this.ms.parse(r?.content as string);
    description = removeMd(description.substring(0, 125));

    if (did) {
      // don't index drafts page
      this.seo.generateTags({ noIndex: true });
    } else {
      // generate seo tags
      this.seo.generateTags({
        title: r?.title + ' - ' + this.env.title + ' ' + this.env.emoji,
        domain: this.env.title,
        image: r?.image || undefined,
        description,
        user: r?.author.username
      });

      // generate schema
      // todo - create schema service, add full content, use new type within types

      this.schema.setBlogSchema({
        name: r?.title + ' - ' + this.env.title + ' ' + this.env.emoji,
        headline: r?.title,
        author: r?.author.displayName,
        username: r?.author.username,
        authorId: r?.author.id,
        authorURL: `${environment.site}/u/${r?.author.id}/${r?.author.username}`,
        image: r?.image || undefined,
        description,
        articleBody: removeMd(r.content),
        keywords: r?.tags?.join(', '),
        datePublished: new Date(r?.publishedAt).toISOString(),
        dateModified: new Date(!!r.updatedAt ? r.updatedAt : r.createdAt).toISOString(),
        timeRequired: r?.minutes + 'M',
        id: r?.id,
        url: `${environment.site}/p/${r?.id}/${r?.slug}`
      });

      // breadcrumbs
      this.schema.setListSchema([{
        name: "Home",
        url: environment.site,
        image: environment.image,
        id: environment.site,
        description: environment.description
      }, {
        name: r.title,
        url: `${environment.site}/p/${r?.id}/${r?.slug}`,
        image: r.image,
        id: r.id,
        description
      }], true);

      this.schema.generateSchema();
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}
