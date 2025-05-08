const { Client } = require('pg');  // Import the PostgreSQL client

// Set up the PostgreSQL connection details
const client = new Client({
    host: 'localhost',  // Your PostgreSQL host (e.g., localhost)
    port: 5432,         // Default PostgreSQL port
    user: 'postgres',  // Your PostgreSQL username
    password: 'Zeta!@#456', // Your PostgreSQL password
    database: 'my_crud_app' // The name of your PostgreSQL database
  });

// Connect to the PostgreSQL server
client.connect()
  .then(() => {
    console.log("Connected to the database!");

    // Query to list all tables in the 'public' schema
    client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'', (err, res) => {
      if (err) {
        console.error('Error executing query', err.stack);  // Handle any errors that occur
      } else {
        // Log the list of tables to the console
        console.log('Tables in your database:');
        res.rows.forEach(row => {
          console.log(row.table_name);  // Print each table name
        });
      }
      
      // Close the connection after querying
      client.end();
    });
  })
  .catch(err => {
    console.error('Connection error', err.stack);  // Handle connection errors
    client.end();  // Ensure the connection is closed
  });
