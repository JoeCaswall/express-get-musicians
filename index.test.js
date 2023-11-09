// install dependencies
const { execSync } = require("child_process");
execSync("npm install");
execSync("npm run seed");
const express = require("express");
const request = require("supertest");
const app = require("./src/app");
const { beforeEach, it, expect } = require("@jest/globals");
const { seedMusician } = require("./seedData");
const { syncSeed } = require("./seed");

app.use(express.json());
app.use(express.urlencoded());

beforeEach(async () => {
  await syncSeed();
});
describe("GET/musicians", () => {
  it("reaches endpoint successfully", async () => {
    const response = await request(app).get("/musicians");
    expect(response.statusCode).toBe(200);
  });
  it("gets required information", async () => {
    const response = await request(app).get("/musicians");
    const responseData = JSON.parse(response.text);
    for (x in responseData) {
      expect([responseData[0].name, responseData[0].instrument]).toEqual([
        seedMusician[0].name,
        seedMusician[0].instrument,
      ]);
    }
  });
});

describe("GET/musicians/:id", () => {
  it("reaches endpoint successfully", async () => {
    const response = await request(app).get("/musicians/1");
    expect(response.statusCode).toBe(200);
  });
  it("gets correct data", async () => {
    const response = await request(app).get("/musicians/1");
    const responseData = JSON.parse(response.text);
    expect(responseData.name).toBe(seedMusician[0].name);
  });
});

describe("POST/musicians/", () => {
  it("reaches endpoint successfully", async () => {
    const response = await request(app).post("/musicians");
    expect(response.statusCode).toBe(200);
  });
  it("adds correct data", async () => {
    const response = await request(app).post("/musicians").send({
      name: "Slim Shady",
      instrument: "Voice",
    });
    const responseData = JSON.parse(response.text);
    const allMusicians = await request(app).get("/musicians");
    const allMusiciansData = JSON.parse(allMusicians.text);
    const latestEntry = allMusiciansData[allMusiciansData.length - 1];
    expect(responseData.name).toBe(latestEntry.name);
    expect(responseData.instrument).toBe(latestEntry.instrument);
  });
  it("returns error array if name field is empty", async () => {
    const response = await request(app)
      .post("/musicians")
      .send({ instrument: "Voice" });
    const responseData = JSON.parse(response.text);
    expect(Array.isArray(responseData.error)).toBe(true);
  });
  it("returns error array if instrument field is empty", async () => {
    const response = await request(app)
      .post("/musicians")
      .send({ name: "Slim Shady" });
    const responseData = JSON.parse(response.text);
    expect(Array.isArray(responseData.error)).toBe(true);
  });
  it("returns error array if name field is less than 2 characters in length", async () => {
    const response = await request(app)
      .put("/musicians/1")
      .send({ name: "x", instrument: "Voice" });
    const responseData = JSON.parse(response.text);
    expect(Array.isArray(responseData.error));
  });
  it("returns error array if instrument field is less than 2 characters in length", async () => {
    const response = await request(app)
      .put("/musicians/1")
      .send({ name: "Slim Shady", instrument: "V" });
    const responseData = JSON.parse(response.text);
    expect(Array.isArray(responseData.error));
  });
  it("returns error array if name field is greater than 20 characters in length", async () => {
    const response = await request(app)
      .put("/musicians/1")
      .send({ name: "xxxxxxxxxxxxxxxxxxxxx", instrument: "Voice" });
    const responseData = JSON.parse(response.text);
    expect(Array.isArray(responseData.error));
  });
  it("returns error array if instrument field is greater than 20 characters in length", async () => {
    const response = await request(app)
      .put("/musicians/1")
      .send({ name: "Slim Shady", instrument: "xxxxxxxxxxxxxxxxxxxxx" });
    const responseData = JSON.parse(response.text);
    expect(Array.isArray(responseData.error));
  });
});

describe("PUT/musicians/:id", () => {
  it("reaches endpoint successfully", async () => {
    const response = await request(app).put("/musicians/2");
    expect(response.statusCode).toBe(200);
  });
  it("replaces correct entry", async () => {
    const response = await request(app).put("/musicians/2").send({
      name: "Slim Shady",
      instrument: "Voice",
    });
    const responseData = JSON.parse(response.text);
    console.log(responseData);
    const allMusicians = await request(app).get("/musicians");
    const allMusiciansData = JSON.parse(allMusicians.text);
    expect(responseData.name).toBe(allMusiciansData[1].name);
  });
});

describe("DELETE/musicians/:id", () => {
  it("Deletes an entry", async () => {
    await request(app).delete("/musicians/1");
    const allMusicians = await request(app).get("/musicians");
    const musicianArray = JSON.parse(allMusicians.text);
    expect(musicianArray[0].name).toBe(seedMusician[1].name);
  });
});
