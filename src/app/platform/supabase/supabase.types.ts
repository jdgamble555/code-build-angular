import { Role, UserRec } from "@auth/user.model";
import { Post } from "@post/post.model";
import { User } from "@supabase/supabase-js";

// USER

export interface supabase_user {
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    photo_url?: string;
    username?: string;
    display_name?: string;
    email?: string;
    role?: Role;
    phone_number?: string;
    emailVerified?: boolean;
};

export const supabase_to_user_rec = (user: supabase_user): UserRec => ({
    uid: user?.id,
    photoURL: user?.photo_url,
    phoneNumber: user?.phone_number,
    displayName: user?.display_name,
    createdAt: user?.created_at,
    updatedAt: user?.updated_at,
    username: user?.username,
    email: user?.email,
    role: user?.role
});

export const user_rec_to_supabase = (user_rec: UserRec): supabase_user => ({
    id: user_rec?.uid,
    created_at: user_rec.createdAt,
    updated_at: user_rec.updatedAt,
    display_name: user_rec.displayName,
    photo_url: user_rec.photoURL,
    phone_number: user_rec.phoneNumber,
    email: user_rec.email,
    role: user_rec.role,
    username: user_rec.username,
    emailVerified: user_rec.emailVerified
});

export const auth_to_user_rec = (u: User): UserRec => ({
    uid: u.id,
    email: u.email,
    emailVerified: !!u.email_confirmed_at,
    photoURL: u?.user_metadata['avatar_url'],
    phoneNumber: u.phone,
    displayName: u?.user_metadata['full_name']
});

// POST

export interface supabase_post {
    published?: boolean;
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    title?: string;
    author?: string;
    content?: string;
    image?: string;
    slug?: string;
    minutes?: string;
    imageUploads?: string[];
};

export const supabase_to_post = (p: supabase_post): Post => ({
    ...p,
    authorId: p.author,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
});

export const post_to_supabase = (p: Post): supabase_post => ({
    published: p.published,
    id: p.id,
    title: p.title,
    content: p.content,
    image: p.image,
    slug: p.slug,
    minutes: p.minutes,
    imageUploads: p.imageUploads,
    author: p.authorId,
    created_at: p.createdAt,
    updated_at: p.updatedAt
});