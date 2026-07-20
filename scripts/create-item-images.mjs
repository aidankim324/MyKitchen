import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const images = [
  {
    slug: "milk",
    label: "Milk",
    emoji: "🥛",
    background: "#EAF4FF",
    accent: "#BFDFFF",
  },
  {
    slug: "eggs",
    label: "Eggs",
    emoji: "🥚",
    background: "#FFF8E7",
    accent: "#F5DFA8",
  },
  {
    slug: "bread",
    label: "Bread",
    emoji: "🍞",
    background: "#FFF0DB",
    accent: "#EBCB9E",
  },
  {
    slug: "rice",
    label: "Rice",
    emoji: "🍚",
    background: "#F4F4F0",
    accent: "#D9D9CF",
  },
  {
    slug: "chicken",
    label: "Chicken",
    emoji: "🍗",
    background: "#FFF0E8",
    accent: "#EDC6B2",
  },
  {
    slug: "cheese",
    label: "Cheese",
    emoji: "🧀",
    background: "#FFF8D8",
    accent: "#F4DD79",
  },
  {
    slug: "yogurt",
    label: "Yogurt",
    emoji: "🥣",
    background: "#F7EEFF",
    accent: "#DCC4F0",
  },
  {
    slug: "apple",
    label: "Apples",
    emoji: "🍎",
    background: "#FCEBEC",
    accent: "#EDB8BB",
  },
  {
    slug: "banana",
    label: "Bananas",
    emoji: "🍌",
    background: "#FFF9D9",
    accent: "#F3E27A",
  },
  {
    slug: "lettuce",
    label: "Lettuce",
    emoji: "🥬",
    background: "#EAF7EB",
    accent: "#B9DFBC",
  },
  {
    slug: "tomato",
    label: "Tomatoes",
    emoji: "🍅",
    background: "#FDEBEC",
    accent: "#EFB8BA",
  },
  {
    slug: "orange",
    label: "Oranges",
    emoji: "🍊",
    background: "#FFF0DD",
    accent: "#F5CF9C",
  },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createSvg(image) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="800"
  height="600"
  viewBox="0 0 800 600"
  role="img"
  aria-labelledby="title"
>
  <title id="title">${escapeXml(image.label)}</title>

  <rect width="800" height="600" fill="${image.background}" />

  <circle
    cx="650"
    cy="105"
    r="170"
    fill="${image.accent}"
    opacity="0.55"
  />

  <circle
    cx="100"
    cy="540"
    r="210"
    fill="${image.accent}"
    opacity="0.38"
  />

  <rect
    x="215"
    y="95"
    width="370"
    height="345"
    rx="70"
    fill="#FFFFFF"
    opacity="0.72"
  />

  <text
    x="400"
    y="335"
    text-anchor="middle"
    font-size="190"
    font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif"
  >${image.emoji}</text>

  <text
    x="400"
    y="515"
    text-anchor="middle"
    font-size="48"
    font-weight="700"
    fill="#27272A"
    font-family="Arial, sans-serif"
  >${escapeXml(image.label)}</text>
</svg>
`;
}

const outputDirectory = path.join(
  process.cwd(),
  "public",
  "item-images"
);

await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  images.map((image) =>
    writeFile(
      path.join(outputDirectory, `${image.slug}.svg`),
      createSvg(image),
      "utf8"
    )
  )
);

console.log(`Created ${images.length} item images.`);
