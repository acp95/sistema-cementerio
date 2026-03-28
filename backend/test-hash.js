const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'admin',
  database: 'cementerio_db'
});

async function test() {
  await client.connect();
  const res = await client.query("SELECT * FROM usuarios WHERE username = 'admin'");
  console.log("Hash in DB:", res.rows[0].password_hash);
  const isMatch = await bcrypt.compare("admin123", res.rows[0].password_hash);
  console.log("Bcrypt compare result:", isMatch);
  await client.end();
}

test().catch(console.error);
