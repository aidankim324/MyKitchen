export type SuggestedItemImage = {
  src: string;
  matchedName: string;
};

type SuggestedImageRule = {
  phrases: string[];
  image: SuggestedItemImage;
};

const SUGGESTED_IMAGE_RULES: SuggestedImageRule[] = [
  {
    phrases: [
      "milk",
      "whole milk",
      "skim milk",
      "oat milk",
      "almond milk",
      "soy milk",
    ],
    image: {
      src: "/item-images/milk.svg",
      matchedName: "milk",
    },
  },
  {
    phrases: ["egg", "eggs", "egg whites"],
    image: {
      src: "/item-images/eggs.svg",
      matchedName: "eggs",
    },
  },
  {
    phrases: [
      "bread",
      "sourdough",
      "baguette",
      "white bread",
      "wheat bread",
    ],
    image: {
      src: "/item-images/bread.svg",
      matchedName: "bread",
    },
  },
  {
    phrases: [
      "rice",
      "white rice",
      "brown rice",
      "jasmine rice",
      "basmati rice",
    ],
    image: {
      src: "/item-images/rice.svg",
      matchedName: "rice",
    },
  },
  {
    phrases: [
      "chicken",
      "chicken breast",
      "chicken breasts",
      "chicken thigh",
      "chicken thighs",
      "drumstick",
      "drumsticks",
    ],
    image: {
      src: "/item-images/chicken.svg",
      matchedName: "chicken",
    },
  },
  {
    phrases: [
      "cheese",
      "cheddar",
      "mozzarella",
      "parmesan",
      "swiss cheese",
    ],
    image: {
      src: "/item-images/cheese.svg",
      matchedName: "cheese",
    },
  },
  {
    phrases: [
      "yogurt",
      "greek yogurt",
      "vanilla yogurt",
    ],
    image: {
      src: "/item-images/yogurt.svg",
      matchedName: "yogurt",
    },
  },
  {
    phrases: ["apple", "apples"],
    image: {
      src: "/item-images/apple.svg",
      matchedName: "apple",
    },
  },
  {
    phrases: ["banana", "bananas"],
    image: {
      src: "/item-images/banana.svg",
      matchedName: "banana",
    },
  },
  {
    phrases: [
      "lettuce",
      "romaine",
      "romaine lettuce",
      "iceberg lettuce",
    ],
    image: {
      src: "/item-images/lettuce.svg",
      matchedName: "lettuce",
    },
  },
  {
    phrases: ["tomato", "tomatoes", "cherry tomatoes"],
    image: {
      src: "/item-images/tomato.svg",
      matchedName: "tomato",
    },
  },
  {
    phrases: ["orange", "oranges", "mandarin", "mandarins"],
    image: {
      src: "/item-images/orange.svg",
      matchedName: "orange",
    },
  },
];

function normalizeItemName(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function containsPhrase(
  normalizedName: string,
  phrase: string
) {
  const normalizedPhrase = normalizeItemName(phrase);

  return ` ${normalizedName} `.includes(
    ` ${normalizedPhrase} `
  );
}

export function getSuggestedItemImage(
  itemName: string
): SuggestedItemImage | null {
  const normalizedName = normalizeItemName(itemName);

  if (!normalizedName) {
    return null;
  }

  for (const rule of SUGGESTED_IMAGE_RULES) {
    const matches = rule.phrases.some((phrase) =>
      containsPhrase(normalizedName, phrase)
    );

    if (matches) {
      return rule.image;
    }
  }

  return null;
}
