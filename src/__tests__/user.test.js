const request = require("supertest");
const { app, Server } = require("../../index");
const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

afterAll(async () => {
  try {
    // drop user collection created in test
    await User.deleteMany({ isTestUser: true });
    const deletedCount = await User.countDocuments({ isTestUser: true });
    console.log(`Number of test users deleted: ${deletedCount}`);

    await mongoose.connection.close();
    Server.close();
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
});

describe("User Authentication", () => {
  it("should register a new user", async () => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const uniqueEmail = `test${today.toLocaleDateString()}@example.com`;

    // Check if user already exists with this unique email
    const existingUser = await User.findOne({ email: uniqueEmail });
    if (existingUser) {
      throw new Error("Test user with this email already exists.");
    }
    const res = await request(app).post("/api/user/signup").send({
      username: "testuser",
      email: uniqueEmail,
      password: "Password123",
      isTestUser: true,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
    const user = await User.findOne({ email: uniqueEmail });
    expect(user).not.toBeNull();
  });

  it("should not register a user with the same email", async () => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const uniqueEmail = `test${today.toLocaleDateString()}@example.com`;

    // create new user
    await request(app).post("/api/user/signup").send({
      username: "testuser",
      email: uniqueEmail,
      password: "Password123",
      isTestUser: true,
    });

    // create another with same credentials
    const res = await request(app).post("/api/user/signup").send({
      username: "anotheruser",
      email: uniqueEmail,
      password: "AnotherPassword123",
      isTestUser: true,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should login the user", async () => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const uniqueEmail = `test${today.toLocaleDateString()}@example.com`;

    const res = await request(app).post("/api/user/login").send({
      email: uniqueEmail,
      password: "Password123",
      // isTestUser: true,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
