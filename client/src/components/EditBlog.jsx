import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '@/lib/axios'
import { cn } from '@/lib/utils'

const EditBlog = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`)
        const blog = response.data.data
        setFormData({
          title: blog.title,
          content: blog.content,
          category: blog.category,
          image: blog.image
        })
      } catch (err) {
        setError('Failed to fetch blog details')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      setError('Image size should be less than 1MB')
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await api.put('/upload/blogImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFormData(prev => ({ ...prev, image: response.data.url }))
    } catch (err) {
      setError('Failed to upload image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.put(`/blogs/${id}`, formData)
      navigate('/myBlogs')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      
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
              "w-full p-2 border rounded-md",
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
              "w-full p-2 border rounded-md",
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
              "w-full p-2 border rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            required
            minLength={5}
            maxLength={1000}
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/webp"
            className="w-full"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Blog preview"
              className="mt-2 w-full h-40 object-cover rounded-md"
            />
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/myBlogs')}
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
  )
}

export default EditBlog