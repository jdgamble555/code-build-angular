import { encode } from '@db/sb-tools';
import { supabase } from '@db/supabase.sitemap';
import { environment } from '@env/environment';
import type { Response } from 'express';
import { SitemapStream } from 'sitemap';
import { createGzip } from 'zlib';

export const sitemap = async ({ }, res: Response) => {

  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");

  try {
    const sitemapStream = new SitemapStream({
      hostname: environment.site,
      xmlns: {
        news: false,
        xhtml: true,
        image: true,
        video: false
      },
      xslUrl: 'sitemap.xsl'
    });
    const pipeline = sitemapStream.pipe(createGzip());

    let lastmod = new Date(1 - 1 - 2000);

    // todo - separate into different files
    // todo - put supabase code into separate file

    // post pages
    const { data, error } = await supabase.from('posts').select('*').lte('published_at', new Date().toISOString());
    if (error) {
      console.error(error);
    }
    data?.forEach((doc) => {

      const date = new Date(doc['updated_at'] ?? doc['published_at']);
      const pid = encode(doc.id);

      // set date for site last updated
      if (lastmod < date) {
        lastmod = date;
      }

      sitemapStream.write({
        lastmod: date.toISOString(),
        url: `p/${pid}/${doc.slug}`,
        img: doc.image
      });

    });

    // user pages
    const { data: d3, error: e3 } = await supabase.from('profiles').select('*');
    if (e3) {
      console.error(e3);
    }
    if (d3) {
      for (const doc of d3) {
        const uid = encode(doc.id);
        const { data: d4, error: e4 } = await supabase.from('posts').select('updated_at').eq('author', doc.id).order('updated_at', { ascending: false }).limit(1);
        if (e4) {
          console.error(d4);
        }
        const date = d4 ? new Date(d4[0]['updated_at']) : new Date(doc['updated_at']);
        sitemapStream.write({
          lastmod: date.toISOString(),
          url: `u/${uid}/${doc.username}`,
          img: doc['photo_url']
        });
      }
    }

    // tag pages
    const { data: d2, error: e2 } = await supabase.from('tags_latest').select('*');
    if (e2) {
      console.error(e2);
    }
    if (d2) {
      for (const doc of d2) {

        const date = new Date(doc['updated_at']);

        sitemapStream.write({
          lastmod: date.toISOString(),
          url: `t/${doc.name}`
        });
      }
    }

    // homepage
    sitemapStream.write({
      lastmod,
      url: environment.site
    });

    sitemapStream.end();
    pipeline.pipe(res).on("error", (error: Error) => {
      throw error;
    });

  } catch (e: any) {
    console.error(e);
    res.status(500).end();
  }
};

// https://www.kgajera.com/blog/dynamic-sitemap-for-angular-universal-and-contentful/