import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '@/lib/axios'
import { Calendar, Mail, User2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ViewProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentUser = useSelector(state => state.user.user)
  const { id } = useParams()

  const userId = id || currentUser?._id

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
                "w-24 h-24 rounded-full border-4 border-background",
                "bg-primary/10 flex items-center justify-center overflow-hidden"
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
                Joined {new Date(user.joinedAt).toLocaleDateString()}
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
