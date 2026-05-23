import { useCallback, useState, useRef, useEffect, type RefObject } from 'react'

interface Props {
  markdown: string
  onChange: (value: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

interface ToolbarAction {
  label: string
  icon: string
  prefix: string
  suffix: string
  placeholder: string
}

const actions: ToolbarAction[] = [
  { label: '加粗', icon: 'B', prefix: '**', suffix: '**', placeholder: '粗体文本' },
  { label: '斜体', icon: 'I', prefix: '*', suffix: '*', placeholder: '斜体文本' },
  { label: '删除线', icon: '~', prefix: '~~', suffix: '~~', placeholder: '删除线文本' },
  { label: '链接', icon: '🔗', prefix: '[', suffix: '](url)', placeholder: '链接文本' },
  { label: '图片', icon: '🖼', prefix: '![', suffix: '](url)', placeholder: '图片描述' },
  { label: '代码', icon: '`', prefix: '`', suffix: '`', placeholder: '代码' },
  { label: '代码块', icon: '</>', prefix: '```\n', suffix: '\n```', placeholder: '代码块' },
  { label: '引用', icon: '❝', prefix: '> ', suffix: '', placeholder: '引用内容' },
  { label: '无序列表', icon: '•', prefix: '- ', suffix: '', placeholder: '列表项' },
  { label: '有序列表', icon: '1.', prefix: '1. ', suffix: '', placeholder: '列表项' },
  { label: '任务列表', icon: '☑', prefix: '- [ ] ', suffix: '', placeholder: '任务项' },
  { label: '分割线', icon: '—', prefix: '\n---\n', suffix: '', placeholder: '' },
  { label: '表格', icon: '▦', prefix: '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n', suffix: '', placeholder: '' },
]

const headings = [
  { label: 'H1', prefix: '# ' },
  { label: 'H2', prefix: '## ' },
  { label: 'H3', prefix: '### ' },
  { label: 'H4', prefix: '#### ' },
]

const emojiGroups = [
  {
    name: '常用',
    emojis: ['😀', '😂', '🤣', '😊', '😍', '🤔', '😱', '😡', '👍', '👎', '👏', '🙏', '💪', '🎉', '🔥', '❤️', '⭐', '✅', '❌', '⚠️'],
  },
  {
    name: '表情',
    emojis: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡'],
  },
  {
    name: '手势',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾'],
  },
  {
    name: '符号',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '⭐', '🌟', '✨', '⚡', '🔥', '💫', '☀️', '🌙', '🌈', '❄️', '💧', '🌊', '🎵', '🎶', '🔇', '🔈', '🔉', '🔊'],
  },
  {
    name: '物体',
    emojis: ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💾', '💿', '📷', '📹', '🎥', '📽️', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '💡', '🔦', '🕯️', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '✏️', '🖊️', '🖋️', '📝', '📁', '📂', '📌', '📎'],
  },
  {
    name: '食物',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷'],
  },
]

export default function Toolbar({ markdown, onChange, textareaRef }: Props) {
  const [showEmoji, setShowEmoji] = useState(false)
  const [activeGroup, setActiveGroup] = useState(0)
  const emojiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const insertEmoji = useCallback(
    (emoji: string) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const newText = markdown.substring(0, start) + emoji + markdown.substring(start)
      onChange(newText)
      setShowEmoji(false)
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length
      })
    },
    [markdown, onChange, textareaRef]
  )

  const insertText = useCallback(
    (action: ToolbarAction) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = markdown.substring(start, end)
      const text = selected || action.placeholder
      const newText = markdown.substring(0, start) + action.prefix + text + action.suffix + markdown.substring(end)
      onChange(newText)
      requestAnimationFrame(() => {
        textarea.focus()
        if (selected) {
          textarea.selectionStart = start + action.prefix.length
          textarea.selectionEnd = start + action.prefix.length + text.length
        } else {
          textarea.selectionStart = start + action.prefix.length
          textarea.selectionEnd = start + action.prefix.length + action.placeholder.length
        }
      })
    },
    [markdown, onChange, textareaRef]
  )

  const insertHeading = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const lineStart = markdown.lastIndexOf('\n', start - 1) + 1
      const newText = markdown.substring(0, lineStart) + prefix + markdown.substring(lineStart)
      onChange(newText)
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.selectionStart = textarea.selectionEnd = start + prefix.length
      })
    },
    [markdown, onChange, textareaRef]
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {headings.map((h) => (
        <button
          key={h.label}
          onClick={() => insertHeading(h.prefix)}
          className="px-5 py-3 text-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title={h.label}
        >
          {h.label}
        </button>
      ))}
      <div className="w-px h-10 bg-gray-300 mx-1.5" />
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => insertText(action)}
          className="w-14 h-14 flex items-center justify-center text-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title={action.label}
        >
          {action.icon}
        </button>
      ))}
      <div className="w-px h-10 bg-gray-300 mx-1.5" />
      <div className="relative" ref={emojiRef}>
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="w-14 h-14 flex items-center justify-center text-3xl bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="插入 Emoji"
        >
          😊
        </button>
        {showEmoji && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-80">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {emojiGroups.map((group, i) => (
                <button
                  key={group.name}
                  onClick={() => setActiveGroup(i)}
                  className={`px-3 py-1.5 text-xs whitespace-nowrap ${
                    activeGroup === i
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {group.name}
                </button>
              ))}
            </div>
            <div className="p-2 h-48 overflow-y-auto">
              <div className="grid grid-cols-10 gap-0.5">
                {emojiGroups[activeGroup].emojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => insertEmoji(emoji)}
                    className="w-7 h-7 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 py-1.5 border-t border-gray-100 text-xs text-gray-400">
              也可输入 :emoji_name: 格式，如 :smile: :fire: :heart:
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
