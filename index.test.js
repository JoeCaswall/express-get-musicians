// install dependencies
const { execSync } = require("child_process");
execSync("npm install");
execSync("npm run seed");

const request = require("supertest");
const { db } = require("./db/connection");
const { Musician } = require("./models/index");
const app = require("./src/app");
const { it, toBe, toEqual, expect } = require("@jest/globals");
const seedData = require("./seedData");

describe("./musicians endpoint", () => {
  it("reaches endpoint successfully", async () => {
    const response = await request(app).get("/musicians");
    expect(response.statusCode).toBe(200);
  });
  it("gets required information", async () => {
    const response = await request(app).get("/musicians");
    // console.log(response);
    const responseData = JSON.parse(response.text);
    console.log(responseData[0]);
    expect(responseData[0].name).toEqual(seedData.seedMusician[0].name);
    expect(responseData[0].instrument).toEqual(
      seedData.seedMusician[0].instrument
    );
    expect(responseData[1].name).toEqual(seedData.seedMusician[1].name);
    expect(responseData[1].instrument).toEqual(
      seedData.seedMusician[1].instrument
    );
  });
});

describe("./musicians/:id endpoint", () => {
  it("reaches endpoint successfully", async () => {
    const response = await request(app).get("/musicians/1");
    expect(response.statusCode).toBe(200);
  });
  it("gets correct data", async () => {
    const response = await request(app).get("/musicians/1");
    const responseData = JSON.parse(response.text);
    expect(responseData.name).toBe(seedData.seedMusician[0].name);
  });
});
