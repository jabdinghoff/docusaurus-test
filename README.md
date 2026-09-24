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
`/docusaurus-test/admin/` (`static/admin/`). `components.js` registers an editor component
for each construct used in the docs (admonitions including nested ones, `<details>`,
`<Tabs>`, `import`/`export const` lines, `<kbd>`, `<Link id>` anchors, `{variables}`), so the
editor and preview show them and saves write them back unchanged. Every pattern skips
matches inside code blocks, because Sveltia's preview otherwise substitutes components in
them. `use_markdown_shortcuts: false` works around a Sveltia bug where multi-line components
make the shortcuts delete a single character typed before a space at the start of a
paragraph. Sign in with a GitHub personal access token for now; "Sign In with GitHub" needs
an OAuth app plus a small auth service (e.g. sveltia-cms-auth on Cloudflare Workers) set as
`base_url`. Every editor needs a GitHub account with write access.

## Local workflow

```sh
pnpm install
pnpm start                  # live preview on http://localhost:3000/docusaurus-test/
pnpm start --locale de      # German preview (the dev server runs one locale at a time)
pnpm build                  # what CI deploys (all locales)
DOCS_STRICT=1 pnpm build    # broken links/images as errors
```

### CI

`build` + `deploy` publish the site even with broken links or images, so an edit in
the browser can't stop the site from updating. `strict-build` only reports; a red
check there is for the maintainer to fix.

## Layout

| Path | What |
|------|------|
| `docs/index.md` | Home page (`slug: /`) |
| `docs/*.md` | One page per file; sidebar order from `sidebar_position`, then file name |
| `static/img/` | Uploaded images, referenced as `/img/<file>` |
| `docusaurus.config.ts` | Site config |
| `.pages.yml` | Pages CMS config |
| `static/admin/` | Sveltia CMS trial (admin page, config, callout component) |
| `i18n/de/docusaurus-plugin-content-docs/current/` | German pages, same file names as `docs/` |
| `i18n/de/*.json` | German UI labels (`pnpm write-translations --locale de`) |

## German translation

The site is built in English (`/`) and German (`/de/`), with a language menu in the navbar.
A German page is matched to its English original by **file name**. A page without a German
copy is shown in English, so new pages are created in English first and then copied into
the German folder. Both browser editors therefore only allow editing German pages, not
creating, renaming or deleting them. Heading anchors come from the heading text, so links
in German pages use the German anchors (`#bilder`, not `#images`). Docusaurus doesn't
notice when an English page changes after its translation.

## Conventions (keep the browser editor happy)

- All pages are compiled as MDX (`markdown.format: 'mdx'`), so components (tabs,
  `<details>`, `<kbd>`, variables, custom React components) work in any page. A syntax
  error, such as `{` without `\` or `<` directly before a letter or number, fails the build,
  and the site keeps the last good version until it is fixed.
- Custom heading IDs use `{/* #id */}` (MDX), not `{#id}`. Comments are `{/* ... */}`.
- A paragraph anchor is `<Link id="..." />` (from `@docusaurus/Link`). A plain `<a id>`
  works in the browser but isn't registered, so the broken-anchor check flags links to it.
- Every page has a `title:` in front matter and **no** `# H1` in the body.
- Admonitions: `:::tip` / `:::note` / `:::info` / `:::warning` / `:::danger`, with
  an optional title as `:::tip[Title]`.
- The browser editors may drop HTML/JSX tags on save, so pages with components are best
  edited in a code editor.
- Keep each list item on one line, no backticks inside inline code, and no ```` ``` ```` lines
  inside a code block; the editor mangles all three.
- `docs/writing-reference.md` shows the syntax, with a Components section for the MDX-only
  parts.
- Front matter keys the editor doesn't show (e.g. `slug`) survive saves because
  `.pages.yml` sets `settings.content.merge: true`.
- Pull before editing locally, since coworkers commit to `main` from the browser.

## One-time setup

1. Settings → Pages → Source: **GitHub Actions**.
2. Install the [Pages CMS GitHub App](https://app.pagescms.org) on this repository,
   open the repo in Pages CMS, and invite coworkers under **Collaborators**.
