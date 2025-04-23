import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '@/lib/axios'
import { cn } from '@/lib/utils'
import { UserCircle } from 'lucide-react'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'

const ViewSingleBlog = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [blog, setBlog] = useState(null)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const user = useSelector(state => state.user.user)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    commentId: null
  })
  
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

  const handleEditComment = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put(`/blogs/${id}/comment/${editingComment._id}`, {
        text: comment
      })
      if (response.data.success) {
        setBlog(prev => ({
          ...prev,
          comments: prev.comments.map(c => 
            c._id === editingComment._id ? { ...c, text: comment } : c
          )
        }))
        setComment('')
        setEditingComment(null)
      }
    } catch (err) {
      console.error('Failed to edit comment:', err)
    }
  }

  const openDeleteConfirmation = (commentId) => {
    setConfirmDialog({
      isOpen: true,
      commentId
    })
  }

  const closeDeleteConfirmation = () => {
    setConfirmDialog({
      isOpen: false,
      commentId: null
    })
  }

  const handleDeleteComment = async () => {
    try {
      const response = await api.delete(`/blogs/${id}/comment/${confirmDialog.commentId}`)
      if (response.data.success) {
        setBlog(prev => ({
          ...prev,
          comments: prev.comments.filter(c => c._id !== confirmDialog.commentId)
        }))
      }
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  const startEditingComment = (comment) => {
    setEditingComment(comment)
    setComment(comment.text)
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
          <Link to={`/viewProfile/${blog.author?._id}`} className="flex items-center gap-2">
            {blog.author?.profilePic ? (
              <img 
                src={blog.author?.profilePic} 
                alt="Author" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="w-6 h-6" />
              </div>
            )}
            <span>{blog.author?.firstName} {blog.author?.lastName}</span>
          </Link>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('en-GB')}</span>
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
        className={cn("cursor-pointer",
          "flex items-center gap-2 px-4 py-2 rounded",
          "bg-primary text-primary-foreground",
          "disabled:opacity-50 "
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
          <form onSubmit={editingComment ? handleEditComment : handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={editingComment ? "Edit your comment..." : "Add a comment..."}
              className="w-full p-2 border rounded-lg mb-2"
              rows="3"
            />
            <div className="flex gap-2">
              <button 
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 cursor-pointer rounded"
                disabled={!comment.trim()}
              >
                {editingComment ? 'Update Comment' : 'Post Comment'}
              </button>
              {editingComment && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingComment(null)
                    setComment('')
                  }}
                  className="bg-secondary text-secondary-foreground px-4 py-2 cursor-pointer rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {blog.comments?.map((comment) => (
            <div key={comment._id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {comment.user?.firstName} {comment.user?.lastName}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                {user?._id === comment.user?._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditingComment(comment)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteConfirmation(comment._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

export default ViewSingleBlog
