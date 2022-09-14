import HelloWorld, { howdy, yo } from "./hello-world.html" assert { type: "html" }
import Nothing from "./ssr-only.tmpl.html" assert { type: "html" }

window.testing = {
  HelloWorld,
  howdy,
  yo,
  Nothing
}
