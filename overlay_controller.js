import { Controller } from "@hotwired/stimulus"
import { useHotkeys } from "stimulus-use/hotkeys"

export default class extends Controller {
  static targets = ["main", "background", "firstFocus"]

  connect() {
    useHotkeys(this, {
      esc: [this.close],
    })

    this._focusAfterClose = null
    this.isClosing = false
    this.dispatch("connect")

    document.addEventListener("overlay:close", this.close.bind(this))
  }

  disconnect() {
    this.#unlockScroll()

    document.removeEventListener("overlay:close", this.close.bind(this))
  }

  open() {
    this._focusAfterClose = document.activeElement

    this.#addAria()
    this.#showElements()

    if (this.hasFirstFocusTarget) {
      this.firstFocusTarget.focus()
    }

    this.#lockScroll()
    this.dispatch("open")
  }

  close() {
    if (this.isClosing) return
    this.isClosing = true

    this.#removeAria()
    this.#hideElements()

    if (this._focusAfterClose) {
      this._focusAfterClose.focus()
      this._focusAfterClose = null
    }

    this.#unlockScroll()
    this.dispatch("close")

    this.isClosing = false
  }

  closeOnAjaxSuccess(e) {
    if (e.detail.success) this.close()
  }

  #addAria() {
    this.mainTarget.setAttribute("aria-modal", true)
  }

  #removeAria() {
    this.mainTarget.removeAttribute("aria-modal")
  }

  #showElements() {
    this.mainTarget.hidden = false

    if (!this.#isPageBlocked()) return

    this.backgroundTarget.hidden = false
  }

  #hideElements() {
    this.mainTarget.hidden = true

    if (!this.#isPageBlocked()) return

    this.backgroundTarget.hidden = true
  }

  #unlockScroll() {
    if (!this.#isPageBlocked()) return

    document.documentElement.classList.remove("is-modal-open")
  }

  #lockScroll() {
    if (!this.#isPageBlocked()) return

    document.documentElement.classList.add("is-modal-open")
  }

  #isPageBlocked() {
    return this.hasBackgroundTarget
  }
}
