# Contributing

Use Deno 2. Follow the local setup in [README.md](README.md).

Before submitting changes, run:

```sh
deno fmt --check
deno task lint
deno task test
deno check main.ts render_svg.ts
```

Preserve the root `trophy.svg` path because profile README files consume it.
Keep rank icons embedded so the SVG does not depend on external image requests.
Add regression coverage for ranking, filtering, and generation changes. Never
commit tokens or replace the generated trophy with an API error response.
