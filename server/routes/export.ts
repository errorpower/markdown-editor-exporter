import { Router, type Request, type Response } from 'express'
import { generatePdf } from '../utils/generatePdf.js'
import { generateWord } from '../utils/generateWord.js'

const router = Router()

router.post('/export/pdf', async (req: Request, res: Response) => {
  try {
    const { markdown, filename } = req.body
    if (!markdown || typeof markdown !== 'string') {
      res.status(400).json({ error: 'markdown field is required' })
      return
    }
    const pdfBuffer = await generatePdf(markdown)
    const name = filename || 'document.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}"`)
    res.send(pdfBuffer)
  } catch (err) {
    console.error('PDF export error:', err)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
})

router.post('/export/word', async (req: Request, res: Response) => {
  try {
    const { markdown, filename } = req.body
    if (!markdown || typeof markdown !== 'string') {
      res.status(400).json({ error: 'markdown field is required' })
      return
    }
    const wordBuffer = await generateWord(markdown)
    const name = filename || 'document.docx'
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}"`)
    res.send(wordBuffer)
  } catch (err) {
    console.error('Word export error:', err)
    res.status(500).json({ error: 'Failed to generate Word document' })
  }
})

export default router
