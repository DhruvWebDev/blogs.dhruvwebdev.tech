import { notion } from "./client"
import { NotionRenderer } from "@notion-render/client"
import hljsPlugin from "@notion-render/hljs-plugin"
import bookmarkPlugin from "@notion-render/bookmark-plugin"

export async function getPageContent(pageId: string): Promise<string> {
  const renderer = new NotionRenderer()
  renderer.use(hljsPlugin({}))
  renderer.use(bookmarkPlugin(undefined))

  try {
    const { results } = await notion.blocks.children.list({
      block_id: pageId,
    })

    return await renderer.render(...results)
  } catch (error) {
    console.error(`Error fetching content for page ${pageId}:`, error)
    return ""
  }
}
