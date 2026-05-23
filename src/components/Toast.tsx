import { useEffect, useState } from 'react'

interface Props {
  message: string | null
  onDone: () => void
}

export default function Toast({ message, onDone }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onDone, 300)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message, onDone])

  if (!message) return null

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      {message}
    </div>
  )
}
