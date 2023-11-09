const { Router } = require("express");
const express = require("express");
const { Musician } = require("../../models");

const musicianRouter = express.Router();

musicianRouter.get("/", async (req, res) => {
  const musicians = await Musician.findAll();
  res.json(musicians);
});

musicianRouter.get("/:id", async (req, res) => {
  const musician = await Musician.findByPk(req.params.id);
  res.json(musician);
});

musicianRouter.post("/", async (req, res) => {
  const newMusician = await Musician.create(req.body);
  res.json(newMusician);
});

musicianRouter.put("/:id", async (req, res) => {
  await Musician.update(req.body, {
    where: { id: req.params.id },
  });
  const newMusician = await Musician.findByPk(req.params.id);
  res.json(newMusician);
});

musicianRouter.delete("/:id", async (req, res) => {
  await Musician.destroy({
    where: { id: req.params.id },
  });
  const allMusicians = await Musician.findAll();
  res.json(allMusicians);
});

module.exports = { musicianRouter };
