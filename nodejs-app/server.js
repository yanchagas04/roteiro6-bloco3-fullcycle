const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tasks_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDatabase();

app.get('/', (req, res) => {
  res.json({
    message: 'Node.js + PostgreSQL Backend (CentOS 7)',
    status: 'running',
    endpoints: ['/health', '/tasks', '/stats']
  });
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json({ tasks: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description || '']
    );
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM tasks');
    const completedResult = await pool.query('SELECT COUNT(*) FROM tasks WHERE completed = TRUE');
    
    res.json({
      total_tasks: parseInt(totalResult.rows[0].count),
      completed_tasks: parseInt(completedResult.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node.js backend running on port ${PORT}`);
});