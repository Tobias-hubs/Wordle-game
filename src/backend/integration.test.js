
import { jest } from "@jest/globals";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Importera den faktiska modulen först
const actualGameLogic = await import("./game/gameLogic.js");

// Mixa in den faktiska modulen och skriv över chooseWord
await jest.unstable_mockModule("./game/gameLogic.js", () => ({
  ...actualGameLogic,
  chooseWord: () => "APPLE",
}));

// Importera efter att mockningen är på plats
const { default: app } = await import("./server.js");

// Nu kan du skriva dina tester
let mongoServer;

beforeAll(async () => {
  // Starta in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Integrationstest - Gameflow", () => {
  test("Test gameflow from start to end", async () => {
    // 1. Start game
    const startResponse = await request(app)
      .post("/startGame")
      .send({ wordLength: 5, allowRepeats: false });
    expect(startResponse.status).toBe(200);
    expect(startResponse.body.message).toBe("Game started");

    // 2. Send wrong guess
    const guessResponse1 = await request(app)
      .post("/api/check-guess")
      .send({ guess: "BERRY" });
    expect(guessResponse1.status).toBe(200);
    expect(guessResponse1.body.isGameOver).toBeFalsy();
    // Förväntar oss att feedback finns eftersom controllGuess här exekveras från den faktiska modulen
    expect(guessResponse1.body.feedback).toBeDefined();

    // 3. Send correct guess
    const guessResponse2 = await request(app)
      .post("/api/check-guess")
      .send({ guess: "APPLE" });
    expect(guessResponse2.status).toBe(200);
    expect(guessResponse2.body.isGameOver).toBeTruthy();
    expect(guessResponse2.body.correctWord).toBe("APPLE");

    // 4. End game
    const endResponse = await request(app)
      .post("/endGame")
      .send({});
    expect(endResponse.status).toBe(200);
    expect(typeof endResponse.body.timeTaken).toBe("number");
  });
});
