const { Client } = require('pg');

const client = new Client({
  user: 'snalanagula',
  host: 'localhost',
  database: 'my_crud_app',
  password: 'Zeta!@#456',
  port: 5432,
});

const showUsers = async () => {
console.log('test')
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const query = `
      SELECT * FROM users;
    `;

    const res = await client.query(query);
    console.log('Inserted users:', res.rows);
  } catch (err) {
    console.error('Error inserting users:', err);
  } finally {
    await client.end();
    console.log('Disconnected from PostgreSQL');
  }
};

showUsers();
