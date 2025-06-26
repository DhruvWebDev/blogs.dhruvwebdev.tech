import { type NextRequest, NextResponse } from "next/server"
import { getPageContent, getBlogPost } from "@/lib/utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const blogId = params.id
    console.log("API Route - Fetching blog with ID:", blogId)

    // First, try to get the page content
    let content = ""
    try {
      content = await getPageContent(blogId)
      console.log("Content fetched successfully, length:", content.length)
    } catch (contentError) {
      console.error("Error fetching content:", contentError)
      // Continue without content - we'll still try to get metadata
    }

    // Try to get blog metadata
    let blogPost
    try {
      blogPost = await getBlogPost(blogId)
      console.log("Blog post metadata fetched successfully")
    } catch (metadataError) {
      console.error("Error fetching metadata:", metadataError)

      // If we can't get metadata but have content, create a basic blog post
      if (content) {
        blogPost = {
          id: blogId,
          title: "Blog Post",
          description: "A blog post from Notion",
          category: "General",
          tags: [],
          publishedDate: new Date().toISOString(),
          status: "Published",
          author: "Author",
          coverImage: null,
          readTime: Math.max(1, Math.ceil(content.length / 1000)),
          slug: blogId,
        }
      } else {
        throw metadataError
      }
    }

    return NextResponse.json(
      {
        ...blogPost,
        content,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in /api/blog/[id]:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Blog post not found",
        details: errorMessage,
        id: params.id,
        help: "Please check that the page ID is correct and your integration has access to it",
      },
      { status: 404 },
    )
  }
}
