import { Card } from "../src/card.ts";
import { CONSTANTS, parseParams } from "../src/utils.ts";
import { GithubRepositoryService } from "../src/Repository/GithubRepository.ts";
import { GithubApiService } from "../src/Services/GithubApiService.ts";
import { ServiceError } from "../src/Types/index.ts";
import { ErrorPage } from "../src/pages/Error.ts";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const serviceProvider = new GithubApiService();
const client = new GithubRepositoryService(serviceProvider).repository;

const DEFAULT_THEME = {
  BACKGROUND: "#0f1318",
  TITLE: "#e9eef7",
  TEXT: "#a5b1c3",
  NEXT_RANK_BAR: "#6fb2ff",
  CARD_BORDER: "#2b3443",
  CARD_HIGHLIGHT: "#3f4c61",
};

const LIMITS = {
  MIN_ROW: 1,
  MAX_ROW: 10,
  MIN_COLUMN: 1,
  MAX_COLUMN: 12,
  MIN_MARGIN: 0,
  MAX_MARGIN: 50,
  MAX_FILTER_ITEMS: 64,
  MAX_FILTER_ITEM_LENGTH: 64,
};

const cacheControlHeader = [
  "public",
  "max-age=120",
  "s-maxage=120",
].join(", ");

const defaultHeaders = new Headers(
  {
    "Content-Type": "image/svg+xml",
    "Cache-Control": cacheControlHeader,
  },
);

export default function requestHandler(request: Request) {
  return app(request);
}

const getConfiguredUsername = (): string => {
  return (
    Deno.env.get("PROFILE_USERNAME")?.trim() ||
    Deno.env.get("GITHUB_USERNAME")?.trim() ||
    ""
  );
};

const hasConfiguredToken = (): boolean => {
  return (
    (Deno.env.get("GITHUB_TOKEN1")?.trim().length ?? 0) > 0 ||
    (Deno.env.get("GITHUB_TOKEN2")?.trim().length ?? 0) > 0
  );
};

const clampInteger = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, Math.trunc(value)));
};

const resolveColumn = (value: number): number => {
  return value === -1
    ? -1
    : clampInteger(value, LIMITS.MIN_COLUMN, LIMITS.MAX_COLUMN);
};

const parseListQueryValues = (
  params: URLSearchParams,
  key: string,
): Array<string> => {
  return params.getAll(key)
    .flatMap((r) => r.split(","))
    .map((r) => r.trim())
    .filter((r) => r.length > 0 && r.length <= LIMITS.MAX_FILTER_ITEM_LENGTH)
    .slice(0, LIMITS.MAX_FILTER_ITEMS);
};

const htmlResponse = (status: number, html: string): Response => {
  return new Response(html, {
    status,
    headers: new Headers({
      "Content-Type": "text/html",
      "Cache-Control": cacheControlHeader,
    }),
  });
};

async function app(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return htmlResponse(405, "<h2>Method Not Allowed.</h2><p>Use GET.</p>");
  }

  const params = parseParams(req);
  const configuredUsername = getConfiguredUsername();
  if (configuredUsername.length === 0) {
    return htmlResponse(
      500,
      "<h2>Missing PROFILE_USERNAME or GITHUB_USERNAME in environment variables.</h2><p>Set your own GitHub username to lock this deployment.</p>",
    );
  }
  if (!hasConfiguredToken()) {
    return htmlResponse(
      500,
      "<h2>Missing GITHUB_TOKEN1/GITHUB_TOKEN2 in environment variables.</h2><p>Create a personal token and set it in your deployment environment.</p>",
    );
  }

  const requestedUsername = params.getStringValue("username", configuredUsername)
    .trim();
  if (requestedUsername.length === 0) {
    return htmlResponse(400, "<h2>Username is required.</h2>");
  }
  if (requestedUsername.toLowerCase() !== configuredUsername.toLowerCase()) {
    return htmlResponse(
      403,
      `<h2>Forbidden</h2><p>This deployment is locked to @${configuredUsername}.</p>`,
    );
  }

  const row = clampInteger(
    params.getNumberValue("row", CONSTANTS.DEFAULT_MAX_ROW),
    LIMITS.MIN_ROW,
    LIMITS.MAX_ROW,
  );
  const column = resolveColumn(
    params.getNumberValue("column", CONSTANTS.DEFAULT_MAX_COLUMN),
  );
  const rawTheme = params.get("theme")?.trim() ?? "";
  if (rawTheme.length === 0) {
    return htmlResponse(
      400,
      "<h2>Theme is required.</h2><p>Use ?theme=lol for this deployment.</p>",
    );
  }
  const iconTheme = rawTheme;
  const theme = DEFAULT_THEME;
  const marginWidth = clampInteger(
    params.getNumberValue(
      "margin-w",
      CONSTANTS.DEFAULT_MARGIN_W,
    ),
    LIMITS.MIN_MARGIN,
    LIMITS.MAX_MARGIN,
  );
  const marginHeight = clampInteger(
    params.getNumberValue(
      "margin-h",
      CONSTANTS.DEFAULT_MARGIN_H,
    ),
    LIMITS.MIN_MARGIN,
    LIMITS.MAX_MARGIN,
  );
  const noBackground = params.getBooleanValue(
    "no-bg",
    CONSTANTS.DEFAULT_NO_BACKGROUND,
  );
  const noFrame = params.getBooleanValue(
    "no-frame",
    CONSTANTS.DEFAULT_NO_FRAME,
  );
  const titles = parseListQueryValues(params, "title");
  const ranks = parseListQueryValues(params, "rank");

  const userInfo = await client.requestUserInfo(configuredUsername);
  if (userInfo instanceof ServiceError) {
    return new Response(
      ErrorPage({ error: userInfo }).render(),
      {
        status: userInfo.code,
        headers: new Headers({
          "Content-Type": "text/html",
          "Cache-Control": cacheControlHeader,
        }),
      },
    );
  }

  // Success Response
  return new Response(
    new Card(
      titles,
      ranks,
      iconTheme,
      column,
      row,
      CONSTANTS.DEFAULT_PANEL_SIZE,
      marginWidth,
      marginHeight,
      noBackground,
      noFrame,
    ).render(userInfo, theme),
    {
      headers: defaultHeaders,
    },
  );
}
