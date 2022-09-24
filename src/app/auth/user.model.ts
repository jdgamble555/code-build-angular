export type Role = 'admin' | 'editor' | 'author' | 'subscriber';

export interface UserRec {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  providers: string[];
  createdAt: Date;
  updatedAt?: Date;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  username?: string;
  heartsCount?: number;
  draftsCount?: number;
  postsCount?: number;
  bookmarksCount?: number;
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
