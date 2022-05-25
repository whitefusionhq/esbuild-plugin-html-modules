const esbuild = require('esbuild')
const htmlModulesPlugin = require('../index')

esbuild.build({
  bundle: true,
  entryPoints: ['example/main.js'],
  outfile: 'example/out.js',
  plugins: [
    htmlModulesPlugin()
  ]
}).catch(() => process.exit(1))