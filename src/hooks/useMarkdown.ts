import { useMemo } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { markedEmoji } from 'marked-emoji'

const emojis: Record<string, string> = {
  smile: '😄', laughing: '😆', blush: '😊', heart_eyes: '😍', smirk: '😏',
  confused: '😕', cry: '😢', joy: '😂', scream: '😱', rage: '😡',
  thumbsup: '👍', thumbsdown: '👎', clap: '👏', fire: '🔥', star: '⭐',
  sparkles: '✨', zap: '⚡', check: '✅', x: '❌', warning: '⚠️',
  heart: '❤️', broken_heart: '💔', kiss: '💋', tada: '🎉', trophy: '🏆',
  thinking: '🤔', rolling_eyes: '🙄', wink: '😉', nerd: '🤗',
  ok: '👌', v: '✌️', wave: '👋', point_up: '☝️', point_down: '👇',
  pray: '🙏', muscle: '💪', eyes: '👀', tongue: '😛', sunglasses: '😎',
  ghost: '👻', alien: '👽', robot: '🤖', poo: '💩', skull: '💀',
  sun: '☀️', moon: '🌙', cloud: '☁️', rain: '🌧️', snow: '❄️',
  umbrella: '☂️', rainbow: '🌈', ocean: '🌊', earth: '🌍',
  rocket: '🚀', airplane: '✈️', car: '🚗', bike: '🚲',
  book: '📖', pencil: '✏️', memo: '📝', email: '📧', phone: '📞',
  lock: '🔒', key: '🔑', bell: '🔔', bookmark: '🔖',
  bulb: '💡', wrench: '🔧', hammer: '🔨', gear: '⚙️',
  link: '🔗', gem: '💎', crown: '👑', money: '💰',
  gift: '🎁', cake: '🎂', pizza: '🍕', coffee: '☕',
  music: '🎵', art: '🎨', movie: '🎬', game: '🎮',
  run: '🏃', swim: '🏊', soccer: '⚽', basketball: '🏀',
  flag_red: '🚩', flag_white: '🏳️', peace: '☮️', yin_yang: '☯️',
  plus: '➕', minus: '➖', multiply: '✖️', divide: '➗',
  question: '❓', exclamation: '❗', information: 'ℹ️',
  abc: '🔤', ab: '🆎', cl: '🆑', sos: '🆘',
  up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️',
  arrow_up: '🔼', arrow_down: '🔽', arrow_left: '◀️', arrow_right: '▶️',
  recycle: '♻️', white_check_mark: '✅', negative_squared_cross_mark: '❎',
  loop: '🔁', refresh: '🔄', new_: '🆕', free: '🆓',
  zero: '0️⃣', one: '1️⃣', two: '2️⃣', three: '3️⃣', four: '4️⃣',
  five: '5️⃣', six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟',
  hash: '#️⃣', asterisk: '*️⃣',
  copyright: '©️', registered: '®️', trademark: '™️',
}

marked.use(markedEmoji({
  emojis,
  renderer: (token) => token.emoji,
}))

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

function normalizeMarkdown(text: string): string {
  return text
    .replace(/＊/g, '*')   // 全角星号 → 半角
    .replace(/＃/g, '#')   // 全角井号 → 半角
    .replace(/＿/g, '_')   // 全角下划线 → 半角
    .replace(/～/g, '~')   // 全角波浪 → 半角
    .replace(/（/g, '(')   // 全角括号 → 半角
    .replace(/）/g, ')')
    .replace(/【/g, '[')   // 全角方括号 → 半角
    .replace(/】/g, ']')
    .replace(/：/g, ':')   // 全角冒号 → 半角
    .replace(/｜/g, '|')   // 全角竖线 → 半角（表格用）
}

export function useMarkdown(source: string) {
  const html = useMemo(() => {
    return marked.parse(normalizeMarkdown(source), { renderer }) as string
  }, [source])

  return html
}
