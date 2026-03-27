# Contribution Guide

This project is a fork of [github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy) by [ryo-ma](https://github.com/ryo-ma). We maintain improvements and enhancements while honoring the original creator's work.

## Environment

- Deno >= v1.36.1
- [Vercel](https://vercel.com/)
- GitHub API v4
- Docker and Docker compose (optional)

## Local Run

### Generate GitHub Tokens

1. Go to GitHub **Settings** → **Developer settings** → **Personal access tokens** → **[Tokens (classic)](https://github.com/settings/tokens)**
2. Click **Generate new token (classic)**
3. Set the token name (e.g., "GitHub Trophy Token")
4. Set expiration (90 days or No expiration recommended)
5. Select scopes:
   - ✅ `public_repo` - Access to public repositories
   - ✅ `read:user` - Read user profile data
6. Generate token and copy the value (don't lose it - you won't see it again!)
7. Optionally create a second token for better rate limiting

### Setup Local Environment

Create `.env` file in project root directory with your GitHub tokens:

```properties
PROFILE_USERNAME=your-github-username
GITHUB_TOKEN1=your-first-token-here
GITHUB_TOKEN2=your-second-token-here (optional)

# if using GitHub Enterprise:
# (this env var defaults to https://api.github.com/graphql)
GITHUB_API=https://github.example.com/api/graphql
```

### Run Local Server

Using Docker Compose (recommended):

```sh
docker compose up -d
```

Then open your browser:

```
http://localhost:8080/?theme=lol
```

Or using Deno directly:

```sh
deno task start
```

**Note:** Redis is no longer used in this refactor.

### Verify Your Setup

Test the endpoint:

```
http://localhost:8080/?theme=lol&column=8&rank=master,diamond
```

Should see your GitHub trophies displayed with League of Legends themed icons.

## Editor config

Read the [.editorconfig](./.editorconfig)

## Pull Requests

Pull requests are always welcome! In general, they should a single concern in
the least number of changed lines as possible. For changes that address core
functionality, it is best to open an issue to discuss your proposal first. I
look forward to seeing what you come up with!

## Run deno lint

## What to do before contributing

### 1. Run deno lint

```sh
deno task lint
```

### 2. Run deno format

```sh
deno task format
```

### 3. Run deno test

```sh
deno task test
```
