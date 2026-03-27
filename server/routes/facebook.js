import { Router } from 'express'
import axios from 'axios'

const router = Router()

const GRAPH = 'https://graph.facebook.com/v19.0'

// Test route — we'll replace these with real logic in later steps
router.get('/test', (req, res) => {
  res.json({ message: 'Facebook router is working' })
})

export default router
