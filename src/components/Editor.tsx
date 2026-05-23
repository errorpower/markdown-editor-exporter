import { useCallback, type DragEvent } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export default function Editor({ value, onChange, textareaRef }: Props) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        const textarea = textareaRef.current
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue = value.substring(0, start) + '  ' + value.substring(end)
        onChange(newValue)
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        })
      }
    },
    [value, onChange, textareaRef]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && (file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.name.endsWith('.txt'))) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const text = ev.target?.result as string
          if (text) onChange(text)
        }
        reader.readAsText(file)
      }
    },
    [onChange]
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
  }, [])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="w-full h-full resize-none p-6 font-mono text-xl leading-relaxed bg-white text-gray-800 outline-none border-none"
      placeholder="输入 Markdown 内容...&#10;&#10;支持拖拽 .md 文件导入"
      spellCheck={false}
    />
  )
}
