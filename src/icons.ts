import { RANK } from "./utils.ts";
import { Theme } from "./theme.ts";
import { RANK_ICON_DATA_URIS } from "./rank_icon_data.ts";

const GAME_ICON_PACKS: Record<string, string> = {
  lol: "rank-icon-pack-league-of-legends",
};

const LEAGUE_RANK_ICON_FILE_BY_RANK: Record<RANK, string> = {
  [RANK.SECRET]: "9476-challenger.png",
  [RANK.SSS]: "9476-challenger.png",
  [RANK.SS]: "9476-grandmaster.png",
  [RANK.S]: "9231-master.png",
  [RANK.AAA]: "1053-diamond.png",
  [RANK.AA]: "3978-platinum.png",
  [RANK.A]: "1053-gold.png",
  [RANK.B]: "7455-silver.png",
  [RANK.C]: "1184-bronze.png",
  [RANK.UNKNOWN]: "7574-iron.png",
};


const getGamePackName = (iconTheme: string): string => {
  return GAME_ICON_PACKS[iconTheme.toLowerCase()] ?? GAME_ICON_PACKS.lol;
};

const getRankIconFileByTheme = (rank: RANK, _iconTheme: string): string => {
  return LEAGUE_RANK_ICON_FILE_BY_RANK[rank];
};

const getRankIconPublicPath = (rank: RANK, iconTheme: string): string => {
  const pack = getGamePackName(iconTheme);
  const iconFileName = getRankIconFileByTheme(rank, iconTheme);
  return `/${pack}/${iconFileName}`;
};

const getRankIconDataUri = (rank: RANK, iconTheme: string): string | null => {
  const iconFileName = getRankIconFileByTheme(rank, iconTheme);
  return RANK_ICON_DATA_URIS[iconFileName] ?? null;
};

export const getNextRankBar = (
  title: string,
  percentage: number,
  color: string,
): string => {
  const maxWidth = 80;
  const filledWidth = Math.max(0, Math.min(maxWidth, maxWidth * percentage));
  const y = 101;
  const height = 3.2;
  const bgPath = `M15 ${y} H${15 + maxWidth} V${y + height} H15 Z`;
  const fgPath = `M15 ${y} H${15 + filledWidth} V${y + height} H15 Z`;

  return `
    <style>
    @keyframes ${title}RankAnimation {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
    #${title}-rank-progress{
      transform-origin: 15px ${y}px;
      animation: ${title}RankAnimation 1s forwards ease-in-out;
    }
    </style>
    <path d="${bgPath}" opacity="0.3" fill="${color}" />
    <path id="${title}-rank-progress" d="${fgPath}" fill="${color}" />
  `;
};

export const getTrophyIcon = (
  _theme: Theme,
  rank = RANK.UNKNOWN,
  iconTheme = "lol",
) => {
  const rankIcon = getRankIconDataUri(rank, iconTheme);
  const fallbackIconPath = getRankIconPublicPath(rank, iconTheme);
  const iconHref = rankIcon ?? fallbackIconPath;

  return `
  <svg x="25" y="22" width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <image
      x="0"
      y="0"
      width="60"
      height="60"
      opacity="1"
      preserveAspectRatio="xMidYMid meet"
      href="${iconHref}"
    />
  </svg>
  `;
};
