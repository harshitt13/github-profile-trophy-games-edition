/** Generate directly in Actions, or fetch from an optional deployed API. */
export async function generateTrophy(
  username: string,
  outputPath = "trophy.svg",
  theme = "lol",
  apiUrl?: string,
): Promise<void> {
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) {
    throw new Error("A valid GitHub username is required");
  }
  const url = new URL(apiUrl || "http://localhost/");
  url.searchParams.set("username", username);
  url.searchParams.set("theme", theme);
  let response: Response;
  if (apiUrl) {
    response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  } else {
    Deno.env.set("PROFILE_USERNAME", username);
    const { default: handler } = await import("./api/index.ts");
    response = await handler(new Request(url));
  }
  if (!response.ok) {
    throw new Error(`Trophy generation failed (HTTP ${response.status})`);
  }
  const svg = await response.text();
  if (
    !response.headers.get("content-type")?.includes("image/svg+xml") ||
    !/^\s*<svg\b/.test(svg) || !svg.trimEnd().endsWith("</svg>")
  ) {
    throw new Error(
      "Expected an SVG image; keeping the existing trophy unchanged",
    );
  }
  const parent = outputPath.replace(/\\/g, "/").lastIndexOf("/");
  if (parent > 0) {
    await Deno.mkdir(outputPath.slice(0, parent), { recursive: true });
  }
  await Deno.writeTextFile(outputPath, svg);
  console.log(`Updated ${outputPath}`);
}

if (import.meta.main) {
  const [username, outputPath, theme, apiUrl] = Deno.args;
  if (!username) {
    throw new Error(
      "Usage: render_svg.ts USERNAME [OUTPUT_PATH] [THEME] [API_URL]",
    );
  }
  await generateTrophy(username, outputPath, theme, apiUrl);
}
