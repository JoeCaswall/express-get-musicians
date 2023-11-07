const express = require("express");
const app = express();
const { Musician } = require("../models/index");
const { db } = require("../db/connection");

const port = 3000;

//TODO: Create a GET /musicians route to return all musicians

app.use(express.json());
app.use(express.urlencoded());

app.get("/musicians", async (req, res) => {
  const allMusicians = await Musician.findAll();
  res.json(allMusicians);
});

app.get("/musicians/:id", async (req, res) => {
  const musicianId = req.params.id;
  const particularMusician = await Musician.findByPk(musicianId);
  res.json(particularMusician);
});

app.post("/musicians", async (req, res) => {
  const newMusician = await Musician.create(req.body);
  res.json(newMusician);
});

app.put("/musicians/:id", async (req, res) => {
  await Musician.update(req.body, {
    where: { id: req.params.id },
  });
  const allMusicians = await Musician.findAll();
  res.json(allMusicians);
});

app.delete("/musicians/:id", async (req, res) => {
  await Musician.destroy({ where: { id: req.params.id } });
  const allMusicians = await Musician.findAll();
  res.json(allMusicians);
});

module.exports = app;
