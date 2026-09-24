import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// The deploy build only warns so an edit made in the browser can never stop the site from
// updating; CI runs a second build with DOCS_STRICT=1 that reports the same problems as errors.
const severity = process.env.DOCS_STRICT ? 'throw' : 'warn';

const config: Config = {
  title: 'docusaurus-test',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://jabdinghoff.github.io',
  baseUrl: '/docusaurus-test/',
  trailingSlash: false,

  onBrokenLinks: severity,
  onBrokenAnchors: severity,

  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: severity,
      onBrokenMarkdownImages: severity,
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'docusaurus-test',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'powershell'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
