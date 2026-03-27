import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import facebookRoutes from './routes/facebook.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'   // your React dev server
}))
app.use(express.json())

// Routes
app.use('/api/facebook', facebookRoutes)

// Health check — visit this in browser to confirm server is alive
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})