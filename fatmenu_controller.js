import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["primaryNav"]
  static outlets = ["drop-panel"]

  connect() {
    this.dropPanelOutlet.element.classList.add("fatmenu-drop--enhanced")
  }

  dropPanelOutletConnected() {
    this.updateContentPanelPosition()
  }

  updateContentPanelPosition() {
    const outlet = this.dropPanelOutlet
    const primaryNavClientRect = this.primaryNavTarget.getBoundingClientRect()
    const topOffset = primaryNavClientRect.height
    const leftOffset = primaryNavClientRect.x
    const style = outlet.contentPanelTarget.style

    style.top = `${Math.round(topOffset)}px`
    style.left = `-${Math.round(leftOffset)}px`
  }
}
