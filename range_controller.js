import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "button"]

  updateValue(e) {
    e.preventDefault()

    const value = parseInt(e.target.getAttribute("data-range-value"), 10)
    this.inputTarget.value = value
  }
}
