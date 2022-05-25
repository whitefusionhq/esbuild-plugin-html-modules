# esbuild-plugin-html-modules

An esbuild plugin to load HTML Modules. This is a proposed spec defined here by [@dandclark](https://github.com/dandclark) which would allow HTML files to be exported and importable as ES modules where the HTML itself is transformed into an exported HTML template and a `<script type="module">` tag is run as the JavaScript of the module. The template is available from inside the module script code via `import.meta.document`.
