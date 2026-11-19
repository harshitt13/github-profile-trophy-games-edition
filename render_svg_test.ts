import { assertEquals, assertRejects, stub } from "./deps.ts";
import { generateTrophy } from "./render_svg.ts";

Deno.test("generator preserves an existing image when the API returns HTML", async () => {
  const fetchMock = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(
        new Response("<html>Error</html>", {
          headers: { "content-type": "text/html" },
        }),
      ),
  );
  const writeMock = stub(Deno, "writeTextFile", () => Promise.resolve());
  try {
    await assertRejects(
      () =>
        generateTrophy(
          "harshitt13",
          "trophy.svg",
          "lol",
          "https://example.com",
        ),
      Error,
      "Expected an SVG",
    );
    assertEquals(writeMock.calls.length, 0);
  } finally {
    fetchMock.restore();
    writeMock.restore();
  }
});
Deno.test("generator keeps API options and writes a validated SVG", async () => {
  let requested = "";
  const fetchMock = stub(globalThis, "fetch", (input) => {
    requested = String(input);
    return Promise.resolve(
      new Response('<svg xmlns="http://www.w3.org/2000/svg"></svg>', {
        headers: { "content-type": "image/svg+xml" },
      }),
    );
  });
  const writeMock = stub(Deno, "writeTextFile", () => Promise.resolve());
  try {
    await generateTrophy(
      "harshitt13",
      "trophy.svg",
      "lol",
      "https://example.com/?column=4",
    );
    assertEquals(new URL(requested).searchParams.get("column"), "4");
    assertEquals(writeMock.calls[0].args[0], "trophy.svg");
  } finally {
    fetchMock.restore();
    writeMock.restore();
  }
});
