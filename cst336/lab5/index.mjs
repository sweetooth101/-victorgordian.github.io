import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

let conn;

if (process.env.JAWSDB_URL) {
  console.log("🔌 Using Heroku JAWSDB connection");
  conn = mysql.createPool(process.env.JAWSDB_URL);
} else {
  console.log("💻 Using local DB connection");
  conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306
  });
}

//routes
app.get('/', async (req, res) => {

  let sqlAuthors = `SELECT authorId, firstName, lastName
                    FROM q_authors
                    ORDER BY lastName`;

  let sqlCategories = `SELECT DISTINCT category
                       FROM q_quotes
                       ORDER BY category`;

  const [authorRows]    = await conn.query(sqlAuthors);
  const [categoryRows]  = await conn.query(sqlCategories);

  res.render("index", { 
    "authors": authorRows,
    "categories": categoryRows
  });
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await conn.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.get('/searchByKeyword', async (req, res) =>{
    let keyword = req.query.keyword;
    let sql =`SELECT authorId, firstName, lastName, quote
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results", {"quotes":rows}); 
});

app.get('/searchByAuthor', async (req, res) => {
  let userAuthorId = req.query.authorId;

  let sql = `SELECT authorId, firstName, lastName, quote
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE authorId = ?`;

  let sqlParams = [userAuthorId];

  const [rows] = await conn.query(sql, sqlParams);

  res.render("results", { "quotes": rows });
});

app.get('/api/author/:id', async (req, res) => {
let authorId = req.params.id;
let sql = `SELECT *
FROM q_authors
WHERE authorId = ?`;
let [rows] = await conn.query(sql, [authorId]);
res.send(rows)
});

app.get('/searchByCategory', async (req, res) => {
  let category = req.query.category;

  let sql = `SELECT authorId, firstName, lastName, quote
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE category = ?`;

  let sqlParams = [category];

  const [rows] = await conn.query(sql, sqlParams);

  res.render("results", { "quotes": rows });
});

app.get('/searchByLikes', async (req, res) => {
  let minLikes = req.query.minLikes;
  let maxLikes = req.query.maxLikes;

  let sql = `SELECT authorId, firstName, lastName, quote
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE likes BETWEEN ? AND ?`;

  let sqlParams = [minLikes, maxLikes];

  const [rows] = await conn.query(sql, sqlParams);

  res.render("results", { "quotes": rows });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});