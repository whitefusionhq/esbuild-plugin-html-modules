const fsLib = require("fs")
const fs = fsLib.promises

const { parse } = require("node-html-parser")
const path = require("path")

module.exports = (options = {}) => ({
  name: "htmlmodules",
  async setup(build) {
    const filter = options.filter || /\.html$/
    // Process .html files as ES modules
    build.onLoad({ filter }, async (args) => {
      const results = await fs.readFile(args.path, "utf8")
      const ignoreSSROnly = options.experimental?.ignoreSSROnly || false

      let scripts = []
      let removeNodes = []

      const root = parse(results)

      const scriptTags = root.getElementsByTagName("script")
      scriptTags.forEach((node) => {
        if (
          node.getAttribute("type") === "module" &&
          !(ignoreSSROnly && node.hasAttribute("data-ssr-only"))
        ) {
          scripts.push(node.rawText)
        }
        removeNodes.push(node)
      })

      let globalCSS = ""
      if (options.experimental?.extractGlobalStyles) {
        const globalCallback = (styleTag) => {
          globalCSS += `${styleTag.textContent}\n`
          styleTag.remove()
        }
        root.querySelectorAll("style[scope]").forEach(globalCallback)
        root.querySelectorAll("style[global]").forEach(globalCallback)
      }

      const styleTags = root.getElementsByTagName("style")

      let styleExports = ""
      await Promise.all(
        styleTags.map(async (styleTag) => {
          if (options.experimental?.transformLocalStyles) {
            const transformedCSS = await options.experimental.transformLocalStyles(
              styleTag.textContent,
              { filePath: args.path }
            )
            styleTag.textContent = transformedCSS
            if (options.experimental?.exportLocalStylesExtension) {
              styleExports += transformedCSS
            }
          }
          if (styleTag.hasAttribute("data-ssr-only")) styleTag.remove()
        })
      )
      if (styleExports.length > 0) {
        const basepath = path.join(
          path.dirname(args.path),
          path.basename(args.path, path.extname(args.path))
        )
        await fs.writeFile(
          `${basepath}.${options.experimental.exportLocalStylesExtension}`,
          styleExports
        )
      }

      if (ignoreSSROnly) {
        root.querySelectorAll("[data-ssr-only]").forEach((node) => removeNodes.push(node))
      }
      const scriptContent = scripts.join("")
      removeNodes.forEach((node) => node.remove())

      const htmlFragment = root.toString()

      // strip out comments or the data URLs mess up esbuild
      let wrapper =
        globalCSS.length > 0
          ? `import "data:text/css,${encodeURI(globalCSS.replace(/\/\*[\s\S]*?\*\//g, ""))}"\n`
          : ""

      if (
        options.experimental?.skipBundlingFilter &&
        args.path.match(options.experimental.skipBundlingFilter)
      ) {
        // we'll export nothing
        wrapper += `
          export default new DocumentFragment()
        `
      } else {
        wrapper += `
          var import_meta_document = new DocumentFragment()
        `
        if (htmlFragment.trim().length !== 0) {
          wrapper += `
            const htmlFrag = "<body>" + ${JSON.stringify(htmlFragment)} + "</body>"
            const fragment = new DOMParser().parseFromString(htmlFrag, 'text/html')
            import_meta_document.append(...fragment.body.childNodes)
          `
        }
        wrapper += `
          ${scriptContent.replace(/import[\s]*?\.meta[\s]*?\.document/g, "import_meta_document")}
          export default import_meta_document
        `
      }

      return {
        contents: wrapper,
        loader: "js",
      }
    })
  },
})
