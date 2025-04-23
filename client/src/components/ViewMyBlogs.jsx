import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, MessageCircle, ThumbsUp, Trash2, Edit } from 'lucide-react'
import api from '@/lib/axios'
import { useSelector } from 'react-redux'

const ViewMyBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = useSelector(state => state.user.user)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMyBlogs()
  }, [])

  const fetchMyBlogs = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/blogs/users/${user._id}`)
      if (response.data.success) {
        setBlogs(response.data.data)
      } else {
        setError(response.data.message)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch your blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return

    try {
      const response = await api.delete(`/blogs/${blogId}`)
      if (response.data.success) {
        setBlogs(blogs.filter(blog => blog._id !== blogId))
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete blog')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Blogs</h1>
      
      {blogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-muted-foreground mb-4">You haven't written any blogs yet</p>
          <Link 
            to="/writeBlog"
            className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article 
              key={blog._id} 
              className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {blog?.image && (
                <img 
                  src={blog?.image} 
                  alt={blog?.title} 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                    {blog?.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog?.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-2 text-foreground">
                  {blog?.title}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {blog?.content}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {blog?.likes?.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {blog?.comments?.length}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link 
                    to={`/viewBlog/${blog._id}`}
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded text-center hover:bg-primary/90 transition-colors"
                  >
                    Read More
                  </Link>
                  <Link
                    to={`/editBlog/${blog._id}`}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewMyBlogs
