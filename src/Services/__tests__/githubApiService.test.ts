import { GithubApiService, normalizeTokens } from "../GithubApiService.ts";
import { assertEquals, returnsNext, soxa, stub } from "../../../deps.ts";
import { GitHubUserRepository } from "../../user_info.ts";

const rateLimitMock = await import("../__mocks__/rateLimitMock.json", {
  with: { type: "json" },
});

const successGithubResponseMock = await import(
  "../__mocks__/successGithubResponse.json",
  { with: { type: "json" } }
);

const notFoundGithubResponseMock = await import(
  "../__mocks__/notFoundUserMock.json",
  { with: { type: "json" } }
);

import { ServiceError } from "../../Types/index.ts";

// We map exactly 1 promise per test since the environment 
// uses a single token and does not trigger secondary retries.
stub(
  soxa,
  "post",
  returnsNext([
    // Should get data in first try (Test 1)
    Promise.resolve(successGithubResponseMock.default),
    
    // Should throw NOT FOUND (Test 2)
    Promise.resolve(notFoundGithubResponseMock.default),
    
    // Should throw NOT FOUND even if request the user only (Test 3)
    Promise.resolve(notFoundGithubResponseMock.default),
    
    // Should throw RATE LIMIT (Test 4)
    Promise.resolve(rateLimitMock.default.rate_limit),
    
    // Should throw RATE LIMIT Exceed (Test 5)
    Promise.resolve(rateLimitMock.default.exceeded),
  ]),
);

Deno.test("Should get data in first try", async () => {
  const provider = new GithubApiService();

  const data = await provider.requestUserRepository(
    "test",
  ) as GitHubUserRepository;

  assertEquals(data.repositories.totalCount, 128);
});

Deno.test("Should throw NOT FOUND", async () => {
  const provider = new GithubApiService();
  const result = await provider.requestUserInfo("test");
  const error = result instanceof ServiceError ? result : null;

  assertEquals(error instanceof ServiceError, true);
  if (!(error instanceof ServiceError)) return;
  assertEquals(error.code, 404);
});

Deno.test("Should throw NOT FOUND even if request the user only", async () => {
  const provider = new GithubApiService();
  const result = await provider.requestUserRepository("test");
  const error = result instanceof ServiceError ? result : null;

  assertEquals(error instanceof ServiceError, true);
  if (!(error instanceof ServiceError)) return;
  assertEquals(error.code, 404);
});

// The assertRejects() assertion is a little more complicated
// mainly because it deals with Promises.
// https://docs.deno.com/runtime/manual/basics/testing/assertions#throws
Deno.test("Should throw RATE LIMIT", async () => {
  const provider = new GithubApiService();
  const result = await provider.requestUserRepository("test");
  const error = result instanceof ServiceError ? result : null;

  assertEquals(error instanceof ServiceError, true);
  if (!(error instanceof ServiceError)) return;
  assertEquals(error.code, 419);
});

Deno.test("Should throw RATE LIMIT Exceed", async () => {
  const provider = new GithubApiService();
  const result = await provider.requestUserRepository("test");
  const error = result instanceof ServiceError ? result : null;

  assertEquals(error instanceof ServiceError, true);
  if (!(error instanceof ServiceError)) return;
  assertEquals(error.code, 419);
});

Deno.test("normalizeTokens should trim and keep configured tokens", () => {
  const normalized = normalizeTokens([" token-1 ", undefined, ""]);
  assertEquals(normalized, ["token-1"]);
});

Deno.test("normalizeTokens should fallback when no valid tokens", () => {
  const normalized = normalizeTokens([undefined, "   "]);
  assertEquals(normalized, [""]);
});