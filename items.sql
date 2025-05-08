const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'my_crud_app',
  password: 'yourpassword',
  port: 5432,
});

client.connect();

const query = `
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

client.query(query)
  .then(() => console.log("Table created"))
  .catch(err => console.error(err))
  .finally(() => client.end());
