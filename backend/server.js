const express = require('express');
const cors = require('cors');
const path = require('path');

// Load .env
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://sienna-walrus-325774.hostingersite.com', 'http://localhost:3001']
}));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// POST /api/ai
app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, action } = req.body;

    if (!prompt || !action) {
      return res.status(400).json({ success: false, error: 'prompt y action son requeridos' });
    }

    const mode = process.env.AI_MODE || 'anthropic';

    if (mode === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ success: false, error: 'ANTHROPIC_API_KEY no configurada' });
      }

      const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();

      if (data.error) {
        return res.status(500).json({ success: false, error: data.error.message || 'Error de Anthropic' });
      }

      const text = data.content?.[0]?.text || '';
      return res.json({ success: true, text, mode: 'anthropic' });

    } else if (mode === 'n8n') {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (!webhookUrl) {
        return res.status(500).json({ success: false, error: 'N8N_WEBHOOK_URL no configurada' });
      }

      const headers = { 'Content-Type': 'application/json' };
      if (process.env.N8N_SECRET) {
        headers['x-webhook-secret'] = process.env.N8N_SECRET;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, prompt, source: 'skill-builder' })
      });

      const data = await response.json();
      const text = data.text || '';
      return res.json({ success: true, text, mode: 'n8n' });

    } else {
      return res.status(400).json({ success: false, error: `AI_MODE "${mode}" no soportado. Usa "anthropic" o "n8n".` });
    }

  } catch (error) {
    console.error('Error en /api/ai:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/config
app.get('/api/config', async (req, res) => {
  try {
    const mode = process.env.AI_MODE || 'anthropic';
    const anthropicReady = !!(process.env.ANTHROPIC_API_KEY);
    const n8nReady = !!(process.env.N8N_WEBHOOK_URL);

    return res.json({ mode, anthropicReady, n8nReady });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Catch-all: serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Skill Builder v2 corriendo en http://localhost:${PORT}`);
  console.log(`Modo IA: ${process.env.AI_MODE || 'anthropic'}`);
});
