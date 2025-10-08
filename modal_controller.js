import { Controller } from "@hotwired/stimulus"

// See also
// https://blog.appsignal.com/2024/02/21/hotwire-modals-in-ruby-on-rails-with-stimulus-and-turbo-frames.html
export default class extends Controller {
  static targets = ["modal"]

  open(event) {
    this.#setModalOpener(event)
    this.#setClassNames()
    this.#getOverlayController().open()
  }

  reset() {
    this.#resetDefaultContent()
    this.#resetClassNames()
    this._modalOpener = null
  }

  getDefaultContent() {
    this._defaultContent = this.#getModalDialog().innerHTML
  }

  #resetClassNames() {
    if (!this._classNames) return

    this._classNames.split(" ").forEach((className) =>
      this.#getModalDialog().classList.remove(className)
    )
    this._classNames = null
  }

  #resetDefaultContent() {
    this.#getModalDialog().innerHTML = this._defaultContent
  }

  #setClassNames() {
    this._classNames = this.#getModalOpener().dataset["modalClassNames"]

    if (!this._classNames) return

    this._classNames.split(" ").forEach((className) =>
      this.#getModalDialog().classList.add(className)
    )
  }

  #setModalOpener(event) {
    this._modalOpener = event.currentTarget
  }

  #getModalOpener() {
    return this._modalOpener
  }

  #getModalDialog() {
    if (this._modalDialog) return this._modalDialog

    this._modalDialog = this.#getOverlayController().mainTarget

    return this._modalDialog
  }

  #getOverlayController() {
    if (this._overlayController) return this._overlayController

    this._overlayController =
      this
        .application
        .getControllerForElementAndIdentifier(this.modalTarget, "overlay")

    return this._overlayController
  }
}
