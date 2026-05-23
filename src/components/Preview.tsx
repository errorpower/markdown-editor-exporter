import { useMarkdown } from '../hooks/useMarkdown'

interface Props {
  markdown: string
  previewRef: React.RefObject<HTMLDivElement | null>
}

export default function Preview({ markdown, previewRef }: Props) {
  const html = useMarkdown(markdown)

  return (
    <div
      ref={previewRef}
      className="preview-body w-full h-full overflow-auto p-6 bg-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
