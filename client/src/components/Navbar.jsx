import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { 
  LogInIcon, 
  MenuIcon, 
  XIcon, 
  HomeIcon, 
  MonitorIcon, 
  HeartIcon, 
  PlaneIcon, 
  GraduationCapIcon,
  PenLine,
  UserCircle,
  LogOut,
  FileText,
  KeyIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import api from '@/lib/axios'
import { setUser } from '@/redux/UserSlice'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  
  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon className="size-4" /> },
    { name: 'Tech', path: '/category/Tech', icon: <MonitorIcon className="size-4" /> },
    { name: 'Life', path: '/category/Life', icon: <HeartIcon className="size-4" /> },
    { name: 'Travel', path: '/category/Travel', icon: <PlaneIcon className="size-4" /> },
    { name: 'Education', path: '/category/Education', icon: <GraduationCapIcon className="size-4" /> },
  ]

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      dispatch(setUser(null))
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActivePath = (path) => location.pathname === path

  const ProfileIcon = ({ className }) => {
    if (user?.profilePic) {
      return (
        <div className={cn("w-8 h-8 rounded-full overflow-hidden", className)}>
          <img 
            src={user.profilePic} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      )
    }
    return <UserCircle className={className} />
  }

  return (
    <nav className="w-full border-b shadow-sm sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-3xl pb-1 font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              BlogHunt
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors
                    ${isActivePath(item.path) 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/writeBlog">
                    <Button className="gap-2">
                      <PenLine className="size-4" />
                      Write
                    </Button>
                  </Link>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      className="gap-2"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                      <ProfileIcon className="size-8" />
                    </Button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 py-2 bg-background rounded-md shadow-lg border">
                        <div className="px-4 py-2 border-b">
                          <div className="flex items-center gap-2">
                            <ProfileIcon className="size-8" />
                            <div className="text-sm">
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-muted-foreground text-xs truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/viewProfile"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <UserCircle className="size-4" />
                          View Profile
                        </Link>
                        <Link
                          to="/updateProfile"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <PenLine className="size-4" />
                          Update Profile
                        </Link>
                        <Link
                          to="/update-password"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <KeyIcon className="size-4" />
                          Update Password
                        </Link>
                        <Link
                          to="/myBlogs"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <FileText className="size-4" />
                          My Blogs
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsProfileMenuOpen(false)
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent w-full"
                        >
                          <LogOut className="size-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="gap-2">
                      <LogInIcon className="size-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="gap-2">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XIcon className="size-6" />
            ) : (
              <MenuIcon className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="px-4 mb-4">
              <div className="flex items-center gap-3">
                <ProfileIcon className="size-10" />
                <div>
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors
                    ${isActivePath(item.path)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-accent'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="flex flex-col gap-2 px-4 pt-4 border-t">
                {user ? (
                  <>
                    <Link to="/writeBlog" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full gap-2">
                        <PenLine className="size-4" />
                        Write
                      </Button>
                    </Link>
                    <Link to="/viewProfile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <UserCircle className="size-4" />
                        View Profile
                      </Button>
                    </Link>
                    <Link to="/updateProfile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <PenLine className="size-4" />
                        Update Profile
                      </Button>
                    </Link>
                    <Link to="/update-password" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <KeyIcon className="size-4" />
                        Update Password
                      </Button>
                    </Link>
                    <Link to="/myBlogs" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <FileText className="size-4" />
                        My Blogs
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" className="w-full gap-2">
                        <LogInIcon className="size-4" />
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full gap-2">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
