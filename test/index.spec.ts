import request from "supertest";
import server from "../src/index";

describe("GET /", () => {
  it("should return 'Hello world'", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello world");
  });
});
