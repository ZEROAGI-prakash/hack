import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

// Import Stimulus libraries
import ScrollReveal from "stimulus-scroll-reveal"
application.register("scroll-reveal", ScrollReveal)

export { application }
