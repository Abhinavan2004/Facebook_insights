const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running normally.' });
});

app.get('/api/pages', async (req, res) => {
  const { accessToken } = req.query;
  if (!accessToken) return res.status(400).json({ error: "No access token provided" });

  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    res.json({ pages: response.data.data }); 
  } catch (error) {
    console.error("Error fetching pages:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

app.get('/api/insights', async (req, res) => {
  const { pageId, pageAccessToken, since, until } = req.query;
  if (!pageId || !pageAccessToken) return res.status(400).json({ error: "Missing required parameters" });

  try {
    let baseUrl = `https://graph.facebook.com/v19.0/${pageId}/insights?access_token=${pageAccessToken}`;
    if (since) baseUrl += `&since=${since}`;
    if (until) baseUrl += `&until=${until}`;
    
    let response;
    try {
      const npeMetrics = 'page_daily_follows_unique,page_post_engagements,page_impressions_unique,page_actions_post_reactions_total';
      response = await axios.get(baseUrl + `&metric=${npeMetrics}`);
    } catch (err) {
      if (err.response?.data?.error?.code === 100) {
        console.log("NPE metrics failed, trying Classic Page metrics...");
        const classicMetrics = 'page_fans,page_post_engagements,page_impressions,page_actions_post_reactions_total';
        response = await axios.get(baseUrl + `&metric=${classicMetrics}`);
      } else {
        throw err;
      }
    }

    res.json({ data: response.data.data });
  } catch (error) {
    console.error("Error fetching insights:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.error?.message || 'Failed to fetch insights' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
