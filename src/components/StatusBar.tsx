interface Props {
  charCount: number
  lineCount: number
}

export default function StatusBar({ charCount, lineCount }: Props) {
  return (
    <div className="flex items-center gap-5 px-4 py-2 text-2xl text-gray-500 bg-gray-50 border-t border-gray-200">
      <span>{charCount} 字符</span>
      <span>{lineCount} 行</span>
      <span className="ml-auto">自动保存已开启</span>
    </div>
  )
}
