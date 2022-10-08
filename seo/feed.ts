import { encode } from '@db/sb-tools';
import { supabase } from '@db/supabase.sitemap';
import { environment } from '@env/environment';
import type { Response } from 'express';
import { Feed } from "feed";

// todo - put everything in environment file and seo supabase file

export const feed = async ({ }, res: Response) => {

    res.header("Content-Type", "application/xml");

    const feed = new Feed({
        title: environment.title,
        description: environment.description,
        id: "http://code.build/",
        link: "http://code.build/",
        language: "en",
        favicon: "https://code.build/favicon.ico",
        copyright: "©2022 Code.Build",
        feedLinks: {
            atom: "https://code.build/feed"
        },
        author: {
            name: "Jonathan Gamble",
            link: "http://code.build/u/86qJ3nXSvhBPUbmdaMwUeb/jdgamble555"
        }
    });


    // post pages
    const { data: posts, error } = await supabase.from('posts_hearts_tags').select('*, author(*)').lte('published_at', new Date().toISOString());;
    if (error) {
        console.error(error);
    }

    posts!.forEach(post => {
        const tags: string[] = JSON.parse(JSON.stringify(post.tags));
        feed.addItem({
            title: post.title,
            id: encode(post.id),
            link: `https://code.build/p/${encode(post.id)}/${post.slug}`,
            // description: post.description,
            content: post.content,
            date: new Date(post['published_at']),
            image: post.image,
            category: tags.map((t) => ({ name: t })) as any,
            author: [{
                name: post.author.display_name,
                link: "https://code.build/u/" + encode(post.author.id) + '/' + post.author.username
            }]
        });
    });

    try {
        res.status(200).send(feed.atom1());
    } catch (e: any) {
        console.error(e);
        res.status(500).end();
    }
};