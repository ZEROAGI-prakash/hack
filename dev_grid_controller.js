import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["grid"]

  toggle() {
    if (this.gridTarget.hidden) {
      this.show()
    } else {
      this.hide()
    }
  }

  show() {
    document.documentElement.classList.add("is-dev")
    this.gridTarget.hidden = false
  }

  hide() {
    document.documentElement.classList.remove("is-dev")
    this.gridTarget.hidden = true
  }
}
