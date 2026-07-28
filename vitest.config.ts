import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(
        new URL(".", import.meta.url)
      ),
    },
  },

  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: [
        "lib/dates.ts",
        "lib/item-images.ts",
        "lib/items/serializers.ts",
        "validations/item.ts",
      ],
    },
  },
});
