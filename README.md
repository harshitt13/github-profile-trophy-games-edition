<!-- markdownlint-disable MD033 MD041 MD045 MD040 -->

<div align="center">
  <img width="140" src="https://user-images.githubusercontent.com/6661165/91657958-61b4fd00-eb00-11ea-9def-dc7ef5367e34.png"  alt="GitHub Profile Trophy Games Edition"/>
  <h2 align="center">GitHub Profile Trophy: Games Edition</h2>
  <p align="center">🏆 Add dynamically generated GitHub Stat Trophies with League of Legends rank icons on your README</p>
  <p align="center"><strong>A Fork of <a href="https://github.com/ryo-ma/github-profile-trophy">github-profile-trophy</a> by <a href="https://github.com/ryo-ma">ryo-ma</a></strong></p>
</div>
<div align="center">

[![stargazers](https://img.shields.io/github/stars/harshitt13/github-profile-trophy-games-edition)](https://github.com/harshitt13/github-profile-trophy-games-edition/stargazers)
[![forks](https://img.shields.io/github/forks/harshitt13/github-profile-trophy-games-edition)](https://github.com/harshitt13/github-profile-trophy-games-edition/network/members)
[![issues](https://img.shields.io/github/issues/harshitt13/github-profile-trophy-games-edition)](https://github.com/harshitt13/github-profile-trophy-games-edition/issues)
[![license](https://img.shields.io/github/license/harshitt13/github-profile-trophy-games-edition)](https://github.com/harshitt13/github-profile-trophy-games-edition/blob/main/LICENSE)

</div>

# Quick Start

This fork is personal-deploy first. Each user should deploy their own instance and lock it to their own username.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fharshitt13%2Fgithub-profile-trophy-games-edition&env=PROFILE_USERNAME,GITHUB_TOKEN1,GITHUB_TOKEN2&envDescription=GitHub%20tokens%20and%20profile%20settings&project-name=github-profile-trophy&repository-name=github-profile-trophy)

### Setup Instructions

#### Step 1: Generate GitHub Tokens

1. Go to GitHub **Settings** → **Developer settings** → **Personal access tokens** → **[Tokens (classic)](https://github.com/settings/tokens)**
2. Click **Generate new token (classic)**
3. Set the token name (e.g., "GitHub Trophy Token")
4. Set expiration (e.g., 90 days or No expiration)
5. Select scopes:
   - ✅ `public_repo` - Access to public repositories
   - ✅ `read:user` - Read user profile data
6. Click **Generate token** and copy the token value
7. Repeat steps 2-6 to create a second token (optional but recommended for rate limiting)

#### Step 2: Deploy on Vercel

1. Click the "Deploy with Vercel" button above
2. Log in to your Vercel account (or create one)
3. On the "Create Git Repository" screen:
   - Choose your GitHub account
   - Set repository name (e.g., `github-profile-trophy`)
4. On the "Environment Variables" screen, fill in:
   - **PROFILE_USERNAME**: Your GitHub username (e.g., `harshitt13`)
   - **GITHUB_TOKEN1**: First token generated in Step 1
   - **GITHUB_TOKEN2**: Second token (optional, for better rate limiting)
5. Click **Deploy**
6. Wait for deployment to complete (usually 1-2 minutes)
7. Copy your Vercel deployment URL (e.g., `https://github-profile-trophy-USERNAME.vercel.app`)

#### Step 3: Use Your Deployment

```markdown
[![trophy](https://YOUR-DEPLOYMENT.vercel.app/?theme=lol)](https://github.com/ryo-ma/github-profile-trophy)
```

Replace `YOUR-DEPLOYMENT` with your Vercel URL. Example:

```markdown
[![trophy](https://github-profile-trophy-harshitt13.vercel.app/?theme=lol)](https://github.com/ryo-ma/github-profile-trophy)
```

<p align="center">
  <img src="https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&column=8&rank=challenger,grandmaster,master,diamond,platinum,gold,silver,bronze" />
</p>

This server rejects requests for usernames different from `PROFILE_USERNAME`.

#### Available Query Parameters

- `theme=lol` - Apply League of Legends themed icons (default)
- `column=6` - Max number of columns (default: 6)
- `row=3` - Max number of rows (default: 3)
- `rank=master,diamond` - Filter by specific ranks
- `title=Stars,Followers` - Filter by specific trophy titles
- `no-bg` - Transparent background
- `no-frame` - Hide trophy frames

## Theme

This fork uses **League of Legends themed rank icons** to display your GitHub achievements.

The trophy system uses RiotGames League of Legends rank icons:
- **Iron** - Starting rank (?)
- **Bronze** - Entry level (C tier)
- **Silver** - Good progress (B tier)
- **Gold** - Strong performer (A tier)
- **Platinum** - Very good (AA tier)
- **Diamond** - Elite player (AAA tier)
- **Master** - Top tier (S tier)
- **Grandmaster** - Master level (SS tier)
- **Challenger** - Peak rank (SSS & SECRET tiers)

```markdown
[![trophy](https://YOUR-DEPLOYMENT.vercel.app/?theme=lol)](https://github.com/ryo-ma/github-profile-trophy)
```

# About Rank

Rank emblems now use League of Legends icons and follow this order:
`Iron < Bronze < Silver < Gold < Platinum < Diamond < Master < Grandmaster < Challenger`.

Internal score tiers are still based on the original ranks:
`C B A AA AAA S SS SSS SECRET`.

Alias mapping used by `rank=` filter:

| Alias       | Internal tier(s) |
| ----------- | ---------------- |
| iron        | UNKNOWN (`?`)    |
| bronze      | C                |
| silver      | B                |
| gold        | A                |
| platinum    | AA               |
| diamond     | AAA              |
| master      | S                |
| grandmaster | SS               |
| challenger  | SSS, SECRET      |

Ranks are `SSS` `SS` `S` `AAA` `AA` `A` `B` `C` `UNKNOWN` `SECRET`.

| Rank       | Description                                                                                |
| ---------- | ------------------------------------------------------------------------------------------ |
| SSS, SS, S | You are at a hard to reach rank. You can brag.                                             |
| AAA, AA, A | You will reach this rank if you do your best. Let's aim here first.                        |
| B, C       | You are currently making good progress. Let's aim a bit higher.                            |
| UNKNOWN    | You have not taken action yet. Let's act first.                                            |
| SECRET     | This rank is very rare. The trophy will not be displayed until certain conditions are met. |

**NOTE: The `UNKNOWN` rank is denoted by `?`**

## Secret Trophies

There are **7 secret trophies** that unlock under special conditions:

| Trophy | Condition | Unlock Criteria |
|--------|-----------|-------------------|
| **All S Rank** | Challenger | All base trophies at S rank (All-Super-Rank) |
| **Multi Language** | Challenger | Contributed in 10+ programming languages |
| **Long Time User** | Challenger | Account active for 10+ years |
| **Ancient User** | Challenger | Account created before 2010 |
| **OG User** | Challenger | Account created before 2008 |
| **Joined 2020** | Challenger | Joined GitHub in 2020 |
| **Multiple Organizations** | Challenger | Member of 3+ organizations |

Secret trophies appear as rank "Challenger" (SSS tier) when unlocked. The achievement is hidden until the condition is met!

# About Display details

<p align="center">
  <img width="220" src="https://user-images.githubusercontent.com/6661165/91642962-6333e600-ea6a-11ea-83af-e371e996bfa6.png" />
</p>

1. Title name of aggregation target.
2. Current rank.
3. Title according to rank.
4. Target aggregation result.
5. Rank progress bar.

# Optional Request Parameters

- [title](#filter-by-titles)
- [rank](#filter-by-ranks)
- [column](#specify-the-maximum-row--column-size)
- [row](#specify-the-maximum-row--column-size)
- [theme](#apply-theme)
- [margin-w](#margin-width)
- [margin-h](#margin-height)
- [no-bg](#transparent-background)
- [no-frame](#hide-frames)

## Filter by Titles

You can filter trophy display by specifying achievement titles.

**Available Trophy Categories:**
- `Reviews` - Total review comments
- `Experience` - Account age in days
- `Stars` - Total starred repositories
- `Commits` - Total commit count
- `Followers` - Follower count
- `Issues` - Total issues created
- `PullRequest` - Total pull requests
- `Repositories` - Total repositories
- `MultiLanguage` - Contributed in multiple languages (secret)
- `AllSuperRank` - All trophies at S rank (secret)
- `LongTimeUser` - 10+ year account (secret)
- `AncientUser` - Account before 2010 (secret)
- `OGUser` - Account before 2008 (secret)
- `Joined2020` - Joined in 2020 (secret)
- `Collaborator` - Member of 3+ organizations (secret)

**Examples:**

Show only Followers trophy:
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&title=Followers
```

Show multiple trophies:
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&title=Stars,Followers,Commits
```

Exclude specific trophies:
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&title=-Stars,-Followers
```

## Filter by Ranks

You can filter trophy display by rank tier.

**Available Ranks:**
- `c` or `bronze` - Bronze tier
- `b` or `silver` - Silver tier
- `a` or `gold` - Gold tier
- `aa` or `platinum` - Platinum tier
- `aaa` or `diamond` - Diamond tier
- `s` or `master` - Master tier
- `ss` or `grandmaster` - Grandmaster tier
- `sss` or `challenger` - Challenger tier
- `?` or `iron` - Unknown tier

**Examples:**

Show only Master rank trophies:
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&rank=master
```

Show multiple ranks:
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&rank=master,diamond,challenger
```

Exclude specific ranks:
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&rank=-bronze,-silver
```

**NOTE:** Since `UNKNOWN` is denoted by `?`, use `rank=?` to include it or `rank=-?` to exclude it.

## Specify the maximum row & column size

You can customize the grid layout for trophy display.

Defaults: `column=6` and `row=3`

**Restrict by row only:**
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&row=2
```

**Restrict by column only:**
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&column=4
```

**Restrict row and column:**
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&row=2&column=3
```

**Adaptive width (auto-fit columns):**
```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&column=-1
```

When `column=-1`, the width adapts to fit trophies, and the `row` parameter is ignored.

## Theme Parameter

The `theme` parameter selects the game icon pack:

- `theme=lol` - **League of Legends rank icons** (required)

```text
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol
```

**Note:** The theme parameter is required in this fork.

## Planned Themes

We're constantly working on adding more gaming-themed rank icon sets! Currently supported:

- ✅ `lol` - League of Legends rank icons

**Planned themes for future releases:**
- 🎮 Valorant rank icons
- 🎮 Dota 2 rank icons
- 🎮 Overwatch rank tiers
- 🎮 Apex Legends rank badges
- 🎮 Counter-Strike rank emblems

If you have suggestions for other game rank icons or themes, feel free to open an issue or contribute! Check [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## Margin Width

Add horizontal spacing between trophies.

`Default: margin-w=0` (in pixels)

```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&margin-w=15
```

## Margin Height

Add vertical spacing between trophies.

`Default: margin-h=0` (in pixels)

```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&margin-h=15
```

## Example Layout

Combine multiple parameters for custom layouts:

```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&column=3&margin-w=15&margin-h=15&no-bg=true
```

## Transparent Background

Remove the background from trophy cards.

`Default: no-bg=false`

```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&no-bg=true
```

## Hide Frames

Remove the decorative frames around each trophy.

`Default: no-frame=false`

```
https://YOUR-DEPLOYMENT.vercel.app/?theme=lol&no-frame=true
```

## Generate an svg file localy

Using the render_svg.ts script you can generate your trophys as an svg file
given your username, (Enviroment Vars: See [env-example](env-example)).

Usage:

```bash
deno run --allow-net --allow-env --allow-read --allow-write ./render_svg.ts USERNAME OUTPUT_DIR THEME
```

## Generate an svg inside Github CI (Workflow)

Using the provided github action you can easly generate the trophy inside an
github workflow. This eliminates the needs of an online service running but you
have to manualy update rerun the action to update the file.

Usage:

```yaml
- name: Generate trophy
  uses: Erik-Donath/github-profile-trophy@feature/generate-svg
  with:
    username: your-username
    output_path: trophy.svg
    token: ${{ secrets.GITHUB_TOKEN }}
```

# Contribution Guide

Check [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

# License

This product is licensed under the
[MIT License](https://github.com/ryo-ma/github-profile-trophy/blob/master/LICENSE).
