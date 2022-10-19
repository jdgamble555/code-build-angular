import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  private json: any = [];

  constructor(
    @Inject(DOCUMENT) private doc: Document
  ) { }

  setBlogSchema({
    headline = '',
    author = '',
    description = '',
    image = '',
    keywords = '',
    datePublished = '',
    dateModified = '',
    timeRequired = '',
    id = '',
    url = '',
    authorURL = '',
    username = '',
    authorId = '',
    articleBody = '',
  }): void {

    const s = {
      "@context": "https://schema.org/",
      "@type": "BlogPosting",
      "headline": headline,
      "author": {
        "@type": "Person",
        "name": author,
        "url": authorURL,
        "alternateName": username,
        "identifier": authorId
      },
      "datePublished": datePublished,
      "dateModified": dateModified,
      "articleBody": articleBody,
      "description": description,
      "image": image,
      "keywords": keywords,
      "timeRequired": timeRequired,
      "identifier": id,
      "url": url,
      /*"publisher": {
        "@type": "Organization",
        "name": "Code.Build"
      }*/
    };

    this.json.push(s);
  }

  setListSchema(items: {
    url: string,
    name: string,
    image?: string,
    description: string,
    id: string
  }[], breadcrumb = false): void {

    // generate summary schema
    const list: any[] = [];

    for (const i in items) {
      let l: any = {
        "@type": "ListItem",
        "position": Number(i) + 1,
        "name": items[i].name,
        "url": items[i].url,
        "image": items[i].image,
        "identifier": items[i].id,
        "description": items[i].description
      };
      if (!l.image) {
        let { image, ...newl } = l;
        l = newl;
      }
      list.push(l);
    }

    const s = {
      "@context": "https://schema.org/",
      "@type": breadcrumb ? "BreadcrumbList" : "ItemList",
      "itemListElement": list
    };

    this.json.push(s);
  }

  generateSchema() {

    const s = this.json.length === 1 ? this.json[0] : this.json;

    // Generate or Update existing json-ld script tag
    const type = 'application/ld+json';
    const script = this.doc.querySelector(`script[type="${type}"]`) as HTMLScriptElement;
    if (script) {
      script.innerHTML = JSON.stringify(s);
    } else {
      const element = this.doc.createElement('script') as HTMLScriptElement;
      element.type = type;
      element.innerHTML = JSON.stringify(s);
      const head = this.doc.getElementsByTagName('head')[0];
      head.appendChild(element);
    }
    this.json = [];
  }
}
