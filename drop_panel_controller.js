import { Controller } from "@hotwired/stimulus"
import { useClickOutside } from "stimulus-use"
import { useHotkeys } from "stimulus-use/hotkeys"

export default class extends Controller {
  // This target is currently only used when DropPanelController is used as an
  // outlet. See also FatmenuController.
  static targets = ["contentPanel"]

  connect() {
    useClickOutside(this, {
      dispatchEvent: false,
      onlyVisible: false,
    })

    useHotkeys(this, {
      esc: [this.clickOutside],
    })

    window.addEventListener("turbo:before-cache", this.close)
  }

  disconnect() {
    window.removeEventListener("turbo:before-cache", this.close)

    this.#unlockScroll()
  }

  clickOutside() {
    this.element.open = false
  }

  toggle() {
    this.element.open ? this.open() : this.close()
  }

  open() {
    this._focusAfterClose = document.activeElement

    this.#lockScroll()
  }

  close = () => {
    if (this._focusAfterClose) {
      this._focusAfterClose.focus()
      this._focusAfterClose = null
    }

    this.#unlockScroll()
  }

  #lockScroll() {
    document.documentElement.classList.add("is-drop-panel-open")
  }

  #unlockScroll() {
    document.documentElement.classList.remove("is-drop-panel-open")
  }
}
