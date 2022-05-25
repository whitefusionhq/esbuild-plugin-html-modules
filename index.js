const fsLib = require("fs")
const fs = fsLib.promises

module.exports = (options = {}) => ({
  name: "htmlmodules",
  async setup(build) {
    const filter = options.filter || /\.html$/
    // Process .html files as ES modules
    build.onLoad({ filter }, async (args) => {
      const results = await fs.readFile(args.path, "utf8")
      let imported = results.match(/([^]*)<script type="module">([^]*)<\/script>([^]*)/i)
      if (!imported) {
        imported = [null, results, "", ""]
      }

      const wrapper = `
        var import_meta_document = new DocumentFragment()
        const htmlFrag = "<body>" + ${JSON.stringify(imported[1])} + ${JSON.stringify(imported[3])} + "</body>"
        const fragment = new DOMParser().parseFromString(htmlFrag, 'text/html')
        import_meta_document.append(...fragment.body.childNodes)

        ${imported[2].replace(/import[\s]*?\.meta[\s]*?\.document/g, "import_meta_document")}
        export default import_meta_document
      `

      return {
        contents: wrapper,
        loader: "js"
      }
    })
  }
})
