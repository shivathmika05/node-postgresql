const express = require('express');
const { Client } = require('pg');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL client setup
const client = new Client({
  user: 'snalanagula',
  host: 'localhost',
  database: 'my_crud_app',
  password: 'Zeta!@#456',
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Routes

//  GET all users
app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  GET user by ID
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by name
app.get('/users/name/:name', async (req, res) => {
  const userName = req.params.name;
  try {
    const result = await client.query('SELECT * FROM users WHERE name = $1', [userName]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]); // return full user info
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET users whose names start with a specific letter(s)
app.get('/users/starts-with/:prefix', async (req, res) => {
  const prefix = req.params.prefix;
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE name ILIKE $1',
      [`${prefix}%`] // ILIKE is case-insensitive
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET users whose names contain specific letters (like regex)
app.get('/users/match/:pattern', async (req, res) => {
  const pattern = req.params.pattern;
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE name ILIKE $1',
      [`%${pattern}%`] // % acts like ".*" in regex
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update only password by user ID
app.patch('/users/:id/password', async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const result = await client.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING *',
      [password, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Password updated successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update password by email
app.patch('/users/password/email/:email', async (req, res) => {
  const email = req.params.email;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const result = await client.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
      [password, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    res.json({ message: 'Password updated successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update password by name
app.patch('/users/password/name/:name', async (req, res) => {
  const name = req.params.name;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const result = await client.query(
      'UPDATE users SET password = $1 WHERE name = $2 RETURNING *',
      [password, name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found with this name' });
    }

    res.json({ message: 'Password updated successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//  POST create new user
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  PUT update user
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;
  try {
    const result = await client.query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [name, email, password, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  DELETE user
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
