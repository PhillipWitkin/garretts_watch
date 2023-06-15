const { Pool } = require('pg');

let db =  new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false
          }
    });


async function runMigration(){
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
    try {
        // Check if the "users" table is empty
         const checkEmptyTableQuery = 'SELECT COUNT(*) FROM todos;';
         const result = await pool.query(checkEmptyTableQuery);
         const count = parseInt(result.rows[0].count, 10);
 
         if (count > 0) {
             console.log('Todos table is not empty. Skipping seeding.');
             return;
         }
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
                 todo_body: 'Eat spciy food',
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
             const insertQuery = `INSERT INTO todos (name, completed) VALUES ($1, $2);`;
             await pool.query(insertQuery, [todo.name, todo.completed]);
             console.log(`Todo ${todo.name} inserted.`);
           }
       
           console.log('All todos seeded.');
         } catch (error) {
           console.error('Error occurred during seeding:', error);
         } finally {
           // Close the database connection
           await pool.end();
           console.log('Database connection closed.');
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
}



      