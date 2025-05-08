const { Client } = require('pg');

const client = new Client({
  user: 'snalanagula',
  host: 'localhost',
  database: 'my_crud_app',
  password: 'Zeta!@#456',
  port: 5432,
});

const insertUsers = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const query = `
      INSERT INTO users (id, name, email, password)
      VALUES 
        ('1', 'Alice Johnson', 'alice@example.com', 'password123'),
        ('2', 'Bob Smith', 'bob@example.com', 'secure456'),
        ('3' 'Charlie Brown', 'charlie@example.com', 'hunter2')
      RETURNING *;
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

insertUsers();

