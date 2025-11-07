import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../services/blog.service';
import type { Blog } from '../types';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';
import { formatDate } from '../utils/helpers';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        const fetched = await blogService.getBlogBySlug(slug);
        setBlog(fetched);
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!blog) return <div className="p-8">Blog not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/')} className="mb-6 text-blue-600 hover:text-blue-800">← Back to Home</button>

        <article className="bg-white rounded-lg shadow-lg p-8">
          {blog.image?.url && (
            <img src={blog.image.url} alt={blog.title} className="w-full h-96 object-cover rounded-lg mb-6" />
          )}

          <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>

          <div className="flex items-center text-sm text-gray-600 mb-6">
            <span>{blog.author?.name}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(blog.publishDate)}</span>
            <span className="mx-2">•</span>
            <span>{blog.views} views</span>
          </div>

          <div className="prose max-w-none text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content || '') }} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage;
