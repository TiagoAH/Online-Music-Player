// server.js
const express = require('express');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const port = 3000;

// In-memory queue array
let musicQueue = [];

app.use(express.static(path.join(__dirname, 'public')));

// Serve audio files
app.get('/audio/:videoId', async (req, res) => {
  const videoId = req.params.videoId;
  const audioInfo = await ytdl.getInfo(videoId);
  const audioFormat = ytdl.chooseFormat(audioInfo.formats, { filter: 'audioonly' });
  const audioStream = ytdl(audioInfo.videoDetails.video_url, { format: audioFormat });
  audioStream.pipe(res);
});

app.get('/search', async (req, res) => {
  const query = req.query.query;
  const maxResults = req.query.maxResults || 5;

  const apiKey = 'AIzaSyAPhDqEUPVEy9iBEbi_ycUTXEfFxgU3Dak'; // Replace with your actual API key
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});