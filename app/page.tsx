"use client"
import { useState, useEffect } from "react"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Spotlight } from "@/components/ui/spotlight"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/moving-border"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button as UIButton } from "@/components/ui/button"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import {
  Home,
  User,
  Mail,
  BookOpen,
  Code,
  Palette,
  Zap,
  ArrowRight,
  Calendar,
  Github,
  Twitter,
  Linkedin,
  Clock,
  Tag,
  AlertCircle,
  ExternalLink,
  Settings,
} from "lucide-react"

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

interface ApiError {
  error: string
  message: string
  help?: string
  setup?: string[] | { [key: string]: string }
  troubleshooting?: string[]
  debug?: any
}

export default function BlogHomepage() {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

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
    fetchFeaturedBlogs()
  }, [])

  const fetchFeaturedBlogs = async () => {
    try {
      console.log("Homepage - Fetching featured blogs...")
      const response = await fetch("/api/blogs")

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        console.error("API Error:", errorData)
        setError(errorData)
        return
      }

      const data = await response.json()
      console.log("Homepage - Blogs fetched:", data.length)

      // Get the first 3 blogs for featured section
      setFeaturedBlogs(data.slice(0, 3))
      setError(null)
    } catch (error) {
      console.error("Error fetching featured blogs:", error)
      setError({
        error: "Network Error",
        message: error instanceof Error ? error.message : "Failed to load blogs",
        help: "Please check your internet connection and try again",
      })
    } finally {
      setLoading(false)
    }
  }

  const bentoItems = [
    {
      title: "Web Development",
      description: "Modern frameworks, tools, and best practices for building exceptional web experiences.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
      ),
      icon: <Code className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "UI/UX Design",
      description: "Design principles, user experience insights, and creative inspiration for digital products.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
      ),
      icon: <Palette className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Performance Optimization",
      description: "Techniques and strategies to make your applications faster and more efficient.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
      ),
      icon: <Zap className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Latest Tutorials",
      description: "Step-by-step guides and hands-on tutorials for developers of all levels.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
      ),
      icon: <BookOpen className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Tech Insights",
      description: "Industry trends, emerging technologies, and thought leadership in the tech world.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
      ),
      icon: <Zap className="h-4 w-4 text-neutral-500" />,
    },
  ]

  const renderSetupSteps = (setup: string[] | { [key: string]: string }) => {
    if (Array.isArray(setup)) {
      return (
        <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          {setup.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      )
    } else {
      return (
        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          {Object.entries(setup).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="relative w-full dark:bg-black bg-white">
      <FloatingNav navItems={navItems} />

      {/* Hero Section */}
      <div className="h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 mb-8">
              Welcome to My Blog
            </h1>
            <TextGenerateEffect
              words="Exploring the intersection of technology, design, and innovation. Join me on a journey through code, creativity, and continuous learning."
              className="text-xl md:text-2xl max-w-4xl mx-auto mb-12"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/blog">
                <Button
                  borderRadius="1.75rem"
                  className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                  Explore Articles
                </Button>
              </Link>
              <UIButton variant="outline" size="lg" className="group">
                Subscribe to Newsletter
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </UIButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Featured Articles
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-center mb-16 max-w-2xl mx-auto">
            Discover the latest insights, tutorials, and thoughts from my Notion database.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-200 dark:bg-neutral-800 h-48 rounded-lg mb-4"></div>
                <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded mb-2"></div>
                <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-neutral-200 dark:bg-neutral-800 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">{error.error}</h3>
                  <p className="text-red-700 dark:text-red-300 mb-4">{error.message}</p>

                  {error.help && <p className="text-red-600 dark:text-red-400 mb-4 font-medium">{error.help}</p>}

                  {error.setup && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Setup Instructions:
                      </h4>
                      {renderSetupSteps(error.setup)}
                    </div>
                  )}

                  {error.troubleshooting && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Troubleshooting:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                        {error.troubleshooting.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    <UIButton onClick={() => window.location.reload()} size="sm">
                      Try Again
                    </UIButton>
                    <UIButton variant="outline" size="sm" asChild>
                      <a href="https://notion.so/my-integrations" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Notion Integrations
                      </a>
                    </UIButton>
                    <Link href="/blog">
                      <UIButton variant="outline" size="sm">
                        Go to Blog
                      </UIButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : featuredBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-neutral-900 overflow-hidden cursor-pointer h-full">
                      {post.coverImage && (
                        <div className="relative overflow-hidden">
                          <img
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <Badge className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600">{post.category}</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.publishedDate)}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{post.readTime} min read</span>
                        </div>
                        <CardTitle className="group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="h-2 w-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{post.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                        <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">By {post.author}</div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/blog">
                <UIButton size="lg" className="group">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </UIButton>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">No articles found</h3>
            <p className="text-neutral-500 dark:text-neutral-500 mb-6">
              Add some pages to your Notion database to see them here.
            </p>
            <Link href="/blog">
              <UIButton variant="outline">Go to Blog Page</UIButton>
            </Link>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Explore Topics
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Dive deep into various topics that shape the future of technology and design.
          </p>
        </motion.div>

        <BentoGrid className="max-w-4xl mx-auto">
          {bentoItems.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={item.className}
            />
          ))}
        </BentoGrid>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-20 px-4">
        <BackgroundBeams />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Stay Updated</h2>
            <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
              Get the latest articles, tutorials, and insights delivered straight to your inbox. Join thousands of
              developers who trust our content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
              />
              <UIButton className="bg-white text-black hover:bg-neutral-200">Subscribe</UIButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">My Blog</h3>
              <p className="text-neutral-400 mb-6 max-w-md">
                Sharing knowledge, insights, and experiences in web development, design, and technology. Building the
                future, one article at a time.
              </p>
              <div className="flex gap-4">
                <Github className="h-5 w-5 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">
                    UI/UX Design
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">
                    Programming
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 My Blog. All rights reserved. Built with Next.js and Aceternity UI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
