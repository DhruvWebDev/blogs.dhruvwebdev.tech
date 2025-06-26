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
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-neutral-800 dark:prose-headings:text-white prose-p:text-neutral-600 dark:prose-p:text-neutral-300 prose-a:text-blue-600 dark:prose-a:text-blue-400"
        >
          {blog.content ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400">No content available for this post.</p>
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
    </div>
  )
}
