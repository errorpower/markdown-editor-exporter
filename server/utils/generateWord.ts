import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  TableRow,
  TableCell,
  Table,
  WidthType,
} from 'docx'
import { marked, type Token } from 'marked'
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
  deciduous_tree: '🌳', flame: '🔥',
}

marked.use(markedEmoji({ emojis, renderer: (token) => token.emoji }))

function normalizeMarkdown(text: string): string {
  return text
    .replace(/＊/g, '*')
    .replace(/＃/g, '#')
    .replace(/＿/g, '_')
    .replace(/～/g, '~')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/【/g, '[')
    .replace(/】/g, ']')
    .replace(/：/g, ':')
    .replace(/｜/g, '|')
}

function parseInlineTokens(tokens: Token[], parentFormat?: Record<string, unknown>): TextRun[] {
  const runs: TextRun[] = []
  for (const token of tokens) {
    if (token.type === 'text') {
      runs.push(new TextRun({ text: token.text, ...parentFormat }))
    } else if (token.type === 'strong') {
      const inner = token.tokens
        ? parseInlineTokens(token.tokens, { ...parentFormat, bold: true })
        : [new TextRun({ text: token.text, ...parentFormat, bold: true })]
      runs.push(...inner)
    } else if (token.type === 'em') {
      const inner = token.tokens
        ? parseInlineTokens(token.tokens, { ...parentFormat, italics: true })
        : [new TextRun({ text: token.text, ...parentFormat, italics: true })]
      runs.push(...inner)
    } else if (token.type === 'codespan') {
      runs.push(new TextRun({ text: token.text, font: 'Courier New', size: 20, ...parentFormat }))
    } else if (token.type === 'link') {
      const inner = token.tokens
        ? parseInlineTokens(token.tokens, { ...parentFormat, color: '2563EB' })
        : [new TextRun({ text: token.text, ...parentFormat, color: '2563EB' })]
      runs.push(...inner)
    } else if (token.type === 'del') {
      const inner = token.tokens
        ? parseInlineTokens(token.tokens, { ...parentFormat, strike: true })
        : [new TextRun({ text: token.text, ...parentFormat, strike: true })]
      runs.push(...inner)
    } else {
      runs.push(new TextRun({ text: token.raw || '', ...parentFormat }))
    }
  }
  return runs
}

function tokenToParagraphs(token: Token): Paragraph[] {
  switch (token.type) {
    case 'heading': {
      const level = token.depth
      const headingMap: Record<number, typeof HeadingLevel[keyof typeof HeadingLevel]> = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6,
      }
      const runs = token.tokens ? parseInlineTokens(token.tokens) : [new TextRun({ text: token.text })]
      return [new Paragraph({ children: runs, heading: headingMap[level] || HeadingLevel.HEADING_1 })]
    }
    case 'paragraph': {
      const runs = token.tokens ? parseInlineTokens(token.tokens) : [new TextRun({ text: token.text })]
      return [new Paragraph({ children: runs, spacing: { after: 120 } })]
    }
    case 'list': {
      const items: Paragraph[] = []
      for (const item of token.items) {
        const runs = item.tokens
          ? item.tokens.flatMap(t => {
              if (t.type === 'text') return parseInlineTokens(t.tokens || [t])
              if (t.type === 'paragraph') return parseInlineTokens(t.tokens || [])
              return [new TextRun({ text: t.raw || '' })]
            })
          : [new TextRun({ text: item.text })]
        items.push(new Paragraph({ children: runs, bullet: { level: 0 } }))
      }
      return items
    }
    case 'code': {
      return [
        new Paragraph({
          children: [new TextRun({ text: token.text, font: 'Courier New', size: 20 })],
          shading: { fill: 'F3F4F6' },
          spacing: { before: 120, after: 120 },
        }),
      ]
    }
    case 'blockquote': {
      if (!token.tokens) return []
      const inner: Paragraph[] = []
      for (const t of token.tokens) {
        if (t.type === 'paragraph' && t.tokens) {
          const runs = parseInlineTokens(t.tokens)
          inner.push(new Paragraph({
            children: runs,
            indent: { left: 720 },
          }))
        } else {
          inner.push(...tokenToParagraphs(t))
        }
      }
      return inner
    }
    case 'hr': {
      return [new Paragraph({ text: '', thematicBreak: true })]
    }
    case 'table': {
      const headerRow = new TableRow({
        children: token.header.map(cell => {
          const runs = cell.tokens ? parseInlineTokens(cell.tokens) : [new TextRun({ text: cell.text })]
          return new TableCell({
            children: [new Paragraph({ children: runs })],
            width: { size: 100 / token.header.length, type: WidthType.PERCENTAGE },
          })
        }),
      })
      const bodyRows = token.rows.map(row => {
        return new TableRow({
          children: row.map(cell => {
            const runs = cell.tokens ? parseInlineTokens(cell.tokens) : [new TextRun({ text: cell.text })]
            return new TableCell({
              children: [new Paragraph({ children: runs })],
              width: { size: 100 / token.header.length, type: WidthType.PERCENTAGE },
            })
          }),
        })
      })
      return [
        new Table({
          rows: [headerRow, ...bodyRows],
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
      ]
    }
    default: {
      if ('text' in token) {
        return [new Paragraph({ children: [new TextRun({ text: (token as any).text || '' })] })]
      }
      return []
    }
  }
}

export async function generateWord(markdown: string): Promise<Buffer> {
  const tokens = marked.lexer(normalizeMarkdown(markdown))
  const paragraphs: Paragraph[] = []
  for (const token of tokens) {
    paragraphs.push(...tokenToParagraphs(token))
  }
  const doc = new Document({ sections: [{ children: paragraphs }] })
  const buffer = await Packer.toBuffer(doc)
  return buffer
}
