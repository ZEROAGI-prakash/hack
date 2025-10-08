import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["option"]

  close() {
    this.optionTargets.forEach(option => option.open = false)
  }

  closeOthers(e) {
    const details = this.#parentsMatchingSelector(e.target, "details")

    this.optionTargets.forEach(option => {
      if (details.indexOf(option) == -1) option.open = false
    })
  }

  #parentsMatchingSelector(element, selector) {
    const parents = []
    while ((element = element.closest(selector))) {
      parents.push(element)
      element = element.parentNode
    }
    return parents
  }
}
