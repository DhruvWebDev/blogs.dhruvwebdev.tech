"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Home, User, Mail, BookOpen, Calendar, Clock, Tag, ArrowLeft, Share2, Heart, MessageCircle } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  publishedDate: string
  author: string
  coverImage: string | null
  readTime: number
  slug: string
  content: string
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Blog",
      link: "/blog",
      icon: <BookOpen className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <Mail className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ]

  useEffect(() => {
    fetchBlogPost()
  }, [params.id])

  const fetchBlogPost = async () => {
    try {
      console.log("Fetching blog post with ID:", params.id)
      const response = await fetch(`/api/blog/${params.id}`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("Blog post data received:", data)
      setBlog(data)
    } catch (error) {
      console.error("Error fetching blog post:", error)
      setError(error instanceof Error ? error.message : "Failed to load blog post")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <FloatingNav navItems={navItems} />
        <div className="text-center pt-32">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">{error || "Blog post not found"}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The blog post you're looking for doesn't exist or couldn't be loaded.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">ID: {params.id}</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <FloatingNav navItems={navItems} />

      <article className="pt-32 pb-16 px-4 max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/blog">
            <Button variant="ghost" className="group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            <Badge className="bg-blue-500 hover:bg-blue-600">{blog.category}</Badge>
            <Calendar className="h-3 w-3 ml-2" />
            <span>{formatDate(blog.publishedDate)}</span>
            <Clock className="h-3 w-3 ml-2" />
            <span>{blog.readTime} min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-6">{blog.description}</p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-neutral-600 dark:text-neutral-400">
                By <strong>{blog.author}</strong>
              </span>
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                Comment
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Cover Image */}
        {blog.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <img
              src={blog.coverImage || "/placeholder.svg?height=400&width=800"}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="notion-content"
        >
          {blog.content ? (
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              <p className="text-neutral-600 dark:text-neutral-400">No content available for this post.</p>
            </div>
          )}
        </motion.div>

        {/* Article Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-neutral-600 dark:text-neutral-400 mr-2">Tags:</span>
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Like this article
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </motion.footer>
      </article>

      {/* Enhanced Global Styles for Notion Content */}
      <style jsx global>{`
        .notion-content pre {
          margin: 2rem 0;
          padding: 1.5rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          border-radius: 0.75rem;
          overflow-x: auto;
          font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
          font-size: 0.875rem;
          line-height: 1.7;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #334155;
          position: relative;
        }

        .notion-content pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
          border-radius: 0.75rem 0.75rem 0 0;
        }

        .dark .notion-content pre {
          background: linear-gradient(135deg, #0c0a09 0%, #1c1917 100%);
          border-color: #44403c;
          color: #fafaf9;
        }

        .notion-content code {
          font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
          font-size: 0.85rem;
          background-color: #f1f5f9;
          color: #be185d;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          border: 1px solid #e2e8f0;
        }

        .dark .notion-content code {
          background-color: #1e293b;
          color: #f472b6;
          border-color: #334155;
        }

        .notion-content pre code {
          background: none;
          padding: 0;
          border-radius: 0;
          color: inherit;
          font-weight: normal;
          border: none;
          font-size: 0.875rem;
        }

        
        .notion-content {
          line-height: 1.7;
          color: #374151;
        }
        
        .dark .notion-content {
          color: #d1d5db;
        }
        
        .notion-content h1,
        .notion-content h2,
        .notion-content h3,
        .notion-content h4,
        .notion-content h5,
        .notion-content h6 {
          color: #111827;
          font-weight: 700;
          line-height: 1.25;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .dark .notion-content h1,
        .dark .notion-content h2,
        .dark .notion-content h3,
        .dark .notion-content h4,
        .dark .notion-content h5,
        .dark .notion-content h6 {
          color: #ffffff;
        }
        
        .notion-content h1 {
          font-size: 2.25rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
          margin-top: 3rem;
        }
        
        .dark .notion-content h1 {
          border-bottom-color: #374151;
        }
        
        .notion-content h2 {
          font-size: 1.875rem;
          margin-top: 2.5rem;
        }
        
        .notion-content h3 {
          font-size: 1.5rem;
          margin-top: 2rem;
        }
        
        .notion-content h4 {
          font-size: 1.25rem;
          margin-top: 1.5rem;
        }
        
        .notion-content p {
          margin-bottom: 1.25rem;
          line-height: 1.75;
          color: #374151;
        }
        
        .dark .notion-content p {
          color: #d1d5db;
        }
        
        .notion-content ul,
        .notion-content ol {
          margin: 1.25rem 0;
          padding-left: 1.75rem;
        }
        
        .notion-content li {
          margin-bottom: 0.75rem;
          line-height: 1.6;
          color: #374151;
        }
        
        .dark .notion-content li {
          color: #d1d5db;
        }
        
        .notion-content blockquote {
          margin: 2rem 0;
          padding: 1.25rem 1.75rem;
          border-left: 4px solid #3b82f6;
          background-color: #eff6ff;
          font-style: italic;
          color: #1e40af;
          border-radius: 0.5rem;
        }
        
        .dark .notion-content blockquote {
          background-color: #1e3a8a;
          color: #bfdbfe;
          border-left-color: #60a5fa;
        }
        
        
        
        .notion-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2rem 0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .notion-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .notion-content th,
        .notion-content td {
          border: 1px solid #e5e7eb;
          padding: 0.875rem 1rem;
          text-align: left;
        }
        
        .dark .notion-content th,
        .dark .notion-content td {
          border-color: #374151;
        }
        
        .notion-content th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #111827;
        }
        
        .dark .notion-content th {
          background-color: #1f2937;
          color: #ffffff;
        }
        
        .notion-content a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .notion-content a:hover {
          color: #1d4ed8;
          text-decoration: underline;
          text-decoration-color: #3b82f6;
          text-underline-offset: 3px;
        }
        
        .dark .notion-content a {
          color: #60a5fa;
        }
        
        .dark .notion-content a:hover {
          color: #93c5fd;
          text-decoration-color: #60a5fa;
        }
        
        .notion-content hr {
          margin: 3rem 0;
          border: none;
          border-top: 2px solid #e5e7eb;
          border-radius: 1px;
        }
        
        .dark .notion-content hr {
          border-top-color: #374151;
        }
        
        .notion-content strong {
          font-weight: 600;
          color: #111827;
        }
        
        .dark .notion-content strong {
          color: #ffffff;
        }
        
        .notion-content em {
          font-style: italic;
          color: #6b7280;
        }
        
        .dark .notion-content em {
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}
