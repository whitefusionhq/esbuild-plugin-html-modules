# esbuild-plugin-html-modules

[![npm][npm]][npm-url]
[![CI Test](https://github.com/whitefusionhq/esbuild-plugin-html-modules/actions/workflows/ci.yml/badge.svg)](https://github.com/whitefusionhq/esbuild-plugin-html-modules/actions/workflows/ci.yml)


An esbuild plugin to load HTML Modules. [This is a proposed spec](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/html-modules-explainer.md) defined here by [@dandclark](https://github.com/dandclark) which would allow HTML files to be exported and importable as ES modules where the HTML itself is transformed into an exported HTML template and a `<script type="module">` tag is run as the JavaScript of the module. The template is available from inside the module script code via `import.meta.document`, and externally as the default ES export of the file.

An HTML module could look like this:

```html
<script type="module">
  export const hello = () => {
    return import.meta.document.querySelector("h1")
  }
</script>

<h1>Hello World</h1>

<p>Everything here is included in the default document export.</p>
```

And you could import it like this:

```js
// in some JS file:

import HelloWorld, { hello } from "src/hello-world.html" with { type: "html" }

console.log(hello())

console.log(HelloWorld.querySelector("p"))
```

## Install

```sh
npm install esbuild-plugin-html-modules -D
```

```sh
yarn add esbuild-plugin-html-modules -D
```

## Usage

Add the plugin to your esbuild config file. For example:

```js
const esbuild = require('esbuild')
const htmlModulesPlugin = require('esbuild-plugin-html-modules')

esbuild.build({
  bundle: true,
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  plugins: [
    htmlModulesPlugin()
  ]
}).catch(() => process.exit(1))
```

You can also pass a specific filter in if you wish to support only specific extensions, like `.module.html` or `.mod.html`, in your project:

```js
  plugins: [
    htmlModulesPlugin({ filter: /\.mod\.html$/ })
  ]
```

Now you'll be able to import HTML modules. Take a peek at the [files in the `test/fixture` folder](https://github.com/whitefusionhq/esbuild-plugin-html-modules/tree/main/test/fixture) for an example of how this could work.

Other configuration options are contained within the `experimental` section because they go beyond the proposed spec to offer some helpful features. Here's an example:

```js
const postcssrc = require("postcss-load-config")
const postcss = require("postcss")


// later in the esbuild config:

htmlModulesPlugin({
  experimental: {
    extractGlobalStyles: true,
    exportLocalStylesExtension: "css-local",
    ignoreSSROnly: true,
    transformLocalStyles: async (css, { filePath }) => {
      const postCssConfig = await postcssrc()
      const postCssProcessor = postcss([...postCssConfig.plugins])

      const results = await postCssProcessor.process(css, { ...postCssConfig.options, from: filePath })
      return results.css
    }
  }
})
```

## Transforming Styles

> [!WARNING]
> The `extractScopedStyles: true` experimental option was removed in v0.8. We recommend you use the newer `@scope` standard in a global stylesheet if you want to author "scoped" light DOM styles. 

If you define `extractGlobalStyles: true`, then any `style` tag featuring a `scope="global"` attribute or a `global` boolean attribute will have those styles extracted out of there and included in esbuild's CSS bundle output.

If you define a `transformLocalStyles` function, then any local style tag contained within your HTML (not explicitly scoped) will have its contents transformed by the function. Above you can see this done using PostCSS, but you could use another processor such as Sass if you prefer. This is useful for style tags which get included in shadow DOM templates (and you wouldn't want to include those styles in the CSS bundle).

## Bundling Lifecycle

As part of transforming local styles, you can optionally export those transformed styles into "sidecar" CSS output file. This can be helpful if you would like another process to use those styles in SSR. By setting the `exportLocalStylesExtension` option, a file with the provided extension will be saved right alongside the HTML module. **Note:** it's highly recommended you add that extension to your `.gitignore` file as they're purely build-time automated.

For controlling the bundling characteristics of "split" components where some (or all!) functionality is server-only, you can set the `ignoreSSROnly` option to `true`. This will then filter out (aka remove) any elements in the module with a `data-ssr-only` attribute present. For example, you could have a `template` tag, `script` tag, and `style` tag which _all_ feature `data-ssr-only`, and therefore the bundled module would export a blank fragment. This technique can work well for "resumable" components which don't require access to the full module template at client-side runtime.

**Note:** this does _not_ skip the styles processing. Any local style tags will still be transformed if those options have been set, and any scoped or global styles will be extracted if those options have been set.

## Testing

Run:

```sh
npm run test
```

## Contributing

1. Fork it (https://github.com/whitefusionhq/esbuild-plugin-html-modules/fork)
2. Clone the fork using `git clone` to your local development machine.
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new Pull Request

[npm]: https://img.shields.io/npm/v/esbuild-plugin-html-modules.svg
[npm-url]: https://npmjs.com/package/esbuild-plugin-html-modules
