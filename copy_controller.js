import ClipboardJS from "clipboard"
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "listener", // Listen to clicks here
    "prompt", // "Copy"
    "success", // "Copied!"
    "error", // "Press ctrl-c"
    "text", // If text is visible, use this target
  ]

  // If text is invisible, use this value
  static values = {text: String}

  connect() {
    this.clipboard = new ClipboardJS(this.listenerTarget, {
      text: this.hasTextValue && (() => this.textValue),
      target: this.hasTextTarget && (() => this.textTarget),
    })
    this.clipboard.on("success", this.#success)
    this.clipboard.on("error", this.#error)
  }

  disconnect() {
    this.clipboard.destroy()
  }

  #success = () => {
    this.promptTarget.hidden = true
    this.successTarget.hidden = false
  }

  #error = () => {
    this.errorTarget.hidden = false
    this.textTarget.hidden = false
  }
}
