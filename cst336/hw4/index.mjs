import express from "express";
import fetch from "node-fetch";
import dogFacts from "dog-facts";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("index");
});


app.get("/fact", (req, res) => {
  const fact = dogFacts.random();
  res.render("fact", { fact });
});

app.get("/photo", async (req, res) => {
  const url = "https://dog.ceo/api/breeds/image/random";

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.render("photo", { imgUrl: data.message });
  } catch (err) {
    res.status(500).send("Could not load dog picture.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dog app running on port ${PORT}`);
});