import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/axios'
import { cn } from '@/lib/utils'

const WriteBlog = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    blogImage: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size > 1024 * 1024) { // 1MB limit
      setError('Image size must be less than 1MB')
      return
    }
    setFormData(prev => ({
      ...prev,
      blogImage: file
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('category', formData.category)
      if (formData.blogImage) {
        formDataToSend.append('blogImage', formData.blogImage)
      }

      await api.post('/blogs', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate('/myBlogs')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Write a Blog</h1>
      
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
              "w-full p-2 border rounded-md min-h-[200px]",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            required
            minLength={5}
            maxLength={1000}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image (Optional)</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/webp"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Max size: 1MB. Supported formats: JPEG, PNG, WebP
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full py-2 px-4 rounded-md",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {loading ? 'Publishing...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  )
}

export default WriteBlog
