import {
  AccountDurationTrophy,
  AllSuperRankTrophy,
  AncientAccountTrophy,
  Joined2020Trophy,
  LongTimeAccountTrophy,
  MultipleLangTrophy,
  MultipleOrganizationsTrophy,
  OGAccountTrophy,
  TotalCommitTrophy,
  TotalFollowerTrophy,
  TotalIssueTrophy,
  TotalPullRequestTrophy,
  TotalRepositoryTrophy,
  TotalReviewsTrophy,
  TotalStarTrophy,
  Trophy,
} from "./trophy.ts";
import { UserInfo } from "./user_info.ts";
import { RANK, RANK_ORDER, resolveRankFilterAliases } from "./utils.ts";

export class TrophyList {
  private trophies = new Array<Trophy>();
  constructor(userInfo: UserInfo) {
    this.trophies = [
      new TotalStarTrophy(userInfo.totalStargazers),
      new TotalCommitTrophy(userInfo.totalCommits),
      new TotalFollowerTrophy(userInfo.totalFollowers),
      new TotalIssueTrophy(userInfo.totalIssues),
      new TotalPullRequestTrophy(userInfo.totalPullRequests),
      new TotalRepositoryTrophy(userInfo.totalRepositories),
      new TotalReviewsTrophy(userInfo.totalReviews),
      new AccountDurationTrophy(userInfo.durationDays),
      new MultipleLangTrophy(userInfo.languageCount),
      new LongTimeAccountTrophy(userInfo.durationYear),
      new AncientAccountTrophy(userInfo.ancientAccount),
      new OGAccountTrophy(userInfo.ogAccount),
      new Joined2020Trophy(userInfo.joined2020),
      new MultipleOrganizationsTrophy(userInfo.totalOrganizations),
    ];
    this.trophies.push(new AllSuperRankTrophy(this.isAllSRank));
  }
  get length() {
    return this.trophies.length;
  }
  get getArray() {
    return this.trophies;
  }
  private get isAllSRank() {
    return this.trophies.filter((trophy) => !trophy.hidden).every((trophy) =>
        trophy.rank.slice(0, 1) === RANK.S
      )
      ? 1
      : 0;
  }
  filterByHidden() {
    this.trophies = this.trophies.filter((trophy) =>
      !trophy.hidden || trophy.rank !== RANK.UNKNOWN
    );
  }
  filterByTitles(titles: Array<string>) {
    this.trophies = this.trophies.filter((trophy) => {
      return trophy.filterTitles.some((title) => titles.includes(title));
    });
  }
  filterByRanks(ranks: Array<string>) {
    const included = ranks.filter((rank) => !rank.startsWith("-"))
      .flatMap(resolveRankFilterAliases);
    const excluded = new Set(
      ranks.filter((rank) => rank.startsWith("-"))
        .flatMap((rank) => resolveRankFilterAliases(rank.slice(1))),
    );
    this.trophies = this.trophies.filter((trophy) =>
      (included.length === 0 || included.includes(trophy.rank)) &&
      !excluded.has(trophy.rank)
    );
  }

  filterByExclusionTitles(titles: Array<string>) {
    const excludeTitles = titles.filter((title) => title.startsWith("-")).map(
      (title) => title.substring(1),
    );
    if (excludeTitles.length > 0) {
      this.trophies = this.trophies.filter((trophy) =>
        !excludeTitles.includes(trophy.title)
      );
    }
  }
  sortByRank() {
    this.trophies = this.trophies.toSorted((a: Trophy, b: Trophy) =>
      RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank)
    );
  }
}
