import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { notion } from "@/lib/notion/client"
import { NotionRenderer } from "@notion-render/client"
import hljsPlugin from "@notion-render/hljs-plugin"
import bookmarkPlugin from "@notion-render/bookmark-plugin"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to test Notion connection
export async function testNotionConnection() {
  try {
    // Test basic connection by listing users (this should work if the integration is set up correctly)
    const response = await notion.users.list({})
    console.log("Notion connection test successful")
    return { success: true, message: "Connection successful" }
  } catch (error) {
    console.error("Notion connection test failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Connection failed",
    }
  }
}

// Function to get all pages from a Notion database
export async function getAllBlogPosts(databaseId?: string) {
  try {
    if (!databaseId) {
      console.log("No database ID provided, returning empty array")
      return []
    }

    console.log("Testing Notion connection first...")
    const connectionTest = await testNotionConnection()
    if (!connectionTest.success) {
      throw new Error(`Notion connection failed: ${connectionTest.message}`)
    }

    console.log("Attempting to access database:", databaseId)

    // First, try to retrieve the database to check access
    try {
      const database = await notion.databases.retrieve({ database_id: databaseId })
      console.log("Database access successful:", (database as any).title?.[0]?.plain_text || "Untitled Database")
    } catch (dbError: any) {
      console.error("Database access error:", dbError)

      if (dbError.code === "object_not_found") {
        throw new Error(
          `Database not found. Please check: 1) Database ID is correct: ${databaseId}, 2) Database exists, 3) Database is shared with your integration`,
        )
      } else if (dbError.code === "unauthorized") {
        throw new Error(
          `Unauthorized access to database. Please share the database with your integration and ensure it has the correct permissions.`,
        )
      } else {
        throw new Error(`Database access error: ${dbError.message}`)
      }
    }

    console.log("Querying database for pages...")

    // Try querying without filters first
    let response
    try {
      response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
          {
            property: "Created",
            direction: "descending",
          },
        ],
      })
    } catch (queryError: any) {
      console.error("Query error:", queryError)

      // If sorting by "Created" fails, try without sorting
      try {
        response = await notion.databases.query({
          database_id: databaseId,
        })
      } catch (fallbackError) {
        throw new Error(`Failed to query database: ${queryError.message}`)
      }
    }

    console.log("Database query successful. Found", response.results.length, "pages")

    if (response.results.length === 0) {
      console.log("No pages found in database")
      return []
    }

    // Process the results
    const blogPosts = response.results.map((page: any, index: number) => {
      const properties = page.properties
      console.log(`Processing page ${index + 1}:`, page.id)
      console.log("Available properties:", Object.keys(properties))

      // Extract title with multiple fallbacks
      const title =
        properties.Title?.title?.[0]?.plain_text ||
        properties.Name?.title?.[0]?.plain_text ||
        properties.title?.title?.[0]?.plain_text ||
        `Untitled Post ${index + 1}`

      // Extract description
      const description =
        properties.Description?.rich_text?.[0]?.plain_text ||
        properties.Summary?.rich_text?.[0]?.plain_text ||
        properties.Excerpt?.rich_text?.[0]?.plain_text ||
        "No description available"

      // Extract category
      const category = properties.Category?.select?.name || properties.Type?.select?.name || "General"

      // Extract tags
      const tags =
        properties.Tags?.multi_select?.map((tag: any) => tag.name) ||
        properties.Categories?.multi_select?.map((tag: any) => tag.name) ||
        []

      // Extract dates
      const publishedDate =
        properties.Published?.date?.start ||
        properties.Date?.date?.start ||
        properties.Created?.created_time ||
        page.created_time

      // Extract author
      const author =
        properties.Author?.people?.[0]?.name ||
        properties.Creator?.people?.[0]?.name ||
        properties.Writer?.people?.[0]?.name ||
        "Anonymous"

      // Extract cover image
      const coverImage =
        properties.Cover?.files?.[0]?.file?.url ||
        properties.Cover?.files?.[0]?.external?.url ||
        properties.Image?.files?.[0]?.file?.url ||
        properties.Image?.files?.[0]?.external?.url ||
        page.cover?.file?.url ||
        page.cover?.external?.url ||
        null

      // Extract read time
      const readTime =
        properties.ReadTime?.number || properties["Read Time"]?.number || properties.Duration?.number || 5

      // Extract status
      const status = properties.Status?.select?.name || "Published"

      return {
        id: page.id,
        title,
        description,
        category,
        tags,
        publishedDate,
        status,
        author,
        coverImage,
        readTime,
        slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      }
    })

    // Filter published posts if status property exists
    const publishedPosts = blogPosts.filter(
      (post: any) => post.status === "Published" || post.status === "published" || !post.status,
    )

    console.log("Processed blog posts:", publishedPosts.length, "published out of", blogPosts.length, "total")
    return publishedPosts
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error)
    throw error
  }
}

