import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import api from '@/lib/axios'
import { UserPlus } from 'lucide-react'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profilePic: null
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
      setError('Profile picture must be less than 1MB')
      return
    }
    setFormData(prev => ({
      ...prev,
      profilePic: file
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic)
      }

      await api.post('/auth/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Join Bloggy and start sharing your stories
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={cn(
                  "w-full p-2 border rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={cn(
                  "w-full p-2 border rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                required
                minLength={3}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={cn(
                "w-full p-2 border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={cn(
                "w-full p-2 border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/webp"
              className="w-full"
              required
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
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus className="size-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
