import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]

  show(e) {
    const id = e.target.id

    this.#toggleContentFor(id)
  }

  #toggleContentFor(id) {
    this.contentTargets.forEach(target => {
      target.hidden = target.dataset.radioTabsTriggerId != id
    })
  }
}
