import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  keypress(e) {
    const input = this.inputTarget

    if (e.key === "Enter") {
      input.checked = input.type == "radio" ? true : !input.checked
      input.dispatchEvent(new Event("change"))
    }
  }
}
