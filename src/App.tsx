import { useState, useRef, useCallback, useEffect } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'
import ActionBar from './components/ActionBar'
import StatusBar from './components/StatusBar'
import Toast from './components/Toast'
import { useLocalStorage } from './hooks/useLocalStorage'

const DEFAULT_MARKDOWN = `# 欢迎使用 EditMD

这是一个轻量的 Markdown 编辑器，支持实时预览和导出。

## 功能特性

- **实时预览** — 左侧编辑，右侧即时渲染
- **导出 PDF** — 保留代码高亮和排版样式
- **导出 Word** — 生成 .docx 文档
- **一键复制** — 复制 Markdown 源码
- **自动保存** — 内容自动保存到浏览器
- **文件导入** — 拖拽 .md 文件到编辑区

## 代码示例

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}

hello('World');
\`\`\`

## 表格

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| 编辑器 | ✅ | 支持 Tab 缩进 |
| 预览 | ✅ | 实时渲染 |
| PDF 导出 | ✅ | 客户端生成 |
| Word 导出 | ✅ | 客户端生成 |

## 引用

> 这是一段引用文本。
> 可以多行书写。

---

开始编辑吧！试试工具栏上的快捷按钮。
`

export default function App() {
  const [markdown, setMarkdown] = useLocalStorage('editmd-content', DEFAULT_MARKDOWN)
  const [toast, setToast] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const charCount = markdown.length
  const lineCount = markdown.split('\n').length

  const handleToast = useCallback((msg: string) => {
    setToast(msg)
  }, [])

  const handleToastDone = useCallback(() => {
    setToast(null)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const text = (e as CustomEvent).detail as string
      if (text) setMarkdown(text)
    }
    window.addEventListener('import-file', handler)
    return () => window.removeEventListener('import-file', handler)
  }, [setMarkdown])

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            <span className="text-green-600">Edit</span>MD
          </h1>
          <Toolbar markdown={markdown} onChange={setMarkdown} textareaRef={textareaRef} />
        </div>
        <ActionBar markdown={markdown} previewRef={previewRef} onToast={handleToast} />
      </header>

      {/* Main editor area */}
      <div className="flex-1 flex min-h-0">
        {/* Editor pane */}
        <div className="w-1/2 flex flex-col border-r border-gray-200">
          <div className="px-3 py-2 text-2xl font-medium text-gray-500 bg-gray-50 border-b border-gray-200">
            Markdown
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor value={markdown} onChange={setMarkdown} textareaRef={textareaRef} />
          </div>
        </div>

        {/* Preview pane */}
        <div className="w-1/2 flex flex-col">
          <div className="px-3 py-2 text-2xl font-medium text-gray-500 bg-gray-50 border-b border-gray-200">
            预览
          </div>
          <div className="flex-1 overflow-hidden">
            <Preview markdown={markdown} previewRef={previewRef} />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <StatusBar charCount={charCount} lineCount={lineCount} />

      {/* Toast */}
      <Toast message={toast} onDone={handleToastDone} />
    </div>
  )
}
