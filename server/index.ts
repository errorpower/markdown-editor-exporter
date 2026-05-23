import express from 'express'
import cors from 'cors'
import exportRouter from './routes/export.js'

const app = express()
const PORT = 7813

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api', exportRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EditMD API' })
})

app.listen(PORT, () => {
  console.log(`EditMD API server running at http://localhost:${PORT}`)
  console.log(`  POST /api/export/pdf   - Convert markdown to PDF`)
  console.log(`  POST /api/export/word  - Convert markdown to Word`)
  console.log(`  GET  /api/health       - Health check`)
})
