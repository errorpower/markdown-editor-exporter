import { useState, useCallback } from 'react'
import { exportPdf } from '../utils/exportPdf'
import { exportWord } from '../utils/exportWord'
import { copyToClipboard } from '../utils/copyToClipboard'

interface Props {
  markdown: string
  previewRef: React.RefObject<HTMLDivElement | null>
  onToast: (message: string) => void
}

export default function ActionBar({ markdown, previewRef, onToast }: Props) {
  const [exporting, setExporting] = useState<string | null>(null)

  const handleExportPdf = useCallback(async () => {
    if (!previewRef.current) return
    setExporting('pdf')
    try {
      await exportPdf(previewRef.current)
      onToast('PDF 导出成功')
    } catch (e) {
      onToast('PDF 导出失败')
      console.error(e)
    } finally {
      setExporting(null)
    }
  }, [previewRef, onToast])

  const handleExportWord = useCallback(async () => {
    setExporting('word')
    try {
      await exportWord(markdown)
      onToast('Word 文档导出成功')
    } catch (e) {
      onToast('Word 导出失败')
      console.error(e)
    } finally {
      setExporting(null)
    }
  }, [markdown, onToast])

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(markdown)
    onToast(ok ? '已复制到剪贴板' : '复制失败')
  }, [markdown, onToast])

  const handleImportFile = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const text = ev.target?.result as string
          if (text) {
            // dispatch event so App can pick it up
            window.dispatchEvent(new CustomEvent('import-file', { detail: text }))
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [])

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleImportFile}
        className="px-6 py-3 text-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="导入 .md 文件"
      >
        导入
      </button>
      <div className="w-px h-10 bg-gray-300" />
      <button
        onClick={handleCopy}
        className="px-6 py-3 text-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        复制
      </button>
      <button
        onClick={handleExportWord}
        disabled={exporting === 'word'}
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg transition-colors"
      >
        {exporting === 'word' ? '导出中...' : 'Word'}
      </button>
      <button
        onClick={handleExportPdf}
        disabled={exporting === 'pdf'}
        className="px-6 py-3 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors"
      >
        {exporting === 'pdf' ? '导出中...' : 'PDF'}
      </button>
    </div>
  )
}
