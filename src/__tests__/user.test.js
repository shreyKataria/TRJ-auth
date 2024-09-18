const request = require("supertest");
const { app, Server } = require("../../index");
const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

afterAll(async () => {
  try {
    // drop user collection created in test
    await User.deleteMany({ isTestUser: true });
    await mongoose.connection.close();
    Server.close();
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
});

describe("User Authentication", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/user/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "Password123",
      isTestUser: true,
    });
    console.log("Response Body:", res.body);
    console.log("Response Status Code:", res.statusCode);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
    const user = await User.findOne({ email: "test@example.com" });
    expect(user).not.toBeNull();
  });

  it("should not register a user with the same email", async () => {
    // create new user
    await request(app).post("/api/user/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "Password123",
      isTestUser: true,
    });

    // create another with same credentials
    const res = await request(app).post("/api/user/signup").send({
      username: "anotheruser",
      email: "test@example.com",
      password: "AnotherPassword123",
      isTestUser: true,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should login the user", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "test@example.com",
      password: "Password123",
      isTestUser: true,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
