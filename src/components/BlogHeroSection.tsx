import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../services/blog.service';
import { Blog } from '../types';
import { formatDate } from '../utils/helpers';

export const BlogHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const featuredBlogs = await blogService.getFeaturedBlogs();
        setBlogs(featuredBlogs);
      } catch (error) {
        console.error('Failed to load blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  // Auto-rotate featured blog
  useEffect(() => {
    if (blogs.length === 0) return;
    
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % blogs.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [blogs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const featuredBlog = blogs[featuredIndex];

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 lg:mb-4">
            Latest from Our Blog
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-indigo-200 max-w-2xl mx-auto">
            Stay updated with tips, guides, and news about classified ads
          </p>
        </div>

        {/* Featured Blog Card */}
        {featuredBlog && (
          <div className="max-w-5xl mx-auto mb-8 lg:mb-12">
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20 cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
              onClick={() => navigate(`/blog/${featuredBlog.slug}`)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 lg:h-auto">
                  {featuredBlog.image?.url ? (
                    <img
                      src={featuredBlog.image.url}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-24 h-24 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  )}
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      ✨ Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-indigo-300 text-sm">{featuredBlog.category}</span>
                    <span className="text-white/50">•</span>
                    <span className="text-white/70 text-sm">{formatDate(featuredBlog.publishDate)}</span>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 line-clamp-2">
                    {featuredBlog.title}
                  </h2>
                  
                  <p className="text-base lg:text-lg text-white/80 mb-6 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                      Read Full Article →
                    </button>
                    
                    <div className="flex items-center text-sm text-white/70">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      {featuredBlog.views} views
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots indicator */}
            {blogs.length > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {blogs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFeaturedIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === featuredIndex 
                        ? 'w-8 bg-white' 
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other Blogs Grid */}
        {blogs.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-12">
            {blogs.filter((_, idx) => idx !== featuredIndex).map((blog, index) => (
              <div
                key={blog._id}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 cursor-pointer hover:bg-white/20 transition group"
              >
                {/* Small image */}
                <div className="relative h-40">
                  {blog.image?.url ? (
                    <img
                      src={blog.image.url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      index === 0 ? 'bg-green-400 text-green-900' : 'bg-purple-400 text-purple-900'
                    }`}>
                      {index === 0 ? 'Latest' : 'Upcoming'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-base lg:text-lg mb-2 line-clamp-2 group-hover:text-yellow-300 transition">
                    {blog.title}
                  </h3>
                  
                  <p className="text-sm text-white/70 mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{formatDate(blog.publishDate)}</span>
                    <span className="text-yellow-300 font-semibold group-hover:underline">
                      Read More →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scroll Down Hint - Animated */}
        <div className="text-center animate-bounce">
          <p className="text-lg lg:text-xl text-white/90 mb-4 font-semibold">
            Scroll down to explore classified ads
          </p>
          <svg className="w-8 h-8 mx-auto text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};
