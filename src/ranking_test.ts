import {
  assertEquals,
  assertRejects,
  returnsNext,
  soxa,
  stub,
} from "../deps.ts";
import * as trophies from "./trophy.ts";
import { RANK } from "./utils.ts";
import { GitHubUserAll, UserInfo } from "./user_info.ts";
import { GithubApiService } from "./Services/GithubApiService.ts";

const ranks = [
  RANK.C,
  RANK.B,
  RANK.A,
  RANK.AA,
  RANK.AAA,
  RANK.S,
  RANK.SS,
  RANK.SSS,
];
const categories: [new (score: number) => trophies.Trophy, number[]][] = [
  [trophies.TotalStarTrophy, [1, 10, 30, 50, 100, 200, 700, 2000]],
  [trophies.TotalCommitTrophy, [1, 10, 100, 200, 500, 1000, 2000, 4000]],
  [trophies.TotalFollowerTrophy, [1, 10, 20, 50, 100, 200, 400, 1000]],
  [trophies.TotalIssueTrophy, [1, 10, 20, 50, 100, 200, 500, 1000]],
  [trophies.TotalPullRequestTrophy, [1, 10, 20, 50, 100, 200, 500, 1000]],
  [trophies.TotalRepositoryTrophy, [1, 10, 20, 30, 35, 40, 45, 50]],
  [trophies.TotalReviewsTrophy, [1, 3, 8, 20, 30, 45, 57, 70]],
  [trophies.AccountDurationTrophy, [
    182,
    547,
    1095,
    1826,
    2739,
    3652,
    5478,
    7305,
  ]],
];
for (const [Category, thresholds] of categories) {
  Deno.test(`${Category.name}: every rank boundary`, () => {
    assertEquals(new Category(0).rank, RANK.UNKNOWN);
    thresholds.forEach((threshold, i) => {
      assertEquals(
        new Category(threshold - 1).rank,
        i === 0 ? RANK.UNKNOWN : ranks[i - 1],
      );
      assertEquals(new Category(threshold).rank, ranks[i]);
      assertEquals(new Category(threshold + 1).rank, ranks[i]);
    });
  });
}
const fixture = (createdAt = "2020-11-19T12:00:00Z"): GitHubUserAll => ({
  createdAt,
  contributionsCollection: {
    totalCommitContributions: 10,
    restrictedContributionsCount: 90,
    totalPullRequestReviewContributions: 3,
  },
  organizations: { totalCount: 1 },
  followers: { totalCount: 2 },
  openIssues: { totalCount: 4 },
  closedIssues: { totalCount: 5 },
  pullRequests: { totalCount: 6 },
  repositories: {
    totalCount: 2,
    nodes: [
      {
        createdAt: "2007-01-01T00:00:00Z",
        stargazers: { totalCount: 7 },
        languages: { nodes: [{ name: "Dart" }, { name: "Go" }] },
      },
      {
        createdAt,
        stargazers: { totalCount: 8 },
        languages: { nodes: [{ name: "Dart" }] },
      },
    ],
  },
});
const calculate = (data: GitHubUserAll, now: string) =>
  new UserInfo(data, data, data, data, Date.parse(now));
