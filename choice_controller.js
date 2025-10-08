import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["none", "checkbox"]

  change(e) {
    if (e.target.checked) {
      this.checkboxTargets.forEach(box => box.checked = box == e.target)
      this.noneTarget.checked = false
    } else {
      this.noneTarget.checked = true
    }
  }
}
