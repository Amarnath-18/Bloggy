import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/lib/axios'
import { cn } from '@/lib/utils'
import { setBlogs } from '@/redux/BlogSlice'

const ViewCategoryBlogs = () => {
  const { category } = useParams()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs.blogs)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/blogs/category/${category}`)
        console.log('API Response:', response.data);
        if (response.data.success) {
          dispatch(setBlogs(response.data.data))
        } else {
          setError(response.data.message)
          dispatch(setBlogs([]))
        }
      } catch (error) {
        console.error('Error details:', error.response?.data || error);
        setError(error.response?.data?.message || 'Failed to fetch category blogs')
        dispatch(setBlogs([]))
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryBlogs()
  }, [category, dispatch])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={cn(
        "text-4xl font-bold mb-8",
        "text-primary text-center"
      )}>
        {category} Blogs
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => ( 
          <Link 
            to={`/viewBlog/${blog._id}`}
            key={blog._id}
            className={cn(
              "bg-card rounded-lg shadow-md overflow-hidden",
              "transition-transform duration-200 hover:scale-105"
            )}
          >
            {blog.image && (
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-card-foreground">
                {blog.title}
              </h2>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {blog.content}
              </p>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>By {blog.author?.firstName} {blog.author?.lastName}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {blogs.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No blogs found in this category.
        </p>
      )}
    </div>
  )
}

export default ViewCategoryBlogs
