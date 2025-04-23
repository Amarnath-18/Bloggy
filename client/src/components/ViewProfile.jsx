import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import api from '@/lib/axios'
import { Calendar, Mail, User2, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { setUser } from '@/redux/UserSlice'

const ViewProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const currentUser = useSelector(state => state.user.user)
  const dispatch = useDispatch()
  const { id } = useParams()

  const userId = id || currentUser?._id
  const isOwnProfile = currentUser?._id === userId

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      setError('Image size should be less than 1MB')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Invalid image format. Use JPEG, PNG or WebP')
      return
    }

    const formData = new FormData()
    formData.append('profilePic', file)

    try {
      setLoading(true)
      const response = await api.put('/upload/profilePic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (response.data.success) {
        // Update local state and redux store
        setProfile(prev => ({
          ...prev,
          user: { ...prev.user, profilePic: response.data.profilePic }
        }))
        dispatch(setUser({ ...currentUser, profilePic: response.data.profilePic }))
      }
    } catch (err) {
      setError('Failed to update profile picture')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/auth/userProfile/${userId}`)
        if (response.data.success) {
          setProfile(response.data.data)
        } else {
          setError(response.data.message)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchProfile()
    }
  }, [userId])

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>
  if (error) return <div className="text-red-500 text-center min-h-[60vh]">{error}</div>
  if (!profile) return null

  const { user, totalBlogs } = profile

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-primary/10">
            <div className="absolute -bottom-12 left-8">
              <div className={cn(
                "relative w-24 h-24 rounded-full border-4 border-background",
                "bg-primary/10 flex items-center justify-center overflow-hidden",
                isOwnProfile && "group"
              )}>
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-12 h-12 text-muted-foreground" />
                )}
                
                {isOwnProfile && (
                  <label className={cn(
                    "absolute inset-0 bg-black/50 flex items-center justify-center",
                    "opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity",
                    "text-white"
                  )}>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <Camera className="w-6 h-6" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 px-8 pb-8">
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>

            <div className="mt-4 space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.joinedAt).toLocaleDateString('en-GB')}
              </div>
            </div>

            {user.bio && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Bio</h2>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-2xl font-bold">{totalBlogs}</div>
                  <div className="text-sm text-muted-foreground">Total Blogs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile
