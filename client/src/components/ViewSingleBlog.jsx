import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '@/lib/axios'
import { cn } from '@/lib/utils'

const ViewSingleBlog = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [blog, setBlog] = useState(null)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState('')
  const user = useSelector(state => state.user.user)
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`)
        setBlog(response.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blog')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const handleLike = async () => {
    try {
      const response = await api.put(`/blogs/like/${id}`);
      if (response.data.success) {
        setBlog(response.data.data);
      }
    } catch (err) {
      console.error('Failed to like blog:', err);
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post(`/blogs/comment/${id}`, { text: comment })
      if (response.data.success) {
        setBlog(response.data.data)
        setComment('')
      }
    } catch (err) {
      console.error('Failed to add comment:', err)
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>
  if (!blog) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>By {blog.author?.firstName} {blog.author?.lastName}</span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span className="bg-secondary px-2 py-1 rounded">{blog.category}</span>
        </div>
      </div>

      {/* Blog Image */}
      {blog.image && (
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
      )}

      {/* Blog Content */}
      <div className="prose max-w-none mb-8">
        {blog.content}
      </div>

      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={!user}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded",
          "bg-primary text-primary-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {blog.likes?.includes(user?._id) ? 'Unlike' : 'Like'} 
        ({blog.likes?.length})
      </button>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        
        {/* Comment Form */}
        {user && (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border rounded-lg mb-2"
              rows="3"
            />
            <button 
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded"
              disabled={!comment.trim()}
            >
              Post Comment
            </button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {blog.comments?.map((comment) => (
            <div key={comment._id} className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">
                  {comment.user?.firstName} {comment.user?.lastName}
                </span>
                <span className="text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewSingleBlog
