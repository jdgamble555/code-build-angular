export type Role  = 'admin' | 'editor' | 'author' | 'subscriber';

export interface UserRec {
  uid?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  role?: Role;
  username?: string;
  heartsCount?: number;
  draftsCount?: number;
  postsCount?: number;
  bookmarksCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  emailVerified?: boolean;
  providers?: string[];
};

export interface AuthAction {
  reAuth?: boolean | null;
  isNew?: boolean | null;
  isConfirmed?: boolean | null;
  error: any;
}

export interface UserRequest {
  error: any,
  data?: UserRec | null;
  exists?: boolean | null;
}