Deno.test("aggregation uses account creation, actual days and commits only", () => {
  const info = calculate(fixture(), "2021-11-19T12:00:00Z");
  assertEquals(info.totalCommits, 10);
  assertEquals(info.totalStargazers, 15);
  assertEquals(info.totalIssues, 9);
  assertEquals(info.languageCount, 2);
  assertEquals(info.durationDays, 365);
  assertEquals(info.durationYear, 1);
  assertEquals(info.ancientAccount, 0);
  assertEquals(info.ogAccount, 0);
  assertEquals(info.joined2020, 1);
});
Deno.test("account anniversary and UTC year boundaries", () => {
  assertEquals(calculate(fixture(), "2030-11-19T11:59:59Z").durationYear, 9);
  assertEquals(calculate(fixture(), "2030-11-19T12:00:00Z").durationYear, 10);
  assertEquals(
    calculate(fixture("2010-01-01T00:00:00Z"), "2030-01-01T00:00:00Z")
      .ancientAccount,
    0,
  );
  assertEquals(
    calculate(fixture("2009-12-31T23:59:59Z"), "2030-01-01T00:00:00Z")
      .ancientAccount,
    1,
  );
  assertEquals(
    calculate(fixture("2008-12-31T23:59:59Z"), "2030-01-01T00:00:00Z")
      .ogAccount,
    1,
  );
});
Deno.test("repository pagination includes stars and languages from later pages", async () => {
  const service = new GithubApiService();
  const data = fixture();
  data.repositories.pageInfo = { hasNextPage: true, endCursor: "page-1" };
  const mock = stub(
    service,
    "executeQuery",
    returnsNext([
      Promise.resolve(data),
      Promise.resolve({
        repositories: {
          totalCount: 3,
          nodes: [{
            createdAt: data.createdAt,
            stargazers: { totalCount: 100 },
            languages: { nodes: [{ name: "Rust" }] },
          }],
          pageInfo: { hasNextPage: false, endCursor: "page-2" },
        },
      }),
    ]),
  );
  try {
    const info = await service.requestUserInfo("example");
    assertEquals(info instanceof UserInfo, true);
    if (!(info instanceof UserInfo)) return;
    assertEquals(info.totalStargazers, 115);
    assertEquals(info.languageCount, 3);
    assertEquals(mock.calls[1].args[1], {
      username: "example",
      after: "page-1",
    });
  } finally {
    mock.restore();
  }
});

Deno.test("secret trophies unlock at their exact thresholds", () => {
  const secrets: [new (score: number) => trophies.Trophy, number][] = [
    [trophies.MultipleLangTrophy, 10],
    [trophies.LongTimeAccountTrophy, 10],
    [trophies.MultipleOrganizationsTrophy, 3],
    [trophies.Joined2020Trophy, 1],
    [trophies.AncientAccountTrophy, 1],
    [trophies.OGAccountTrophy, 1],
    [trophies.AllSuperRankTrophy, 1],
  ];
  for (const [Category, threshold] of secrets) {
    assertEquals(new Category(threshold - 1).rank, RANK.UNKNOWN);
    assertEquals(new Category(threshold).rank, RANK.SECRET);
  }
});
Deno.test("progress shows partial first rank, resets at promotion, and caps at maximum", () => {
  const theme = {
    BACKGROUND: "#000",
    TITLE: "#fff",
    TEXT: "#fff",
    NEXT_RANK_BAR: "#fff",
    CARD_BORDER: "#fff",
    CARD_HIGHLIGHT: "#fff",
  };
  const progressEnd = (trophy: trophies.Trophy) =>
    Number(
      trophy.render(theme).match(
        /id="[^"]+-rank-progress" d="M15 101 H([\d.]+)/,
      )?.[1],
    );
  assertEquals(progressEnd(new trophies.AccountDurationTrophy(91)), 55);
  assertEquals(progressEnd(new trophies.TotalStarTrophy(10)), 15);
  assertEquals(progressEnd(new trophies.TotalStarTrophy(20)), 55);
  assertEquals(progressEnd(new trophies.TotalStarTrophy(2000)), 95);
});

Deno.test("partial GraphQL responses are rejected instead of producing incomplete ranks", async () => {
  const { requestGithubData } = await import("./Services/request.ts");
  const mock = stub(soxa, "post", () =>
    Promise.resolve({
      data: {
        data: { user: fixture() },
        errors: [{ type: "RATE_LIMITED", message: "Rate limit" }],
      },
    }));
  try {
    await assertRejects(() =>
      requestGithubData("query", { username: "example" })
    );
  } finally {
    mock.restore();
  }
});
Deno.test("failed later repository pages cannot silently lower ranks", async () => {
  const { ServiceError, EServiceKindError } = await import("./Types/index.ts");
  const service = new GithubApiService();
  const data = fixture();
  data.repositories.pageInfo = { hasNextPage: true, endCursor: "next" };
  const error = new ServiceError("Rate limit", EServiceKindError.RATE_LIMIT);
  const mock = stub(
    service,
    "executeQuery",
    returnsNext([Promise.resolve(data), Promise.resolve(error)]),
  );
  try {
    assertEquals(await service.requestUserInfo("example"), error);
  } finally {
    mock.restore();
  }
});
