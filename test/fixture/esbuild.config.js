const esbuild = require('esbuild')
const htmlModulesPlugin = require('../../index.js')

/**
 * @typedef { import("esbuild").BuildOptions } BuildOptions
 * @type {BuildOptions}
 */
esbuild.build({
  bundle: true,
  entryPoints: ['test/fixture/main.js'],
  outfile: 'test/fixture/out.js',
  plugins: [
    htmlModulesPlugin()
  ]
}).catch(() => process.exit(1))