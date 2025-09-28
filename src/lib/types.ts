export interface Post {
  title: string;
  excerpt: string;
  featuredImage: string;
  date: string;
  slug: string;
}

export type Slug = string;

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