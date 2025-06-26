import { type NextRequest, NextResponse } from "next/server"
import { getAllBlogPosts, testNotionConnection } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Blog API Route Debug Info ===")

    // Environment check
    const databaseId = process.env.NOTION_DATABASE_ID
    const notionSecret = process.env.NEXT_NOTION_SECRET

    console.log("Environment variables:")
    console.log("- NOTION_DATABASE_ID:", databaseId ? `Set (${databaseId})` : "❌ NOT SET")
    console.log("- NEXT_NOTION_SECRET:", notionSecret ? `Set (${notionSecret.substring(0, 10)}...)` : "❌ NOT SET")

    if (!databaseId) {
      return NextResponse.json(
        {
          error: "Database configuration missing",
          message: "NOTION_DATABASE_ID environment variable is not set",
          setup: {
            step1: "Add NOTION_DATABASE_ID to your .env.local file",
            step2: "Get your database ID from the Notion URL",
            step3: "Format: NOTION_DATABASE_ID=your-database-id-here",
          },
        },
        { status: 500 },
      )
    }

    if (!notionSecret) {
      return NextResponse.json(
        {
          error: "Notion secret missing",
          message: "NEXT_NOTION_SECRET environment variable is not set",
          setup: {
            step1: "Create a Notion integration at https://notion.so/my-integrations",
            step2: "Copy the Internal Integration Token",
            step3: "Add NEXT_NOTION_SECRET=your-token to .env.local",
          },
        },
        { status: 500 },
      )
    }

    // Test connection
    console.log("Testing Notion connection...")
    const connectionTest = await testNotionConnection()
    if (!connectionTest.success) {
      return NextResponse.json(
        {
          error: "Notion connection failed",
          message: connectionTest.message,
          troubleshooting: [
            "1. Verify your NEXT_NOTION_SECRET is correct",
            "2. Check that your Notion integration is active",
            "3. Ensure your integration has the right permissions",
          ],
        },
        { status: 500 },
      )
    }

    console.log("Fetching blogs from database:", databaseId)
    const blogs = await getAllBlogPosts(databaseId)
    console.log("Successfully fetched blogs:", blogs.length)

    return NextResponse.json(blogs, { status: 200 })
  } catch (error: any) {
    console.error("Error in /api/blogs:", error)

    const errorMessage = error.message || "Unknown error"

    // Provide specific help based on error type
    let helpMessage = "Please check your Notion setup"
    let setupSteps: string[] = []

    if (errorMessage.includes("Could not find database")) {
      helpMessage = "Database not found or not accessible"
      setupSteps = [
        "1. Verify your database ID is correct",
        "2. Open your Notion database",
        "3. Click 'Share' in the top right",
        "4. Click 'Invite' and search for your integration name",
        "5. Give it 'Can edit' permissions",
        "6. Make sure the database is not in a private page",
      ]
    } else if (errorMessage.includes("Unauthorized") || errorMessage.includes("unauthorized")) {
      helpMessage = "Integration doesn't have access to the database"
      setupSteps = [
        "1. Go to your Notion database",
        "2. Click 'Share' → 'Invite'",
        "3. Search for your integration name",
        "4. Grant 'Can edit' permissions",
        "5. Ensure the database page is shared with your integration",
      ]
    } else if (errorMessage.includes("connection failed")) {
      helpMessage = "Cannot connect to Notion API"
      setupSteps = [
        "1. Check your NEXT_NOTION_SECRET is correct",
        "2. Verify your integration exists at https://notion.so/my-integrations",
        "3. Make sure the integration token is active",
        "4. Restart your development server",
      ]
    }

    return NextResponse.json(
      {
        error: "Failed to fetch blogs",
        message: errorMessage,
        help: helpMessage,
        setup: setupSteps,
        debug: {
          databaseId: process.env.NOTION_DATABASE_ID,
          hasSecret: !!process.env.NEXT_NOTION_SECRET,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    )
  }
}
