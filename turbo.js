import { Turbo } from "@hotwired/turbo-rails"

// Custom actions

Turbo.StreamActions.redirect = function () {
  Turbo.visit(this.target)
}

Turbo.StreamActions.close_overlay = function () {
  const event = new CustomEvent("overlay:close")
  document.dispatchEvent(event)
}

// Fast load
//
// Dispatch a turbo:fast-load event when the DOM is ready and on all turbo:load
// events except the first one.

const dispatchFastLoad = () => {
  document.dispatchEvent(new Event("turbo:fast-load"))
}

document.addEventListener("DOMContentLoaded", dispatchFastLoad)

document.addEventListener("turbo:load", () => {
  document.addEventListener("turbo:load", dispatchFastLoad)
}, {once: true})
