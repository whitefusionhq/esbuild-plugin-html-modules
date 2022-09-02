const fsLib = require("fs")
const fs = fsLib.promises

const { parse } = require("node-html-parser")

module.exports = (options = {}) => ({
  name: "htmlmodules",
  async setup(build) {
    const filter = options.filter || /\.html$/
    // Process .html files as ES modules
    build.onLoad({ filter }, async (args) => {
      const results = await fs.readFile(args.path, "utf8")

      let scripts = []
      let removeNodes = []

      const root = parse(results)

      const scriptTags = root.getElementsByTagName("script")
      scriptTags.forEach(node => {
        if (node.getAttribute("type") === "module") {
          scripts.push(node.rawText)
        }
        removeNodes.push(node)
      })

      const styleTags = root.getElementsByTagName("style")

      await Promise.all(
        styleTags.map(async (styleTag) => {
          if (options.transformStyles) {
            const transformedCSS = await options.transformStyles(styleTag.textContent, { filePath: args.path })
            styleTag.textContent = transformedCSS
          }
        })
      )

      const scriptContent = scripts.join("")
      removeNodes.forEach(node => node.remove())

      const htmlFragment = root.toString()

      const wrapper = `
        var import_meta_document = new DocumentFragment()
        const htmlFrag = "<body>" + ${JSON.stringify(htmlFragment)} + "</body>"
        const fragment = new DOMParser().parseFromString(htmlFrag, 'text/html')
        import_meta_document.append(...fragment.body.childNodes)

        ${scriptContent.replace(/import[\s]*?\.meta[\s]*?\.document/g, "import_meta_document")}
        export default import_meta_document
      `

      return {
        contents: wrapper,
        loader: "js"
      }
    })
  }
})
