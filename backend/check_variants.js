import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
  connectionString: "postgresql://zimcart_user:zain1234@localhost:5432/zimcart_db"
});

async function run() {
  try {
    const products = await pool.query('SELECT name, variants FROM "Product" WHERE variants IS NOT NULL');
    console.log(JSON.stringify(products.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
