import { UserRec } from "@auth/user.model";

export type PostType = 'bookmarks' | 'liked' | 'updated' | 'user' | 'drafts' | 'new' | 'tag' | null;

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  minutes: string;
  author: UserRec;
  createdAt: Date | any;
  updatedAt?: Date | any;
  image?: string;
  imageTmp?: string;
  imageUploads?: string[];
  tags?: any;
  heartsCount?: number;
  bookmarksCount?: number;
  draftsCount?: number;
  liked?: boolean;
  saved?: boolean;
}

export interface Tag {
  name?: string;
  count?: number;
}

export interface PostInput {
  sortField?: string,
  sortDirection?: 'desc' | 'asc',
  tag?: string,
  uid?: string,
  authorId?: string,
  field?: string,
  page?: number,
  pageSize?: number,
  drafts?: boolean
};

export interface PostRequest {
  error: any,
  data?: Post,
  exists?: boolean,
  count?: number
};

export interface PostListRequest {
  error: any,
  data?: Post[],
  exists?: boolean,
  count?: number
};


