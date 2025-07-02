import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.{test,spec}.{ts,js,mjs,cjs}"],
    exclude: ["node_modules", "dist", "build"],
  },
});
