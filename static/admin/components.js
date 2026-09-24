// Sveltia CMS editor components for the Docusaurus/MDX syntax used in these docs, so the rich
// text editor shows each construct as a block and writes it back unchanged.

// Sveltia's preview substitutes components across the whole Markdown, code blocks included, so
// every pattern first checks that the ``` fences before it come in open/close pairs.
const LINE_START = String.raw`(?<![^\n])`;
const FENCE = `${LINE_START}\`{3,}`;
const NOT_FENCE = `(?:(?!${FENCE})[^])`;
const OUTSIDE_CODE = `(?<=(?<![^])(?:${NOT_FENCE}*${FENCE}[^\\n]*\\n${NOT_FENCE}*${FENCE}[ \\t]*(?:\\n|(?![^])))*${NOT_FENCE}*)`;
// Block patterns keep the `m` flag, which is also what makes Sveltia treat them as blocks.
const block = (pattern) => new RegExp(OUTSIDE_CODE + pattern.source, "m");
const inline = (pattern) => new RegExp(OUTSIDE_CODE + pattern.source);

const escape = (text = "") =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const chip = (text, color = "#5c6bc0") =>
  `<span style="display:inline-block;border:1px solid ${color};color:${color};border-radius:4px;padding:0 5px;font-size:0.85em;font-family:monospace">${escape(text)}</span>`;

const ADMONITION_STYLES = {
  note: ["#e8eaed", "#474748"],
  tip: ["#e6f6e6", "#009400"],
  info: ["#eef9fd", "#4cb3d4"],
  warning: ["#fff8e6", "#e6a700"],
  danger: ["#ffebec", "#e13238"],
};

// A box containing another box needs one colon more than the box inside it.
CMS.registerEditorComponent({
  id: "admonition",
  label: "Callout box",
  icon: "lightbulb",
  fields: [
    { name: "type", label: "Type", widget: "select", options: Object.keys(ADMONITION_STYLES), default: "note" },
    { name: "title", label: "Title (optional)", widget: "string", required: false },
    { name: "body", label: "Text", widget: "text" },
  ],
  pattern: block(
    /^(?<fence>:{3,})(?<type>note|tip|info|warning|danger)(?:\[(?<title>[^\]\n]*)\])?[ \t]*\n(?<body>[\s\S]*?)\n\k<fence>[ \t]*$/,
  ),
  fromBlock: ({ groups: { type, title, body } = {} }) => ({ type, title: title ?? "", body: (body ?? "").trim() }),
  toBlock: ({ type = "note", title = "", body = "" }) => {
    const innerFences = [...body.matchAll(/^(:{3,})/gm)].map(([, colons]) => colons.length);
    const fence = ":".repeat(Math.max(3, ...innerFences.map((n) => n + 1)));
    return `${fence}${type}${title ? `[${title}]` : ""}\n\n${body.trim()}\n\n${fence}`;
  },
  // The body is passed through unescaped so Sveltia's next preview pass can render a nested box.
  toPreview: ({ type = "note", title = "", body = "" }) => {
    const [background, border] = ADMONITION_STYLES[type] ?? ADMONITION_STYLES.note;
    return (
      `<div style="background:${background};border-left:5px solid ${border};border-radius:6px;padding:12px 16px;margin:8px 0">` +
      `<strong style="font-size:0.85em">${escape((title || type).toUpperCase())}</strong>` +
      `<div style="white-space:pre-wrap;margin-top:4px">${body.trim()}\n</div></div>`
    );
  },
});

CMS.registerEditorComponent({
  id: "details",
  label: "Collapsible section",
  icon: "expand_circle_down",
  fields: [
    { name: "summary", label: "Title", widget: "string" },
    { name: "body", label: "Text", widget: "text" },
  ],
  pattern: block(/^<details>\n[ \t]*<summary>(?<summary>[^\n]*?)<\/summary>\n(?<body>[\s\S]*?)\n<\/details>[ \t]*$/),
  fromBlock: ({ groups: { summary, body = "" } = {} }) => ({
    summary,
    body: body.replace(/^\n+/, "").replace(/^ {2}/gm, "").trimEnd(),
  }),
  toBlock: ({ summary = "", body = "" }) =>
    `<details>\n  <summary>${summary}</summary>\n\n${body.trimEnd().replace(/^(?=.)/gm, "  ")}\n</details>`,
  toPreview: ({ summary = "", body = "" }) =>
    `<details open style="border:1px solid #ccc;border-radius:6px;padding:8px 12px;margin:8px 0"><summary><strong>${escape(summary)}</strong></summary><div style="white-space:pre-wrap;margin-top:6px">${escape(body)}</div></details>`,
});

