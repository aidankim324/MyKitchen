import { describe, expect, it } from "vitest";
import { getSuggestedItemImage } from "@/lib/item-images";

describe("getSuggestedItemImage", () => {
  it("matches a basic item name", () => {
    expect(getSuggestedItemImage("Milk")).toEqual({
      src: "/item-images/milk.svg",
      matchedName: "milk",
    });
  });

  it("matches an item name containing descriptive words", () => {
    expect(
      getSuggestedItemImage("Organic Whole Milk")
    ).toEqual({
      src: "/item-images/milk.svg",
      matchedName: "milk",
    });
  });

  it("matches plural item names", () => {
    expect(getSuggestedItemImage("Large Brown Eggs")).toEqual({
      src: "/item-images/eggs.svg",
      matchedName: "eggs",
    });
  });

  it("matches a more specific food description", () => {
    expect(
      getSuggestedItemImage("Boneless Chicken Thighs")
    ).toEqual({
      src: "/item-images/chicken.svg",
      matchedName: "chicken",
    });
  });

  it("does not treat a partial word as a match", () => {
    expect(getSuggestedItemImage("Milkshake")).toBeNull();
  });

  it("returns null when no suggestion exists", () => {
    expect(
      getSuggestedItemImage("Chocolate Cake")
    ).toBeNull();
  });

  it("returns null for an empty item name", () => {
    expect(getSuggestedItemImage("   ")).toBeNull();
  });
});
