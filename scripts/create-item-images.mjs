import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const images = [
  {
    slug: "milk",
    label: "Milk",
    emoji: "\u{1F95B}",
  },
  {
    slug: "eggs",
    label: "Eggs",
    emoji: "\u{1F95A}",
  },
  {
    slug: "bread",
    label: "Bread",
    emoji: "\u{1F35E}",
  },
  {
    slug: "rice",
    label: "Rice",
    emoji: "\u{1F35A}",
  },
  {
    slug: "chicken",
    label: "Chicken",
    emoji: "\u{1F357}",
  },
  {
    slug: "cheese",
    label: "Cheese",
    emoji: "\u{1F9C0}",
  },
  {
    slug: "yogurt",
    label: "Yogurt",
    emoji: "\u{1F963}",
  },
  {
    slug: "apple",
    label: "Apple",
    emoji: "\u{1F34E}",
  },
  {
    slug: "banana",
    label: "Banana",
    emoji: "\u{1F34C}",
  },
  {
    slug: "lettuce",
    label: "Lettuce",
    emoji: "\u{1F96C}",
  },
  {
    slug: "tomato",
    label: "Tomato",
    emoji: "\u{1F345}",
  },
  {
    slug: "orange",
    label: "Orange",
    emoji: "\u{1F34A}",
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
  width="160"
  height="160"
  viewBox="0 0 160 160"
  role="img"
  aria-labelledby="title"
>
  <title id="title">${escapeXml(image.label)}</title>

  <text
    x="80"
    y="108"
    text-anchor="middle"
    font-size="108"
    font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif"
  >${image.emoji}</text>
</svg>
`;
}

const outputDirectory = path.join(
  process.cwd(),
  "public",
  "item-images"
);

await mkdir(outputDirectory, {
  recursive: true,
});

await Promise.all(
  images.map((image) =>
    writeFile(
      path.join(
        outputDirectory,
        `${image.slug}.svg`
      ),
      createSvg(image),
      "utf8"
    )
  )
);

console.log(
  `Created ${images.length} item images.`
);
