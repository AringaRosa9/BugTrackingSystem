import express from 'express';

import { bugStore } from './services/bugStore';

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3001);
  const host = process.env.HOST || '127.0.0.1';

  app.use(express.json());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/bugs', (_req, res) => {
    res.json({ data: bugStore.listBugs() });
  });

  app.post('/api/bugs/ingest', (req, res) => {
    try {
      const apiKey = req.headers.authorization?.split('Bearer ')[1];
      if (!apiKey || !apiKey.startsWith('hro_')) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
      }

      const { platformId, title } = req.body ?? {};
      if (!platformId || !title) {
        return res.status(400).json({ error: 'Bad Request: platformId and title are required' });
      }

      const createdBug = bugStore.ingestBug(req.body);
      res.status(201).json({
        message: 'Bug successfully ingested',
        bugId: createdBug.bugId,
        data: createdBug,
      });
    } catch (error) {
      console.error('Ingestion error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.patch('/api/bugs/:bugId', (req, res) => {
    const updatedBug = bugStore.updateBug(req.params.bugId, req.body ?? {});
    if (!updatedBug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    res.json({ data: updatedBug });
  });

  app.listen(port, host, () => {
    console.log(`Backend running on http://${host}:${port}`);
  });
}

startServer();
