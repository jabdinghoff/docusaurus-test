# docusaurus-test

Customer documentation built with [Docusaurus](https://docusaurus.io), published to
GitHub Pages on every push to `main`.

There are two ways to edit it, and both end up as commits on `main`:

- **In the browser:** [Pages CMS](https://app.pagescms.org) with a WYSIWYG editor,
  configured in `.pages.yml`. People without a GitHub account can be invited by
  email. See `docs/editing-these-docs.md` for the guide aimed at them.
- **Locally:** edit the Markdown under `docs/` in any editor.

### Trial: Sveltia CMS

A second browser editor, [Sveltia CMS](https://sveltiacms.app), lives at
`/docusaurus-test/admin/` (`static/admin/`). Its rich-text editor shows `:::note`/`:::tip`/…
boxes as a "Callout box" component (`static/admin/admonition.js`). Sign in with a GitHub
personal access token for now; "Sign In with GitHub" needs an OAuth app plus a small auth
service (e.g. sveltia-cms-auth on Cloudflare Workers) set as `base_url`. Every editor needs
a GitHub account with write access. `tools/editor-format` mirrors Pages CMS, so pages saved
from Sveltia may fail the `editor-format` check.

## Local workflow

```sh
pnpm install
pnpm start                  # live preview on http://localhost:3000/docusaurus-test/
pnpm build                  # what CI deploys
DOCS_STRICT=1 pnpm build    # broken links/images as errors
```

### Editor format

The Pages CMS editor rewrites a whole page whenever it saves one. `tools/editor-format`
runs the same conversion as the hosted editor, with the same library versions, so pages
you write locally are already in the form the editor saves. A browser edit then only
changes what was actually edited.

```sh
pnpm --dir tools/editor-format install
pnpm --dir tools/editor-format format   # rewrite pages; review the diff
pnpm --dir tools/editor-format check    # what CI runs
```

A page the editor would mangle a little more on every save is reported and left
unchanged; rewrite the lines it points at. To run the formatter via `jj fix`
(repo config, not versioned):

```sh
jj config set --repo fix.tools.editor-format.command '["node", "tools/editor-format/format.mjs", "--stdin"]'
jj config set --repo fix.tools.editor-format.patterns '["glob:docs/**/*.md"]'
```

When Pages CMS updates its editor, bump the versions in `tools/editor-format/package.json`
and `pnpm-workspace.yaml` to match its `package-lock.json`.

### CI

`build` + `deploy` publish the site even with broken links or images, so an edit in
the browser can't stop the site from updating. `strict-build` and `editor-format`
only report; a red check there is for the maintainer to fix.

## Layout

| Path | What |
|------|------|
| `docs/index.md` | Home page (`slug: /`) |
| `docs/*.md` | One page per file; sidebar order from `sidebar_position`, then file name |
| `static/img/` | Uploaded images, referenced as `/img/<file>` |
| `docusaurus.config.ts` | Site config |
| `.pages.yml` | Pages CMS config |
| `tools/editor-format/` | Formatter that mirrors the Pages CMS editor |

## Conventions (keep the browser editor happy)

- Pages are `.md`, not `.mdx`. `markdown.format: 'detect'` compiles `.md` as plain
  Markdown, so a typed `<` or `{` can't break the build. JSX components (tabs etc.)
  need `.mdx`, and the editor can't edit those safely.
- Every page has a `title:` in front matter and **no** `# H1` in the body.
- Admonitions: `:::tip` / `:::note` / `:::info` / `:::warning` / `:::danger`, with
  an optional title as `:::tip[Title]`.
- No raw HTML (`<details>`, `<!-- -->`, ...): the editor drops the tags on save.
- Keep each list item on one line, no backticks inside inline code, and no ```` ``` ```` lines
  inside a code block; the editor mangles all three.
- `docs/writing-reference.md` shows the syntax that survives the editor (heading IDs,
  footnotes, titled and nested admonitions, code titles/highlighting, Mermaid). Links can
  only target headings: paragraph anchors need HTML, which the editor removes.
- Front matter keys the editor doesn't show (e.g. `slug`) survive saves because
  `.pages.yml` sets `settings.content.merge: true`.
- Pull before editing locally, since coworkers commit to `main` from the browser.

## One-time setup

1. Settings → Pages → Source: **GitHub Actions**.
2. Install the [Pages CMS GitHub App](https://app.pagescms.org) on this repository,
   open the repo in Pages CMS, and invite coworkers under **Collaborators**.
