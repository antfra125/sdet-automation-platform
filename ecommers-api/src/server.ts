
import express from 'express';
import { pool } from './db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  return res.status(200).json({ status: 'ok' });
});

// GET all products
app.get('/api/products', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, price, stock FROM products ORDER BY id'
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('GET products failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET product by ID
app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, price, stock FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('GET product failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create product
app.post('/api/products', async (req, res) => {
  const { name, price, stock } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    name.trim() === '' ||
    name.length > 255 ||
    typeof price !== 'number' ||
    !Number.isSafeInteger(price) ||
    price < 0 ||
    price > 2147483647 ||
    typeof stock !== 'number' ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    stock > 2147483647
  ) {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, price, stock)
       VALUES ($1, $2, $3)
       RETURNING id, name, price, stock`,
      [name, price, stock]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST product failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE product by ID
app.delete('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('DELETE product failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
