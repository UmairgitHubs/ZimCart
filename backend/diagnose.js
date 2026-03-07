import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
  connectionString: "postgresql://zimcart_user:zain1234@localhost:5432/zimcart_db"
});

async function run() {
  try {
    const stores = await pool.query('SELECT id, name, "isActive" FROM "Store"');
    console.log('--- STORES ---');
    console.table(stores.rows);

    const products = await pool.query('SELECT id, name, status, "storeId", "categoryId" FROM "Product"');
    console.log('\n--- PRODUCTS ---');
    console.table(products.rows);

    const categories = await pool.query('SELECT id, name, status, "storeId" FROM "Category"');
    console.log('\n--- CATEGORIES ---');
    console.table(categories.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
