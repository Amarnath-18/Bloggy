import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { 
  LogInIcon, 
  MenuIcon, 
  XIcon, 
  HomeIcon, 
  MonitorIcon, 
  HeartIcon, 
  PlaneIcon, 
  GraduationCapIcon 
} from 'lucide-react'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon className="size-4" /> },
    { name: 'Tech', path: '/category/tech', icon: <MonitorIcon className="size-4" /> },
    { name: 'Life', path: '/category/life', icon: <HeartIcon className="size-4" /> },
    { name: 'Travel', path: '/category/travel', icon: <PlaneIcon className="size-4" /> },
    { name: 'Education', path: '/category/education', icon: <GraduationCapIcon className="size-4" /> },
  ]

  const isActivePath = (path) => location.pathname === path

  return (
    <nav className="w-full border-b shadow-sm sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Bloggy
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
