import "https://deno.land/x/dotenv@v0.5.0/load.ts";

const username = Deno.args[0];
const outputPath = Deno.args[1] ?? "./assets/trophy.svg";
const gameTheme = Deno.args[2] ?? "lol";

if (!username) {
  console.error(
    "Usage: deno run --allow-net --allow-env --allow-read --allow-write ./render_svg.ts USERNAME [OUTPUT_PATH] [GAME_THEME]",
  );
  Deno.exit(1);
}

import { GithubApiService } from "./src/Services/GithubApiService.ts";
import { ServiceError } from "./src/Types/index.ts";
import { UserInfo } from "./src/user_info.ts";
import { Card } from "./src/card.ts";
import { COLORS } from "./src/theme.ts";

async function main() {
  console.log("Starting trophy render...");
  console.log("Username:", username);
  console.log("Output path:", outputPath);
  console.log("Game theme:", gameTheme);

  const svc = new GithubApiService();

  const userInfoOrError = await svc.requestUserInfo(username);

  if (userInfoOrError instanceof ServiceError) {
    console.error(
      `Failed to fetch user info: ${userInfoOrError.message}`,
    );
    Deno.exit(2);
  }

  const userInfo: UserInfo = userInfoOrError;

  const panelSize = 115;
  const maxRow = 10;
  const maxColumn = -1; // auto
  const marginWidth = 10;
  const marginHeight = 10;
  const noBackground = false;
  const noFrame = false;

  const card = new Card(
    [],
    [],
    gameTheme,
    maxColumn,
    maxRow,
    panelSize,
    marginWidth,
    marginHeight,
    noBackground,
    noFrame,
  );
  const theme = COLORS.default;
  const svg = card.render(userInfo, theme);

  try {
    const dir = outputPath.replace(/\/[^/]+$/, "");
    if (dir) await Deno.mkdir(dir, { recursive: true });
  } catch {
    console.error("Failed to create directory. No permission?");
    Deno.exit(3);
  }

  await Deno.writeTextFile(outputPath, svg);
  console.log(`Wrote ${outputPath}`);
}

await main();
