import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
// Lazy-load ReactQuill to avoid bundling/quill issues during SSR/hydration
const ReactQuill = lazy(() => import('react-quill'));

// Simple ErrorBoundary to catch ReactQuill load/runtime errors and show a safe textarea fallback.
class EditorErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: (props: { onChange: (v: string) => void; value: string }) => React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Editor failed to load or threw an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback({ onChange: this.props.onChange, value: this.props.value });
    }
    return this.props.children;
  }
}
import { uploadService } from '../services/upload.service';
import { AdminLayout } from '../components/layout/AdminLayout';
import { blogService } from '../services/blog.service';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/ToastContext';

export const AdminBlogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState<any>({
    _id: undefined,
    title: '',
    excerpt: '',
    content: '',
    category: 'Tips',
    status: 'draft',
    publishDate: new Date().toISOString().slice(0, 16),
    image: { url: '' }
  });

  // Upload helper used by the Quill image handler
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const res = await uploadService.uploadImage(file);
      return res.url;
    } catch (err) {
      console.error('Image upload failed', err);
      throw err;
    }
  };

  // Quill modules (must call hooks unconditionally to preserve hook order)
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [
          'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
          { 'list': 'ordered' }, { 'list': 'bullet' }, 'link', 'image', 'clean'
        ]
      ],
      handlers: {
        image: function(this: any) {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files && input.files[0];
            if (!file) return;

            const range = this.quill.getSelection(true) || { index: this.quill.getLength(), length: 0 };
            const placeholderText = '📤 Uploading image...';
            // Insert placeholder and keep its length so we can delete it later
            this.quill.insertText(range.index, placeholderText);

            try {
              const imageUrl = await (async (f: File) => await handleImageUpload(f))(file);
              // Remove placeholder
              this.quill.deleteText(range.index, placeholderText.length);
              // Insert uploaded image
              this.quill.insertEmbed(range.index, 'image', imageUrl);
              this.quill.setSelection(range.index + 1);
            } catch (err) {
              // Remove placeholder and show failure text
              this.quill.deleteText(range.index, placeholderText.length);
              this.quill.insertText(range.index, '❌ Upload failed');
            }
          };
        }
      }
    }
  }), []);

  // admin auth removed; no gating

  useEffect(() => {
    // Load blogs on mount (no admin gating)
    loadBlogs();
    // mark client so we only render ReactQuill on the client
    setIsClient(true);
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data || []);
    } catch (error) {
      console.error('Failed to load blogs:', error);
      try {
        const err: any = error;
        const msg = err?.response?.data?.message || 'Failed to load blogs';
        // If unauthorized or forbidden, give a clearer message to the user
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          toast.showToast(msg + ' — please login as an admin.', 'error');
        } else {
          toast.showToast(msg, 'error');
        }
      } catch (e) {
        // swallow
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await blogService.updateBlog(formData._id, formData);
        toast.showToast('Blog updated successfully!', 'success');
      } else {
        await blogService.createBlog(formData);
        toast.showToast('Blog created successfully!', 'success');
      }
      setShowForm(false);
      setFormData({
        _id: undefined,
        title: '',
        excerpt: '',
        content: '',
        category: 'Tips',
        status: 'draft',
        publishDate: new Date().toISOString().slice(0, 16),
        image: { url: '' }
      });
      loadBlogs();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to create blog';
      toast.showToast(msg, 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {showForm ? 'Cancel' : '+ New Blog'}
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Create New Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Short Description)</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  maxLength={300}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content (Full Article)</label>
                <div className="quill-wrapper border border-gray-300 rounded-lg overflow-hidden">
                  {isClient ? (
                    <EditorErrorBoundary
                      value={formData.content}
                      onChange={(v: string) => setFormData({ ...formData, content: v })}
                      fallback={({ value, onChange }) => (
                        <div className="p-4">
                          <p className="text-sm text-yellow-600 mb-2">WYSIWYG editor is unavailable — using plain text editor fallback.</p>
                          <textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-48"
                          />
                        </div>
                      )}
                    >
                      <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading editor...</div>}>
                        <ReactQuill
                          value={formData.content}
                          onChange={(value: string) => setFormData({ ...formData, content: value })}
                          theme="snow"
                          modules={quillModules}
                          formats={[
                            'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
                            'list', 'bullet', 'link', 'image'
                          ]}
                        />
                      </Suspense>
                    </EditorErrorBoundary>
                  ) : (
                    <div className="p-4 text-sm text-gray-500">Loading editor...</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Tips">Tips</option>
                    <option value="News">News</option>
                    <option value="Guide">Guide</option>
                    <option value="Update">Update</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.status === 'scheduled' && new Date(formData.publishDate) > new Date() 
                    ? '✓ Will be published in the future' 
                    : 'Publishing immediately'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image.url}
                  onChange={(e) => setFormData({ ...formData, image: { url: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
              >
                {formData._id ? 'Update Blog Post' : 'Create Blog Post'}
              </button>
            </form>
          </div>
        )}

        {/* Blogs List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publish Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {blogs.map((blog: any) => (
                <tr key={blog._id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{blog.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{blog.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      blog.status === 'published' ? 'bg-green-100 text-green-800' :
                      blog.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(blog.publishDate).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{blog.views}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                      <button
                        onClick={() => {
                          // populate form for editing
                          setFormData({
                            _id: blog._id,
                            title: blog.title || '',
                            excerpt: blog.excerpt || '',
                            content: blog.content || '',
                            category: blog.category || 'Tips',
                            status: blog.status || 'draft',
                            publishDate: blog.publishDate ? new Date(blog.publishDate).toISOString().slice(0,16) : new Date().toISOString().slice(0,16),
                            image: { url: blog.image?.url || '' }
                          });
                          setShowForm(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Edit
                      </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this blog?')) {
                          try {
                            await blogService.deleteBlog(blog._id);
                            toast.showToast('Blog deleted', 'success');
                            loadBlogs();
                          } catch (err: any) {
                            const msg = err?.response?.data?.message || 'Failed to delete blog';
                            toast.showToast(msg, 'error');
                          }
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogsPage;
