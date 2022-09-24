export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string | null;
          updated_at: string | null;
          photo_url: string | null;
          username: string | null;
          display_name: string | null;
          phone_number: number | null;
          role: Database["public"]["Enums"]["roles"];
        };
        Insert: {
          id: string;
          created_at?: string | null;
          updated_at?: string | null;
          photo_url?: string | null;
          username?: string | null;
          display_name?: string | null;
          phone_number?: number | null;
          role?: Database["public"]["Enums"]["roles"];
        };
        Update: {
          id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          photo_url?: string | null;
          username?: string | null;
          display_name?: string | null;
          phone_number?: number | null;
          role?: Database["public"]["Enums"]["roles"];
        };
      };
      topics: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          name: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          name: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          name?: string;
        };
      };
      resource_topic: {
        Row: {
          resource: number;
          topic: number;
          created_at: string | null;
        };
        Insert: {
          resource?: number;
          topic: number;
          created_at?: string | null;
        };
        Update: {
          resource?: number;
          topic?: number;
          created_at?: string | null;
        };
      };
      resources: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          title: string;
          url: string;
          author: string;
          description: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          title: string;
          url: string;
          author?: string;
          description?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          title?: string;
          url?: string;
          author?: string;
          description?: string | null;
        };
      };
      posts: {
        Row: {
          created_at: string | null;
          updated_at: string | null;
          title: string | null;
          author: string | null;
          content: string | null;
          image: string | null;
          slug: string | null;
          minutes: string | null;
          published: boolean;
          imageUploads: string[] | null;
          id: string;
        };
        Insert: {
          created_at?: string | null;
          updated_at?: string | null;
          title?: string | null;
          author?: string | null;
          content?: string | null;
          image?: string | null;
          slug?: string | null;
          minutes?: string | null;
          published?: boolean;
          imageUploads?: string[] | null;
          id: string;
        };
        Update: {
          created_at?: string | null;
          updated_at?: string | null;
          title?: string | null;
          author?: string | null;
          content?: string | null;
          image?: string | null;
          slug?: string | null;
          minutes?: string | null;
          published?: boolean;
          imageUploads?: string[] | null;
          id?: string;
        };
      };
    };
    Views: {
      user_view: {
        Row: {
          display_name: string | null;
          photo_url: string | null;
        };
        Insert: {
          display_name?: string | null;
          photo_url?: string | null;
        };
        Update: {
          display_name?: string | null;
          photo_url?: string | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      roles: "ADMIN" | "EDITOR" | "USER";
    };
  };
}

