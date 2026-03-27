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

// Unfortunatelly, The spy is a global instance
// We can't reset mock as Jest does.
stub(
  soxa,
  "post",
  returnsNext([
    // Should get data in first try
    Promise.resolve(successGithubResponseMock.default),
    // Should throw NOT FOUND (requestUserInfo makes 1 combined API call)
    // Each call makes 2 attempts (one per token), so 2 promises total
    Promise.resolve(notFoundGithubResponseMock.default),
    Promise.resolve(notFoundGithubResponseMock.default),
    // Should throw NOT FOUND even if request the user only
    Promise.resolve(notFoundGithubResponseMock.default),
    Promise.resolve(notFoundGithubResponseMock.default),
    // Should throw RATE LIMIT
    Promise.resolve(rateLimitMock.default.rate_limit),
    Promise.resolve(rateLimitMock.default.rate_limit),
    // Should throw RATE LIMIT Exceed
    Promise.resolve(rateLimitMock.default.rate_limit),
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
