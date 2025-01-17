const express = require("express");
const app = express();
const { musicianRouter } = require("./routes/musicians");
const { bandRouter } = require("./routes/bands");

app.use(express.json());
app.use(express.urlencoded());

app.use("/musicians", musicianRouter);
app.use("/bands", bandRouter);

//PREVIOUS CODE FROM BEFORE USING ROUTER (for posterity):

// app.get("/musicians", async (req, res) => {
//   const allMusicians = await Musician.findAll();
//   res.json(allMusicians);
// });

// app.get("/musicians/:id", async (req, res) => {
//   const musicianId = req.params.id;
//   const particularMusician = await Musician.findByPk(musicianId);
//   res.json(particularMusician);
// });

// app.post("/musicians", async (req, res) => {
//   const newMusician = await Musician.create(req.body);
//   res.json(newMusician);
// });

// app.put("/musicians/:id", async (req, res) => {
//   await Musician.update(req.body, {
//     where: { id: req.params.id },
//   });
//   const allMusicians = await Musician.findAll();
//   res.json(allMusicians);
// });

// app.delete("/musicians/:id", async (req, res) => {
//   await Musician.destroy({ where: { id: req.params.id } });
//   const allMusicians = await Musician.findAll();
//   res.json(allMusicians);
// });

module.exports = app;
