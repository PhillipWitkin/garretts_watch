import dotenv from "dotenv";
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, ".env") });


async function runMigration(){
    let pool =  new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }

    });
        // Connect to the PostgreSQL database
    try {
        await  pool.query(`CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            todo_body TEXT)`)
    } catch (error) {
        console.error('Error occurred during migration:', error);
    } finally {
        // Close the database connection
        await pool.end();
        console.log('Migration complete, Database connection closed.');
    }
}

async function seedData(){
    let pool =  new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    });

    try {
      // Check if the "users" table is empty
        const checkEmptyTableQuery = 'SELECT COUNT(*) FROM todos;';
        const result = await pool.query(checkEmptyTableQuery);
        const count = parseInt(result.rows[0].count, 10);

        if (count > 0) {
            console.log('Todos table is not empty. Skipping seeding.');
            return;
        }
      // Prepare sample todo data
      const todos = [
        {
          todo_body: 'Eat spicy food',
        },
        {
          todo_body: 'Drink',
        },
        {
          todo_body: 'Eat',
        },
        {
          todo_body: 'Eat',
        }
      ];
  
      // Insert into the todos table
      for (const todo of todos) {
        const insertQuery = `INSERT INTO todos (todo_body) VALUES ($1);`;
        await pool.query(insertQuery, [todo.todo_body]);
        console.log(`Todo ${todo.todo_body} inserted.`);
      }
      console.log('All todos seeded.');
    } catch (error) {
      console.error('Error occurred during seeding:', error);
    } finally {
      // Close the database connection
      await pool.end();
      console.log('Database connection closed.');
    }
}

async function migrateAndSeed(){
  await runMigration();
  await seedData();
}

migrateAndSeed();



      