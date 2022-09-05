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

import HelloWorld, { hello } from "src/hello-world.html"

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
    transformStyles: async (css, { filePath }) => {
      const postCssConfig = await postcssrc()
      const postCssProcessor = postcss([...postCssConfig.plugins])

      const results = await postCssProcessor.process(css, { ...postCssConfig.options, from: filePath })
      return results.css
    }
  }
})
```

If you define `extractGlobalStyles: true`, then any `template` tag featuring a `global-style` attribute containing a `style` tag will have those styles extracted out of there and included in esbuild's CSS bundle output.

If you define a `transformStyles` function, then any regular style tag contained within your HTML (and not in a `<template global-style>` tag) will have its contents transformed by the function. Above you can see this done using PostCSS, but you can could another processor such as Sass if you prefer.

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