// Function to get a single page by ID
export async function getBlogPost(pageId: string) {
  try {
    console.log("Fetching individual page:", pageId)

    // Test connection first
    const connectionTest = await testNotionConnection()
    if (!connectionTest.success) {
      throw new Error(`Notion connection failed: ${connectionTest.message}`)
    }

    // Get the page
    const page = await notion.pages.retrieve({ page_id: pageId })
    console.log("Page retrieved successfully")

    const properties = (page as any).properties || {}

    // Extract properties similar to getAllBlogPosts
    const title =
      properties.Title?.title?.[0]?.plain_text ||
      properties.Name?.title?.[0]?.plain_text ||
      properties.title?.title?.[0]?.plain_text ||
      "Untitled"

    const description =
      properties.Description?.rich_text?.[0]?.plain_text ||
      properties.Summary?.rich_text?.[0]?.plain_text ||
      properties.Excerpt?.rich_text?.[0]?.plain_text ||
      ""

    const category = properties.Category?.select?.name || properties.Type?.select?.name || "General"

    const tags =
      properties.Tags?.multi_select?.map((tag: any) => tag.name) ||
      properties.Categories?.multi_select?.map((tag: any) => tag.name) ||
      []

    const publishedDate =
      properties.Published?.date?.start ||
      properties.Date?.date?.start ||
      properties.Created?.created_time ||
      page.created_time

    const author =
      properties.Author?.people?.[0]?.name ||
      properties.Creator?.people?.[0]?.name ||
      properties.Writer?.people?.[0]?.name ||
      "Anonymous"

    const coverImage =
      properties.Cover?.files?.[0]?.file?.url ||
      properties.Cover?.files?.[0]?.external?.url ||
      properties.Image?.files?.[0]?.file?.url ||
      properties.Image?.files?.[0]?.external?.url ||
      (page as any).cover?.file?.url ||
      (page as any).cover?.external?.url ||
      null

    const readTime = properties.ReadTime?.number || properties["Read Time"]?.number || properties.Duration?.number || 5

    return {
      id: page.id,
      title,
      description,
      category,
      tags,
      publishedDate,
      status: properties.Status?.select?.name || "Published",
      author,
      coverImage,
      readTime,
      slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
    }
  } catch (error: any) {
    console.error(`Error fetching blog post ${pageId}:`, error)

    if (error.code === "object_not_found") {
      throw new Error(
        `Page not found: ${pageId}. Please check the page ID and ensure your integration has access to it.`,
      )
    } else if (error.code === "unauthorized") {
      throw new Error(`Unauthorized access to page: ${pageId}. Please share the page with your integration.`)
    }

    throw error
  }
}

// Function to format date
export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Function to get page content using NotionRenderer
export async function getPageContent(pageId: string): Promise<string> {
  const renderer = new NotionRenderer()
  renderer.use(hljsPlugin({}))
  renderer.use(bookmarkPlugin(undefined))

  try {
    console.log("Fetching page content for:", pageId)

    // Test connection first
    const connectionTest = await testNotionConnection()
    if (!connectionTest.success) {
      throw new Error(`Notion connection failed: ${connectionTest.message}`)
    }

    // Get all blocks from the page
    const { results } = await notion.blocks.children.list({
      block_id: pageId,
    })

    console.log("Blocks retrieved:", results.length)

    if (results.length === 0) {
      return "<p>This page has no content.</p>"
    }

    // Render the blocks to HTML
    const content = await renderer.render(...results)
    console.log("Content rendered, length:", content.length)

    return content || "<p>Content could not be rendered.</p>"
  } catch (error: any) {
    console.error(`Error fetching content for page ${pageId}:`, error)

    if (error.code === "object_not_found") {
      throw new Error(`Page not found: ${pageId}`)
    } else if (error.code === "unauthorized") {
      throw new Error(`Unauthorized access to page: ${pageId}`)
    }

    throw error
  }
}
