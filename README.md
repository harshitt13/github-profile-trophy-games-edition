# GitHub Profile Trophy: League of Legends Edition

GitHub achievements displayed with embedded League of Legends rank emblems. The
generated image is self-contained and works in GitHub README files. Based on
[ryo-ma/github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy).

![GitHub trophies](./trophy.svg)

## Your profile README

The daily workflow updates **`trophy.svg` at the repository root**. Keep using
that file URL in your profile README. For this repository:

```markdown
![GitHub trophies](https://raw.githubusercontent.com/harshitt13/github-profile-trophy-games-edition/main/trophy.svg)
```

The filename stays stable. GitHub's image proxy may take time to refresh cached
images.

## Automatic updates

The Update trophies workflow runs daily and can be started manually from
Actions. It uses the repository owner's username and the built-in `GITHUB_TOKEN`
by default. An optional `TROPHY_TOKEN` secret can provide additional visibility
when needed. Only `trophy.svg` is committed, only when changed, without force
pushes. Failed generation leaves the previous image intact.

No Vercel deployment, second token, or background server is needed for scheduled
updates. GitHub API rate limits still apply during generation.

## Local development

Install Deno 2, set `GITHUB_TOKEN1` in your environment, then run:

```sh
deno task generate harshitt13
deno task test
deno task lint
deno fmt --check
```

Generation accepts `USERNAME [OUTPUT_PATH] [THEME] [API_URL]`. Defaults are
`trophy.svg` and `lol`. Supply an API URL only to fetch an existing deployment.
Nested output directories require broader write permissions than
`deno task generate`.

## Optional HTTP endpoint

Set `PROFILE_USERNAME` and `GITHUB_TOKEN1`, then run `deno task start`. The
endpoint only serves the configured profile. Existing Vercel configuration and
composite Action inputs remain available.

| Parameter              | Behavior                                                        |
| ---------------------- | --------------------------------------------------------------- |
| `theme`                | Defaults to `lol`; legacy theme values use LoL icons            |
| `title`                | Comma-separated categories, such as `Stars,Commits,PullRequest` |
| `rank`                 | LoL ranks or original tiers; prefix with `-` to exclude         |
| `column`, `row`        | Grid limits, default 8 columns and 3 rows                       |
| `column=-1`            | Fit all trophies in one row                                     |
| `margin-w`, `margin-h` | Spacing in pixels, from 0 to 50                                 |
| `no-bg=true`           | Transparent backgrounds                                         |
| `no-frame=true`        | Hide card borders                                               |

Ranks: Iron, Bronze, Silver, Gold, Platinum, Diamond, Master, Grandmaster,
Challenger. Secret achievements also use Challenger emblems.

## How ranks are calculated

Each category receives the highest rank whose minimum score it meets. These are
custom achievement milestones, not GitHub percentiles or a measure of code
quality.

| Category           | Bronze | Silver | Gold | Platinum | Diamond | Master | Grandmaster | Challenger |
| ------------------ | ------ | ------ | ---- | -------- | ------- | ------ | ----------- | ---------- |
| Stars              | 1      | 10     | 30   | 50       | 100     | 200    | 700         | 2000       |
| Commits            | 1      | 10     | 100  | 200      | 500     | 1000   | 2000        | 4000       |
| Followers          | 1      | 10     | 20   | 50       | 100     | 200    | 400         | 1000       |
| Issues / PRs       | 1      | 10     | 20   | 50       | 100     | 200    | 500         | 1000       |
| Repositories       | 1      | 10     | 20   | 30       | 35      | 40     | 45          | 50         |
| Reviews            | 1      | 3      | 8    | 20       | 30      | 45     | 57          | 70         |
| Experience (years) | 0.5    | 1.5    | 3    | 5        | 7.5     | 10     | 15          | 20         |

Experience uses actual account age in days, with thresholds equal to
`floor(years * 365.25)`. LongTimeUser unlocks at the tenth UTC anniversary.
AllSuperRank requires all eight base categories at Master or higher; secret
achievements are excluded from that check.

Commits and reviews use GitHub's default contributions-collection time window
(the past year), not lifetime totals. Restricted contribution counts are
excluded from commits because they can include other contribution types. Private
activity visibility depends on the token and profile settings.

Stars are summed across all pages of owned repositories visible to the token.
Languages are deduplicated across those repositories, requesting up to 100 per
repository. MultiLanguage means ten languages in owned repositories, not ten
languages contributed to across all of GitHub. Repositories include forks.
Issues and PRs count authored items across all states; PRs need not be merged.
Followers and organization counts reflect the token's visible data.

The progress bar measures advancement within the current tier, resets on
promotion, and stays full at the highest tier. Updated calculations take effect
when the SVG is next generated; the existing file URL stays unchanged.

## Maintenance

CI checks formatting, lint, tests, and entry-point types on pushes and PRs.
Enable the Renovate GitHub app for this repository to activate
[the dependency update configuration](.github/renovate.json). It covers Deno
imports and GitHub Actions, groups minor and patch updates, and keeps major
updates separate for review. Automatic merging is disabled.

## License and attribution

See [LICENSE](LICENSE) for upstream attribution. League of Legends rank artwork
belongs to its respective owners. This project is not affiliated with Riot
Games.
