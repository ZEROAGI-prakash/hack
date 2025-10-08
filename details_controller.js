import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["details"]

  open() {
    if (this.hasDetailsTarget) {
      this.detailsTarget.open = true
    } else {
      this.element.open = true
    }
  }

  close() {
    if (this.hasDetailsTarget) {
      this.detailsTarget.open = false
    } else {
      this.element.open = false
    }
  }
}
