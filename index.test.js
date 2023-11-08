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
    // console.log(response);
    const responseData = JSON.parse(response.text);
    // console.log(responseData[0]);
    expect(responseData[0].name).toEqual(seedMusician[0].name);
    expect(responseData[0].instrument).toEqual(seedMusician[0].instrument);
    expect(responseData[1].name).toEqual(seedMusician[1].name);
    expect(responseData[1].instrument).toEqual(seedMusician[1].instrument);
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
    // console.log(responseData);
    const allMusicians = await request(app).get("/musicians");
    const allMusiciansData = JSON.parse(allMusicians.text);
    const latestEntry = allMusiciansData[allMusiciansData.length - 1];
    // console.log(allMusiciansData);
    expect(responseData.name).toBe(latestEntry.name);
    expect(responseData.instrument).toBe(latestEntry.instrument);
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
