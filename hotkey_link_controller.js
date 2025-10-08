import { Controller } from "@hotwired/stimulus"
import { install, uninstall } from "@github/hotkey"

// Add a quick hotkey shortcut to a link.
//
// Example:
//   <a
//     data-controller="hotkey-link"
//     data-hotkey-link-key-value="Control+a"
//     title="Admin"
//     href="/admin"
//   >
//     Admin
//   </a>
//
// Find the name of the command using:
// https://github.github.com/hotkey/hotkey_mapper.html
export default class extends Controller {
  static values = {key: String}

  connect() {
    install(this.element, this.keyValue)

    this.originalTitle = this.element.title
    this.element.title = this.#title()
  }

  disconnect() {
    this.element.title = this.originalTitle

    uninstall(this.element)
  }

  #title() {
    const title = this.originalTitle
    const shortcut = `⌨️ ${this.#shortcut()}`

    return title ? `${title} (${shortcut})` : shortcut
  }

  #shortcut() {
    return this.keyValue.split("+").map(v => {
      switch (v) {
        case "cmd": return "⌘"
        case "enter": return "↩"
        default: return v
      }
    }).join(" + ")
  }
}
