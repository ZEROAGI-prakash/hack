import { Controller } from "@hotwired/stimulus"
import { useClickOutside } from "stimulus-use"

export default class extends Controller {
  connect() {
    useClickOutside(
      this, {
        dispatchEvent: false,
        onlyVisible: false,
      },
    )
  }

  clickOutside() {
    this.element.open = false
  }
}
