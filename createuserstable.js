const { Client } = require('pg');

const client = new Client({
  user: 'snalanagula',
  host: 'localhost',
  database: 'my_crud_app',
  password: 'Zeta!@#456',
  port: 5432,
});

const createUsersTable = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(query);
    console.log('Users table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    await client.end();
    console.log('Disconnected from PostgreSQL');
  }
};

createUsersTable();
