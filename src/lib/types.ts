export interface Post {
  title: string;
  excerpt: string;
  featuredImage: string;
  date: string;
  slug: string;
}

export interface WPPost {
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  slug: string;
  _embedded?: {
    ["wp:featuredmedia"]?: Array<{ source_url: string }>;
  };
  jetpack_featured_media_url?: string;
}

export type Slug = string;

// export type Category = string
export interface Category {
  id: number,
  slug: string,
  name: string
}

export interface Categories {
  id: number;
  name: string;
  slug: string;
}

export interface Tags {
  id: number;
  name: string;
  slug: string;
}