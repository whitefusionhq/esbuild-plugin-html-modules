import HelloWorld, { howdy, yo } from "./hello-world.html" with { type: "html" }
import Nothing, { clientSide } from "./ssr-only.html" with { type: "html" }

window.testing = {
  HelloWorld,
  howdy,
  yo,
  Nothing,
  clientSide
}
