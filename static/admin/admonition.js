const ADMONITION_STYLES = {
  note: ["#e8eaed", "#474748"],
  tip: ["#e6f6e6", "#009400"],
  info: ["#eef9fd", "#4cb3d4"],
  warning: ["#fff8e6", "#e6a700"],
  danger: ["#ffebec", "#e13238"],
};

CMS.registerEditorComponent({
  id: "admonition",
  label: "Callout box",
  icon: "lightbulb",
  fields: [
    {
      name: "type",
      label: "Type",
      widget: "select",
      options: ["note", "tip", "info", "warning", "danger"],
      default: "note",
    },
    { name: "title", label: "Title (optional)", widget: "string", required: false },
    { name: "body", label: "Text", widget: "text" },
  ],
  pattern: /^:::(?<type>note|tip|info|warning|danger)(?:\[(?<title>[^\]\n]*)\])?[ \t]*\n(?<body>[\s\S]*?)\n:::[ \t]*$/m,
  fromBlock: ({ groups: { type, title, body } = {} }) => ({
    type,
    title: title ?? "",
    body: (body ?? "").trim(),
  }),
  toBlock: ({ type = "note", title = "", body = "" }) =>
    `:::${type}${title ? `[${title}]` : ""}\n\n${body.trim()}\n\n:::`,
  toPreview: ({ type = "note", title = "", body = "" }) => {
    const [background, border] = ADMONITION_STYLES[type] ?? ADMONITION_STYLES.note;
    const heading = (title || type).toUpperCase();
    const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<div style="background:${background};border-left:5px solid ${border};border-radius:6px;padding:12px 16px;margin:8px 0">
      <strong style="font-size:0.85em">${escape(heading)}</strong>
      <div style="white-space:pre-wrap;margin-top:4px">${escape(body)}</div>
    </div>`;
  },
});
