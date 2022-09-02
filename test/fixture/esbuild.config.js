const esbuild = require('esbuild')
const htmlModulesPlugin = require('../../index.js')

const postcssrc = require("postcss-load-config")
const postcss = require("postcss")

/**
 * @typedef { import("esbuild").BuildOptions } BuildOptions
 * @type {BuildOptions}
 */
esbuild.build({
  bundle: true,
  entryPoints: ['test/fixture/main.js'],
  outfile: 'test/fixture/out.js',
  plugins: [
    htmlModulesPlugin({
      transformStyles: async (css, { filePath }) => {
        const postCssConfig = await postcssrc()
        const postCssProcessor = postcss([...postCssConfig.plugins])

        const results = await postCssProcessor.process(css, { ...postCssConfig.options, from: filePath })
        return results.css
      }
    })
  ]
}).catch(() => process.exit(1))
