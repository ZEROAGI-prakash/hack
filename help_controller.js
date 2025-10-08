import { Controller } from "@hotwired/stimulus"
import { useClickOutside } from "stimulus-use"
import { useHotkeys } from "stimulus-use/hotkeys"

export default class extends Controller {
  static targets = ["hidden"]

  connect() {
    useClickOutside(this, {
      dispatchEvent: false,
    })
    useHotkeys(this, {
      esc: [this.hide],
    })
  }

  clickOutside() {
    this.hide()
  }

  show() {
    this.element.open = true
  }

  hide() {
    this.element.open = false
  }
}
