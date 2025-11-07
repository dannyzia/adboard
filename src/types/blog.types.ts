export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  image?: {
    url: string;
    publicId?: string;
  };
  category: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  views: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
