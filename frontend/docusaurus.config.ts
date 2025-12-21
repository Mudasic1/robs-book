import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Physical AI & Humanoid Robotics",
  tagline: "From Digital Brains to Physical Bodies",
  url: "https://your-docusaurus-test-site.com", // Replace with actual URL
  baseUrl: "/physical-ai-textbook/",

  organizationName: "yourusername",
  projectName: "physical-ai-textbook",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ur"], // Support English and Urdu
    localeConfigs: {
      en: {
        label: "English",
        direction: "ltr",
      },
      ur: {
        label: "اردو",
        direction: "rtl",
      },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/yourusername/physical-ai-textbook/tree/main/frontend/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Physical AI",
      logo: {
        alt: "Physical AI Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Textbook",
        },
        {
          type: "custom-userMenu",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Learn",
          items: [
            {
              label: "Textbook",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/yourusername/physical-ai-textbook",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  customFields: {
    // API URL for development vs production
    apiUrl: process.env.REACT_APP_API_URL || "http://localhost:8000",
  },
};

export default config;
