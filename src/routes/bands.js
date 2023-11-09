const { Router } = require("express");
const express = require("express");
const { Band, Musician } = require("../../models");

const bandRouter = express.Router();

bandRouter.get("/", async (req, res) => {
  const allBands = await Band.findAll();
  //   const allMusicians = await Musician.findAll({where: })
  res.json(allBands);
});

module.exports = { bandRouter };