CMS.registerEditorComponent({
  id: "tabs",
  label: "Tabs",
  icon: "tab",
  fields: [{ name: "items", label: "Tabs (one TabItem per line)", widget: "text" }],
  pattern: block(/^<Tabs>\n(?<items>[\s\S]*?)\n<\/Tabs>[ \t]*$/),
  fromBlock: ({ groups: { items = "" } = {} }) => ({ items }),
  toBlock: ({ items = "" }) => `<Tabs>\n${items}\n</Tabs>`,
  toPreview: ({ items = "" }) =>
    `<div style="border:1px solid #ccc;border-radius:6px;margin:8px 0">${[
      ...items.matchAll(/<TabItem[^>]*label="([^"]*)"[^>]*>([\s\S]*?)<\/TabItem>/g),
    ]
      .map(([, label, body]) => `<div style="padding:6px 12px;border-bottom:1px solid #eee"><strong>${escape(label)}</strong><div>${escape(body.trim())}</div></div>`)
      .join("")}</div>`,
});

CMS.registerEditorComponent({
  id: "mdx-import",
  label: "MDX import",
  icon: "input",
  fields: [
    { name: "what", label: "Import", widget: "string" },
    { name: "from", label: "From", widget: "string" },
  ],
  pattern: block(/^import (?<what>[^\n]+?) from '(?<from>[^'\n]+)';[ \t]*$/),
  fromBlock: ({ groups: { what, from } = {} }) => ({ what, from }),
  toBlock: ({ what = "", from = "" }) => `import ${what} from '${from}';`,
  toPreview: ({ what = "", from = "" }) => `<div>${chip(`import ${what} from '${from}'`, "#8d6e63")}</div>`,
});

CMS.registerEditorComponent({
  id: "mdx-export",
  label: "Page variable",
  icon: "data_object",
  fields: [
    { name: "name", label: "Name", widget: "string" },
    { name: "value", label: "Value (JavaScript, e.g. 'Acme Monitor')", widget: "string" },
  ],
  pattern: block(/^export const (?<name>[A-Za-z_]\w*) = (?<value>[^\n]+);[ \t]*$/),
  fromBlock: ({ groups: { name, value } = {} }) => ({ name, value }),
  toBlock: ({ name = "", value = "" }) => `export const ${name} = ${value};`,
  toPreview: ({ name = "", value = "" }) => `<div>${chip(`${name} = ${value}`, "#2e7d32")}</div>`,
});

CMS.registerEditorComponent({
  id: "kbd",
  label: "Keyboard key",
  icon: "keyboard",
  fields: [{ name: "key", label: "Key", widget: "string" }],
  pattern: inline(/<kbd>(?<key>[^<\n]+)<\/kbd>/),
  fromBlock: ({ groups: { key } = {} }) => ({ key }),
  toBlock: ({ key = "" }) => `<kbd>${key}</kbd>`,
  toPreview: ({ key = "" }) =>
    `<kbd style="border:1px solid #bbb;border-bottom-width:2px;border-radius:3px;padding:0 4px;font-size:0.85em">${escape(key)}</kbd>`,
});

CMS.registerEditorComponent({
  id: "anchor",
  label: "Link target",
  icon: "bookmark",
  fields: [{ name: "id", label: "ID", widget: "string" }],
  pattern: inline(/<Link id="(?<id>[^"\n]+)" \/>/),
  fromBlock: ({ groups: { id } = {} }) => ({ id }),
  toBlock: ({ id = "" }) => `<Link id="${id}" />`,
  toPreview: ({ id = "" }) => chip(`🔖 ${id}`, "#8d6e63"),
});

CMS.registerEditorComponent({
  id: "variable",
  label: "Variable",
  icon: "badge",
  fields: [{ name: "name", label: "Variable", widget: "string" }],
  pattern: inline(/\{(?<name>[A-Za-z_]\w*)\}/),
  fromBlock: ({ groups: { name } = {} }) => ({ name }),
  toBlock: ({ name = "" }) => `{${name}}`,
  toPreview: ({ name = "" }) => chip(`{${name}}`, "#2e7d32"),
});
