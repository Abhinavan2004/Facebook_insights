import { useState, useEffect } from 'react';
import FacebookLoginComponent from './components/FacebookLoginComponent';

function App() {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  
  // States for Insight Form
  const [selectedPageId, setSelectedPageId] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  
  // Data States
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (user?.accessToken) {
      fetch(`${BACKEND_URL}/api/pages?accessToken=${user.accessToken}`)
        .then(res => res.json())
        .then(data => {
            if (data.pages) setPages(data.pages);
        })
        .catch(err => console.error("Failed to load pages", err));
    }
  }, [user]);

  const fetchInsights = async () => {
    if (!selectedPageId || !since || !until) return;
    setLoading(true);
    setErrorMsg("");
    setInsights(null);

    const page = pages.find(p => p.id === selectedPageId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/insights?pageId=${page.id}&pageAccessToken=${page.access_token}&since=${since}&until=${until}`);
      const data = await res.json();
      
      if (data.data) {
        setInsights(data.data);
      } else {
        setErrorMsg("Error: " + (data.error || "No data returned"));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to backend");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>Facebook Page Insights Dashboard</h1>
      
      {!user ? (
        <FacebookLoginComponent onLogin={(data) => setUser(data)} />
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: '40px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px' }}>
            <img src={user.picture?.data?.url} alt="Profile" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
            <h3 style={{ margin: 0 }}>Welcome, {user.name}!</h3>
          </div>

          {/* Controls Form */}
          <div style={{ padding: '20px', backgroundColor: '#2d2d2d', borderRadius: '8px', marginBottom: '30px' }}>
            <label><strong>Select a Managed Facebook Page:</strong></label>
            <select 
              value={selectedPageId} 
              onChange={(e) => setSelectedPageId(e.target.value)}
              style={{ display: 'block', width: '100%', padding: '10px', marginTop: '10px', fontSize: '16px', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
            >
              <option value="" disabled>-- Choose a Page --</option>
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.name}</option>
              ))}
            </select>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>Since:</label>
                <input type="date" value={since} onChange={e => setSince(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', colorScheme: 'dark' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Until:</label>
                <input type="date" value={until} onChange={e => setUntil(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', colorScheme: 'dark' }} />
              </div>
            </div>

            <button 
              onClick={fetchInsights} 
              disabled={!selectedPageId || !since || !until || loading}
              style={{ marginTop: '20px', padding: '12px 20px', width: '100%', backgroundColor: '#0866ff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: (!selectedPageId || !since || !until) ? 'not-allowed' : 'pointer', opacity: (!selectedPageId || !since || !until) ? 0.6 : 1 }}
            >
              {loading ? 'Fetching Insights...' : 'Get Insights'}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{ backgroundColor: '#ff4c4c', color: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
              {errorMsg}
            </div>
          )}

          {/* Insights Grid */}
          {insights && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Results for {pages.find(p=>p.id === selectedPageId)?.name}</h2>
              {insights.length === 0 ? (
                <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                  <p style={{ color: '#aaa', fontSize: '18px', margin: 0 }}>No insights data available for this date range.</p>
                  <p style={{ color: '#888', fontSize: '14px', marginTop: '10px', fontStyle: 'italic' }}>(This is normal for newly-created test pages with 0 views or followers!)</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                {insights.map(item => {
                  let val = 0;
                  if (item.values && item.values.length > 0) {
                    if (typeof item.values[0].value === 'number') {
                      val = item.values.reduce((sum, v) => sum + (v.value || 0), 0);
                    } else if (typeof item.values[0].value === 'object') {
                      val = JSON.stringify(item.values[0].value);
                    } else {
                      val = item.values[0].value;
                    }
                  }
                  
                  const metricTitles = {
                    page_daily_follows_unique: "Total Followers / Fans",
                    page_fans: "Total Followers / Fans",
                    page_post_engagements: "Total Engagement",
                    page_impressions_unique: "Total Impressions",
                    page_impressions: "Total Impressions",
                    page_actions_post_reactions_total: "Total Reactions"
                  };
                  
                  return (
                    <div key={item.name} style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                      <h4 style={{ color: '#aaa', margin: '0 0 10px 0', textTransform: 'capitalize' }}>
                        {metricTitles[item.name] || item.title || item.name.replace(/_/g, ' ')}
                      </h4>
                      <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#4CAF50' }}>{val}</p>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
