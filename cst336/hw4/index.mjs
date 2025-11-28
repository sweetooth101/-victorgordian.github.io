import express from "express";
import fetch from "node-fetch";
import dogFacts from "dog-facts";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", async (req, res) => {
  const unsplashKey = "YOUR_UNSPLASH_KEY";
  const url = `https://api.unsplash.com/photos/random/?client_id=${unsplashKey}&query=dog`;

  const response = await fetch(url);
  const data = await response.json();

  res.render("index", { image: data.urls.full });
});


app.get("/fact", (req, res) => {
  const fact = dogFacts.random();
  res.render("fact", { fact });
});


app.get("/photo", async (req, res) => {
  const url = "https://dog.ceo/api/breeds/image/random";
  const response = await fetch(url);
  const data = await response.json();

  res.render("photo", { dogImage: data.message });
});


app.get("/breed", async (req, res) => {
  const url = "https://dog.ceo/api/breeds/list/all";
  const response = await fetch(url);
  const data = await response.json();

  const breeds = Object.keys(data.message);
  const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];

  res.render("breed", { randomBreed });
});

app.get("/fun", (req, res) => {
  const facts = [
    dogFacts.random(),
    dogFacts.random(),
    dogFacts.random()
  ];
  res.render("fun", { facts });
});