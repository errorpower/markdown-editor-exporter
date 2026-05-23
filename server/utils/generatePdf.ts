import PDFDocument from 'pdfkit'
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

interface StreamCollector {
  chunks: Buffer[]
  resolve: (buf: Buffer) => void
}

function streamToBuffer(stream: PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', (chunk: Buffer) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

function addInlineText(doc: PDFDocument, tokens: Token[], x: number, y: number): number {
  let currentX = x
  for (const token of tokens) {
    if (token.type === 'text') {
      doc.text(token.text, currentX, y, { continued: true })
    } else if (token.type === 'strong') {
      doc.font('Helvetica-Bold')
      if (token.tokens) {
        for (const t of token.tokens) {
          if (t.type === 'text') doc.text(t.text, currentX, y, { continued: true })
        }
      } else {
        doc.text(token.text, currentX, y, { continued: true })
      }
      doc.font('Helvetica')
    } else if (token.type === 'em') {
      doc.font('Helvetica-Oblique')
      if (token.tokens) {
        for (const t of token.tokens) {
          if (t.type === 'text') doc.text(t.text, currentX, y, { continued: true })
        }
      } else {
        doc.text(token.text, currentX, y, { continued: true })
      }
      doc.font('Helvetica')
    } else if (token.type === 'codespan') {
      doc.font('Courier')
      doc.text(token.text, currentX, y, { continued: true })
      doc.font('Helvetica')
    } else {
      doc.text(token.raw || '', currentX, y, { continued: true })
    }
  }
  doc.text('', { continued: false })
  return doc.y
}

export async function generatePdf(markdown: string): Promise<Buffer> {
  const tokens = marked.lexer(normalizeMarkdown(markdown))
  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  const bufferPromise = streamToBuffer(doc)

  const margin = 50
  const pageWidth = doc.page.width - margin * 2

  for (const token of tokens) {
    if (doc.y > doc.page.height - 100) {
      doc.addPage()
    }

    switch (token.type) {
      case 'heading': {
        const sizes: Record<number, number> = { 1: 24, 2: 20, 3: 16, 4: 14, 5: 12, 6: 11 }
        doc.fontSize(sizes[token.depth] || 12)
        doc.font('Helvetica-Bold')
        if (token.tokens) {
          const text = token.tokens.map(t => t.raw || '').join('')
          doc.text(text, margin, doc.y, { width: pageWidth })
        } else {
          doc.text(token.text, margin, doc.y, { width: pageWidth })
        }
        doc.moveDown(0.3)
        if (token.depth <= 2) {
          doc.moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke('#E5E7EB')
          doc.moveDown(0.3)
        }
        doc.fontSize(11).font('Helvetica')
        break
      }
      case 'paragraph': {
        doc.fontSize(11).font('Helvetica')
        if (token.tokens) {
          doc.y = addInlineText(doc, token.tokens, margin, doc.y)
        } else {
          doc.text(token.text, margin, doc.y, { width: pageWidth })
        }
        doc.moveDown(0.5)
        break
      }
      case 'list': {
        doc.fontSize(11).font('Helvetica')
        for (let i = 0; i < token.items.length; i++) {
          const item = token.items[i]
          const bullet = token.ordered ? `${(token.start || 1) + i}. ` : '• '
          const text = item.tokens
            ? item.tokens.map(t => {
                if (t.type === 'text') return t.text
                if (t.type === 'paragraph') return t.tokens?.map(tt => tt.raw || '').join('') || t.text
                return t.raw || ''
              }).join('')
            : item.text
          doc.text(`${bullet}${text}`, margin + 15, doc.y, { width: pageWidth - 15 })
          doc.moveDown(0.2)
        }
        doc.moveDown(0.3)
        break
      }
      case 'code': {
        doc.fontSize(9).font('Courier')
        doc.rect(margin - 5, doc.y - 5, pageWidth + 10, doc.heightOfString(token.text, { width: pageWidth }) + 10)
          .fill('#F3F4F6')
        doc.fill('#1F2937')
        doc.text(token.text, margin, doc.y, { width: pageWidth })
        doc.fill('#000000')
        doc.fontSize(11).font('Helvetica')
        doc.moveDown(0.5)
        break
      }
      case 'blockquote': {
        doc.save()
        doc.moveTo(margin, doc.y).lineTo(margin, doc.y + 20).lineWidth(3).stroke('#D1D5DB')
        doc.fontSize(11).font('Helvetica-Oblique').fillColor('#6B7280')
        if (token.tokens) {
          for (const t of token.tokens) {
            if (t.type === 'paragraph' && t.tokens) {
              const text = t.tokens.map(tt => tt.raw || '').join('')
              doc.text(text, margin + 15, doc.y, { width: pageWidth - 15 })
            }
          }
        }
        doc.fillColor('#000000').font('Helvetica')
        doc.restore()
        doc.moveDown(0.5)
        break
      }
      case 'hr': {
        doc.moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).lineWidth(1).stroke('#E5E7EB')
        doc.moveDown(0.5)
        break
      }
      case 'table': {
        doc.fontSize(10).font('Helvetica')
        const colWidth = pageWidth / token.header.length
        let tableY = doc.y

        // Header
        doc.font('Helvetica-Bold')
        for (let i = 0; i < token.header.length; i++) {
          const text = token.header[i].text
          doc.text(text, margin + i * colWidth, tableY, { width: colWidth - 5 })
        }
        doc.font('Helvetica')
        tableY = doc.y + 5
        doc.moveTo(margin, tableY).lineTo(margin + pageWidth, tableY).stroke('#E5E7EB')
        doc.y = tableY + 5

        // Rows
        for (const row of token.rows) {
          for (let i = 0; i < row.length; i++) {
            doc.text(row[i].text, margin + i * colWidth, doc.y, { width: colWidth - 5, continued: false })
          }
          doc.moveDown(0.2)
        }
        doc.moveDown(0.3)
        break
      }
      default:
        break
    }
  }

  doc.end()
  return bufferPromise
}
