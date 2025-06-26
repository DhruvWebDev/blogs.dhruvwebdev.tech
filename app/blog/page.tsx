"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Home, User, Mail, BookOpen, Search, Calendar, Clock, Tag, Filter, ArrowRight, AlertCircle } from "lucide-react"

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
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])

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
    fetchBlogs()
  }, [])

  useEffect(() => {
    filterBlogs()
  }, [blogs, searchTerm, selectedCategory])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to fetch blogs")
      }

      const data = await response.json()
      setBlogs(data)

      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(data.map((blog: BlogPost) => blog.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setError(error instanceof Error ? error.message : "Failed to load blogs")
    } finally {
      setLoading(false)
    }
  }

  const filterBlogs = () => {
    let filtered = blogs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory)
    }

    setFilteredBlogs(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-black bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading articles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <FloatingNav navItems={navItems} />
        <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">Unable to Load Blog Posts</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">{error}</p>

          <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-neutral-800 dark:text-white mb-4">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Verify your Notion database ID is correct in your environment variables</li>
              <li>Ensure your Notion integration has access to the database</li>
              <li>Make sure the database is shared with your integration</li>
              <li>Check that both NOTION_DATABASE_ID and NEXT_NOTION_SECRET are set</li>
            </ol>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <FloatingNav navItems={navItems} />

      {/* Header Section */}
      <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Blog Posts
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover insights, tutorials, and thoughts on modern web development, design, and technology.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${blog.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-neutral-900 overflow-hidden cursor-pointer h-full">
                  {blog.coverImage && (
                    <div className="relative overflow-hidden">
                      <img
                        src={blog.coverImage || "/placeholder.svg?height=200&width=400"}
                        alt={blog.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600">{blog.category}</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(blog.publishedDate)}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{blog.readTime} min read</span>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{blog.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{blog.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">By {blog.author}</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredBlogs.length === 0 && blogs.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">No articles found</h3>
            <p className="text-neutral-500 dark:text-neutral-500">Try adjusting your search terms or filters.</p>
          </motion.div>
        )}

        {blogs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
              No blog posts available
            </h3>
            <p className="text-neutral-500 dark:text-neutral-500">Check your Notion database configuration.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
