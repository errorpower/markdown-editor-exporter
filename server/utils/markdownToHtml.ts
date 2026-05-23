import { marked } from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const renderer = new marked.Renderer()

renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = hljs.highlight(text, { language }).value
  return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
}

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown) as string
}
