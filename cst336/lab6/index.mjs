import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "pwcspfbyl73eccbn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "j8alii8je0itbz3s",
    password: "mx2j1ow1hjs868nz",
    database: "gvw1vu2tssczfoyu",
    connectionLimit: 10,
    waitForConnections: true
});




//routes
app.get('/', (req, res) => {
   res.render('index')
});


app.get("/author/new", (req,res) =>{
    res.render("newAuthor");
});

app.post("/author/new", async function(req, res){
  let fName = req.body.fName;
  let lName = req.body.lName;
  let birthDate = req.body.birthDate;
  let sql = `INSERT INTO q_authors
             (firstName, lastName, dob)
              VALUES (?, ?, ?)`;
  let params = [fName, lName, birthDate];
  const [rows] = await pool.query(sql, params);
  res.render("newAuthor", 
             {"message": "Author added!"});
});

app.get("/authors", async function(req, res){
 let sql = `SELECT *
            FROM q_authors
            ORDER BY lastName`;
 const [rows] = await pool.query(sql);
 res.render("authorList", {"authors":rows});
});

app.get("/author/edit", async function(req, res){


 let authorId = req.query.authorId;


 let sql = `SELECT *, 
        DATE_FORMAT(dob, '%Y-%m-%d') dobISO
        FROM q_authors
        WHERE authorId =  ${authorId}`;
 const [rows] = await pool.query(sql);
 res.render("editAuthor", {"authorInfo":rows});
});

app.post("/author/edit", async function(req, res){
  let sql = `UPDATE q_authors
            SET firstName = ?,
                lastName = ?,
                dob = ?,
                sex = ?
            WHERE authorId =  ?`;


  let params = [req.body.fName,  
              req.body.lName, req.body.dob, 
              req.body.sex,req.body.authorId];         
  const [rows] = await pool.query(sql,params);
  res.redirect("/authors");
});

app.get("/author/delete", async function(req, res){

    let authorId = req.query.authorId;

    let sql = `DELETE
               FROM q_authors
               WHERE authorId = ?`;

    const [rows] = await pool.query(sql, [authorId]);

    res.redirect("/authors");
});


app.get("/quotes", async function(req, res) {

    let sql = `
        SELECT quoteId, quote, firstName, lastName
        FROM q_quotes
        NATURAL JOIN q_authors
        ORDER BY lastName
    `;

    const [rows] = await pool.query(sql);

    res.render("quoteList", { "quotes": rows });
});

app.get("/quote/delete", async function(req, res) {

    let quoteId = req.query.quoteId;

    let sql = `
        DELETE
        FROM q_quotes
        WHERE quoteId = ?
    `;

    await pool.query(sql, [quoteId]);

    res.redirect("/quotes");
});

app.get("/quote/edit", async function(req, res) {
    let quoteId = req.query.quoteId;

    let sql = `
        SELECT *
        FROM q_quotes
        WHERE quoteId = ?
    `;

    const [rows] = await pool.query(sql, [quoteId]);

    res.render("editQuote", { "quote": rows[0] });
});

app.post("/quote/update", async function(req, res) {

    let quoteId = req.body.quoteId;
    let quote   = req.body.quote;

    let sql = `
        UPDATE q_quotes
        SET quote = ?
        WHERE quoteId = ?
    `;

    await pool.query(sql, [quote, quoteId]);

    res.redirect("/quotes");
});

app.get("/quote/new", async function(req, res) {


    let sqlCategories = `
        SELECT DISTINCT category
        FROM q_quotes
        ORDER BY category;
    `;

    let sqlAuthors = `
        SELECT authorId, firstName, lastName
        FROM q_authors
        ORDER BY lastName;
    `;

    const [categories] = await pool.query(sqlCategories);
    const [authors]    = await pool.query(sqlAuthors);

    res.render("newQuote", {
        "authors": authors,
        "categories": categories
    });
});

app.post("/quote/new", async function(req, res){

    let quote     = req.body.quote;
    let authorId  = req.body.authorId;
    let category  = req.body.category;
    let likes     = req.body.likes;

    let sql = `
        INSERT INTO q_quotes
        (quote, authorId, category, likes)
        VALUES (?, ?, ?, ?)
    `;

    let params = [quote, authorId, category, likes];

    await pool.query(sql, params);

        let sqlCategories = `
        SELECT DISTINCT category
        FROM q_quotes
        ORDER BY category;
    `;
    let sqlAuthors = `
        SELECT authorId, firstName, lastName
        FROM q_authors
        ORDER BY lastName;
    `;

    const [categories] = await pool.query(sqlCategories);
    const [authors]    = await pool.query(sqlAuthors);

    res.render("newQuote", { 
        message: "Quote added!",
        authors: authors,
        categories: categories
    });
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})

 