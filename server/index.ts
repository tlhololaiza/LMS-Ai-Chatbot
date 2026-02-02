import express from 'express';
import cors from 'cors';
import { logQuery } from './logger';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/api/log-query', (req: express.Request, res: express.Response) => {
  const { query, category } = req.body;
  if (typeof query !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  logQuery(query, category);
  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Logger server running on port ${PORT}`);
});
