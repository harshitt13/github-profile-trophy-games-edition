import "https://deno.land/x/dotenv@v0.5.0/load.ts";

const username = Deno.args[0];
const outputPath = Deno.args[1] ?? "./assets/trophy.svg";
const gameTheme = Deno.args[2] ?? "lol";
const apiUrl = Deno.args[3]; // Catching the new Vercel URL argument!

if (!username || !apiUrl) {
  console.error(
    "Usage: deno run --allow-net --allow-env --allow-read --allow-write ./render_svg.ts USERNAME OUTPUT_PATH GAME_THEME API_URL",
  );
  Deno.exit(1);
}

async function main() {
  console.log("Starting trophy fetch...");
  console.log("Username:", username);
  console.log("Output path:", outputPath);
  console.log("Game theme:", gameTheme);
  console.log("Vercel API URL:", apiUrl);

  // Clean the URL in case the user accidentally added a trailing slash
  const cleanApiUrl = apiUrl.replace(/\/$/, "");
  
  // Construct the exact URL to fetch from your Vercel deployment
  const fetchUrl = `${cleanApiUrl}/?username=${username}&theme=${gameTheme}`;

  console.log(`Fetching generated SVG from: ${fetchUrl}`);

  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      console.error(`Failed to fetch SVG. Status: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      Deno.exit(2);
    }

    // Grab the raw SVG text from your Vercel app
    const svgData = await response.text();

    // Create the directory if it doesn't exist
    const dirMatch = outputPath.match(/(.*)\/[^/]+$/);
    if (dirMatch) {
      const dir = dirMatch[1];
      try {
        await Deno.mkdir(dir, { recursive: true });
      } catch {
        console.error("Failed to create directory. No permission?");
        Deno.exit(3);
      }
    }

    // Save the SVG to the repository
    await Deno.writeTextFile(outputPath, svgData);
    console.log(`Successfully wrote SVG to ${outputPath}`);
    
  } catch (error) {
    console.error("Network or execution error while fetching:", error);
    Deno.exit(4);
  }
}

await main();