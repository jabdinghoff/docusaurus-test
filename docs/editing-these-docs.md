---
title: Editing these docs
sidebar_position: 2
---
You don't need to install anything. The docs are edited in the browser with
[Pages CMS](https://app.pagescms.org), and the website updates by itself a
minute or two after you save.

## Getting access

Ask the docs maintainer to invite you. You'll get an email from Pages CMS;
click the link in it to sign in. No GitHub account is needed.

## Editing a page

1. Open [app.pagescms.org](https://app.pagescms.org) and choose this project.
2. Click **Pages** in the sidebar and pick the page you want to change.
3. Edit the text like in a word processor. Type `/` on an empty line for headings, lists, tables and images.
4. Save. That's it — the website rebuilds automatically.

To add a page, use the add button in the **Pages** list and give it a title.
New pages show up in the website's menu automatically. **Position in menu**
controls the order: lower numbers come first.

## Linking to another page

Select the text, click the link button in the small toolbar that appears,
and enter the other page's file name, e.g. `editing-these-docs.md`. Pages CMS
names files after the title: "My New Page" becomes `my-new-page.md`. To jump
to a section, add the heading in lower case with dashes, e.g.
`editing-these-docs.md#getting-access`.

## Images

Use `/` → **Image** in the editor, or upload files under **Images** in the
sidebar first and pick them from there.

![](/img/logo.svg)

## Things to avoid

- Don't write a big "Heading 1" at the top of a page; the **Title** field already becomes the page heading. Start with "Heading 2" and smaller.
- Some pages contain lines like `:::note` or `:::`. Those are special instructions for the website — leave them untouched and only edit the text between them.
- The editor removes HTML comments (`<!-- ... -->`) when it saves.

:::tip

Want a coloured box like this one? Write `:::tip` on its own line, your text
below it, and `:::` on the line after. `note`, `info`, `warning` and `danger`
work too.

:::