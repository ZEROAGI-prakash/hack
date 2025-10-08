import { Turbo } from "@hotwired/turbo-rails"
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["option"]

  change() {
    const value = this.element.value
    let href = null

    this.optionTargets.forEach(option => {
      if (option.value == value) href = option.dataset.selectLocationHref
    })

    if (href) Turbo.visit(href)
  }
}
