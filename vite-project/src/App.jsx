import { useState } from 'react'

function App() {
  const [user, setUser] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPage, setSelectedPage] = useState('')
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="container">
      <h1>Facebook Page Insights</h1>
      <p className="subtitle">Connect your Facebook account to view page analytics.</p>

      {/* We'll drop components here as we build them */}
    </div>
  )
}

export default App