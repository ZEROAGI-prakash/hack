import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["all", "box"]
  static values = {checkAndDisableOnConnect: Boolean}

  connect() {
    if (this.checkAndDisableOnConnect) this.#initDisabledBoxes()
  }

  checkAll() {
    const checked = this.allTarget.checked
    this.boxTargets.forEach(box => box.checked = checked)
  }

  check() {
    this.allTarget.checked = this.boxTargets.every(box => box.checked)
  }

  checkAndDisableBoxes() {
    const checked = this.allTarget.checked

    this.boxTargets.forEach(box => {
      box.checked = checked
      box.disabled = checked
    })
  }

  checkBox() {
    const allBoxesChecked = this.boxTargets.every(box => box.checked)

    if (allBoxesChecked) {
      this.allTarget.checked = true
      this.checkAndDisableBoxes()
    } else {
      this.allTarget.checked = false
    }
  }

  #initDisabledBoxes() {
    const checked = this.allTarget.checked

    this.boxTargets.forEach(box => {
      if (checked) box.checked = true
      box.disabled = checked
    })
  }
}
