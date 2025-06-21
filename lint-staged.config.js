/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*": "biome check --no-errors-on-unmatched --files-ignore-unknown=true --write",
};

export default config;
