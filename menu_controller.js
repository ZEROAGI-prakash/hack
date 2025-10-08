import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay", "panel"]

  toggle() {
    const anyPanelIsOpen = this.panelTargets.some(panel => panel.open)

    if (anyPanelIsOpen) {
      this.element.classList.add("is-open")
      this.overlayTarget.classList.remove("is-hidden")
    } else {
      this.element.classList.remove("is-open")
      this.overlayTarget.classList.add("is-hidden")
    }
  }

  close() {
    this.panelTargets.forEach(panel => panel.open = false)
    this.toggle()
  }
}
