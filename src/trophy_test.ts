import { assertEquals } from "../deps.ts";
import { TrophyList } from "./trophy_list.ts";
import { Card } from "./card.ts";
import { UserInfo } from "./user_info.ts";
import { RANK } from "./utils.ts";
import { Theme } from "./theme.ts";

const user = {
  totalStargazers: 0,
  totalCommits: 0,
  totalFollowers: 0,
  totalIssues: 0,
  totalPullRequests: 0,
  totalRepositories: 0,
  totalReviews: 0,
  durationDays: 0,
  languageCount: 0,
  durationYear: 0,
  ancientAccount: 0,
  ogAccount: 0,
  joined2020: 0,
  totalOrganizations: 0,
} as UserInfo;
const theme: Theme = {
  BACKGROUND: "#000",
  TITLE: "#fff",
  TEXT: "#fff",
  NEXT_RANK_BAR: "#fff",
  CARD_BORDER: "#fff",
  CARD_HIGHLIGHT: "#fff",
};
Deno.test("AllSuperRank stays locked for a new account", () => {
  const list = new TrophyList(user);
  list.filterByHidden();
  assertEquals(list.getArray.some((t) => t.title === "AllSuperRank"), false);
});
Deno.test("AllSuperRank unlocks when every base trophy is S or above", () => {
  const veteran = Object.fromEntries(
    Object.keys(user).map((key) => [key, 100000]),
  ) as unknown as UserInfo;
  const list = new TrophyList(veteran);
  assertEquals(
    list.getArray.find((t) => t.title === "AllSuperRank")?.rank,
    RANK.SECRET,
  );
});
Deno.test("rank include and exclude filters compose", () => {
  const list = new TrophyList(user);
  list.filterByHidden();
  list.filterByRanks(["iron", "-challenger"]);
  assertEquals(list.length, 8);
  assertEquals(list.getArray.every((t) => t.rank === RANK.UNKNOWN), true);
});
Deno.test("empty automatic grid has valid dimensions", () => {
  const svg = new Card(["missing"], [], "lol", -1, 3, 110, 10, 10, false, false)
    .render(user, theme);
  assertEquals(svg.includes('viewBox="0 0 110 110"'), true);
});
Deno.test("row limit omits trophies beyond the visible grid", () => {
  const svg = new Card([], [], "lol", 1, 1, 110, 0, 0, false, false).render(
    user,
    theme,
  );
  assertEquals((svg.match(/<image/g) || []).length, 1);
});
