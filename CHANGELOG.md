# Changelog

All notable changes to this project will be documented in this file.

## Upcoming

## [0.8.0](https://github.com/whitefusionhq/esbuild-plugin-html-modules/compare/v0.7.2...v0.8.0) - 2024-10-27

- Remove the `extractScopedStyles: true` option and dependency on `enhance-style-transform`.
- Add support for `<style global>` syntax in `extractGlobalStyles`

## [0.7.2](https://github.com/whitefusionhq/esbuild-plugin-html-modules/compare/v0.7.0...v0.7.1) - 2024-03-06

- Fix bug where the `ignoreSSROnly` option wasn't including client-side scripts when the HTML was totally blank

## [0.7.1](https://github.com/whitefusionhq/esbuild-plugin-html-modules/compare/v0.7.0...v0.7.1) - 2023-10-08

- Strip out CSS comments (they cause data URL bundling issues in esbuild)

## [0.7.0](https://github.com/whitefusionhq/esbuild-plugin-html-modules/compare/v0.6.0...v0.7.0) - 2023-03-28

- Deprecate the `skipBundlingFilter` option in favor of filtering out all tags with a `data-ssr-only` attribute in the module template when the `ignoreSSROnly` experimental option is set to true