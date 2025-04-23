import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';

const EditUserblog = ({ blog, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: blog.title,
    content: blog.content,
    category: blog.category,
    image: blog.image
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB
      setError('Image size should be less than 1MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.put('/upload/blogImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image: response.data.url }));
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.put(`/blogs/${blog._id}`, formData);
      onUpdate(response.data.blog);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
        
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              required
              minLength={5}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
            >
              <option value="Tech">Tech</option>
              <option value="Life">Life</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              required
              minLength={5}
              maxLength={1000}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/webp"
              className={cn(
                "w-full",
                "file:mr-4 file:py-2 file:px-4",
                "file:rounded-md file:border-0",
                "file:text-sm file:font-medium",
                "file:bg-secondary file:text-secondary-foreground",
                "hover:file:bg-secondary/80",
                "cursor-pointer"
              )}
            />
            <p className="text-xs text-muted-foreground">
              Max size: 1MB. Supported formats: JPEG, PNG, WebP
            </p>
            {formData.image && (
              <div className="relative group">
                <img
                  src={formData.image}
                  alt="Blog preview"
                  className={cn(
                    "w-full h-48 object-cover rounded-lg",
                    "border-2 border-muted",
                    "shadow-sm hover:shadow-md",
                    "transition-all duration-200"
                  )}
                />
                <div className={cn(
                  "absolute inset-0 bg-black/50 rounded-lg",
                  "opacity-0 group-hover:opacity-100",
                  "flex items-center justify-center",
                  "transition-opacity duration-200"
                )}>
                  <p className="text-white text-sm">Click 'Choose File' to change image</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "px-4 py-2 rounded-md",
                "bg-secondary hover:bg-secondary/90"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "px-4 py-2 rounded-md",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90",
                "disabled:opacity-50"
              )}
            >
              {loading ? 'Updating...' : 'Update Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserblog
