import { Controller } from "@hotwired/stimulus"
import { useClickOutside } from "stimulus-use"
import { useHotkeys } from "stimulus-use/hotkeys"

export default class extends Controller {
  static targets = ["panel"]
  static values = {
    clearPanel: {type: Boolean, default: false},
  }

  connect() {
    useClickOutside(this, {
      dispatchEvent: false,
      onlyVisible: false,
    })
    useHotkeys(this, {
      esc: [this.clickOutside],
    })
  }

  clickOutside() {
    this.panelTarget.setAttribute("hidden", "true")

    if (this.clearPanelValue) this.panelTarget.innerHTML = ""
  }

  togglePrintlistPanel(e) {
    const panel = this.panelTarget
    const panelDisplayState = panel.getAttribute("hidden")

    if (panelDisplayState) {
      panel.removeAttribute("hidden")
    } else {
      panel.setAttribute("hidden", "true")
      e.preventDefault()
    }
  }
}
