import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, XIcon } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                BlogHunt
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground">
              A modern platform for writers and readers to connect, share ideas, and grow together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/viewBlogs" className="text-sm text-muted-foreground hover:text-foreground">
                  Explore Blogs
                </Link>
              </li>
              <li>
                <Link to="/writeBlog" className="text-sm text-muted-foreground hover:text-foreground">
                  Write Blog
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/tech" className="text-sm text-muted-foreground hover:text-foreground">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/category/life" className="text-sm text-muted-foreground hover:text-foreground">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/category/travel" className="text-sm text-muted-foreground hover:text-foreground">
                  Travel
                </Link>
              </li>
              <li>
                <Link to="/category/education" className="text-sm text-muted-foreground hover:text-foreground">
                  Education
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="size-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} BlogHunt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
