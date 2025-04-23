import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, MessageCircle, ThumbsUp } from 'lucide-react'
import api from '@/lib/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlogs } from '@/redux/BlogSlice'

const ViewBlogs = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs.blogs) || []; // Access the blogs from the store state
  useEffect(() => {
    fetchBlogs()
  }, [page])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/blogs', {
        params: {
          page,
          limit: 9,
        }
      })
      
      if (response.data.success) {
        if (page === 1) {
          dispatch(setBlogs(response.data.data)) // Dispatch the action to set the blogs in the store
        } else {
          dispatch(setBlogs(prev => [...prev, ...response.data.data])) // Dispatch the action to add the new blogs to the existing ones in the store
        }
        setHasMore(response.data.data.length === 9)
      } else {
        setError(response.data.message)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch blogs')
    } finally {
      setLoading(false)
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

  if (loading || blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  console.log(blogs);


  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>
      
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

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {blog?.author?.firstName} {blog?.author?.lastName}
                </div>
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

              <Link 
                to={`/viewBlog/${blog._id}`}
                className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded cursor-pointer hover:bg-primary/90 transition-colors"
              >
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded hover:bg-secondary/90 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default ViewBlogs
