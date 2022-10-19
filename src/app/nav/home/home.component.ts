import { Component } from '@angular/core';
import { environment } from '@env/environment';
import { NavService } from '@nav/nav.service';
import { DarkModeService } from '@shared/dark-mode/dark-mode.service';
import { SchemaService } from '@shared/schema/schema.service';
import { SeoService } from '@shared/seo/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  tabName = 'new';

  env: any;

  constructor(
    public ns: NavService,
    private seo: SeoService,
    public dm: DarkModeService,
    private schema: SchemaService
  ) {

    this.env = environment;

    this.ns.type = 'new';

    this.ns.resetBC();
    this.ns.openLeftNav();

    this.seo.generateTags({
      feed: true,
      title: this.env.title + ' ' + this.env.emoji,
      description: this.env.description,
      domain: this.env.domain,
      user: this.env.author,
      image: this.env.image
    });

    this.schema.setListSchema([{
      name: "Home",
      url: this.env.site,
      image: this.env.image,
      id: this.env.site,
      description: this.env.description
    }], true);
    this.schema.generateSchema();
  }

  tabChange(index: number) {
    if (index === 1) {
      this.ns.type = 'updated';
      this.tabName = 'updated';
    } else if (index === 2) {
      this.ns.type = 'liked';
      this.tabName = 'liked';
    } else {
      this.ns.type = 'new';
      this.tabName = 'new';
    }
  }
}


