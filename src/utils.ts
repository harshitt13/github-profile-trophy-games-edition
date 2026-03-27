export class CustomURLSearchParams extends URLSearchParams {
  getStringValue(key: string, defaultValue: string): string {
    if (super.has(key)) {
      const param = super.get(key);
      if (param !== null) {
        return param.toString();
      }
    }
    return defaultValue.toString();
  }
  getNumberValue(key: string, defaultValue: number): number {
    if (super.has(key)) {
      const param = super.get(key);
      if (param !== null) {
        const parsedValue = Number.parseInt(param);
        if (Number.isNaN(parsedValue)) {
          return defaultValue;
        }
        return parsedValue;
      }
    }
    return defaultValue;
  }
  getBooleanValue(key: string, defaultValue: boolean): boolean {
    if (super.has(key)) {
      const param = super.get(key);
      return param !== null && param.toString() === "true";
    }
    return defaultValue;
  }
}

export function parseParams(req: Request): CustomURLSearchParams {
  try {
    const parsedUrl = new URL(req.url);
    return new CustomURLSearchParams(parsedUrl.search);
  } catch {
    const splittedURL = req.url.split("?");
    if (splittedURL.length < 2) {
      return new CustomURLSearchParams();
    }
    return new CustomURLSearchParams(splittedURL[1]);
  }
}

export function abridgeScore(score: number): string {
  if (Math.abs(score) < 1) {
    return "0pt";
  }
  if (Math.abs(score) > 999) {
    return (Math.sign(score) * (Math.abs(score) / 1000)).toFixed(1) + "kpt";
  }
  return (Math.sign(score) * Math.abs(score)).toString() + "pt";
}

export const CONSTANTS = {
  DEFAULT_PANEL_SIZE: 110,
  DEFAULT_MAX_COLUMN: 8,
  DEFAULT_MAX_ROW: 3,
  DEFAULT_MARGIN_W: 0,
  DEFAULT_MARGIN_H: 0,
  DEFAULT_NO_BACKGROUND: false,
  DEFAULT_NO_FRAME: false,
  DEFAULT_GITHUB_API: "https://api.github.com/graphql",
  DEFAULT_GITHUB_RETRY_DELAY: 500,
};

export enum RANK {
  SECRET = "SECRET",
  SSS = "SSS",
  SS = "SS",
  S = "S",
  AAA = "AAA",
  AA = "AA",
  A = "A",
  B = "B",
  C = "C",
  UNKNOWN = "?",
}

export const RANK_ORDER = Object.values(RANK);

const RANK_FILTER_ALIASES: Record<string, Array<RANK>> = {
  "?": [RANK.UNKNOWN],
  unknown: [RANK.UNKNOWN],
  secret: [RANK.SECRET],
  sss: [RANK.SSS],
  ss: [RANK.SS],
  s: [RANK.S],
  aaa: [RANK.AAA],
  aa: [RANK.AA],
  a: [RANK.A],
  b: [RANK.B],
  c: [RANK.C],
  iron: [RANK.UNKNOWN],
  bronze: [RANK.C],
  silver: [RANK.B],
  gold: [RANK.A],
  platinum: [RANK.AA],
  diamond: [RANK.AAA],
  master: [RANK.S],
  grandmaster: [RANK.SS],
  challenger: [RANK.SSS, RANK.SECRET],
};

export function resolveRankFilterAliases(rankValue: string): Array<RANK> {
  const normalized = rankValue.trim().toLowerCase();
  return RANK_FILTER_ALIASES[normalized] ?? [];
}
