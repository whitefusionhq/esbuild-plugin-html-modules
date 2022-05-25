# esbuild-plugin-html-modules

An esbuild plugin to load HTML Modules. [This is a proposed spec](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/html-modules-explainer.md) defined here by [@dandclark](https://github.com/dandclark) which would allow HTML files to be exported and importable as ES modules where the HTML itself is transformed into an exported HTML template and a `<script type="module">` tag is run as the JavaScript of the module. The template is available from inside the module script code via `import.meta.document`.

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
  entryPoints: ['example/main.js'],
  outfile: 'example/out.js',
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

Now you'll be able to import HTML modules. Take a peek at the [files in the `example` folder] for an example of how this could work.

## Contributing

1. Fork it (https://github.com/whitefusionhq/esbuild-plugin-html-modules/fork)
2. Clone the fork using `git clone` to your local development machine.
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new Pull Request
