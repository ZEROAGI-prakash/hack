import { Controller } from "@hotwired/stimulus"
import hotkeys from "hotkeys-js"

// Make a textarea submittable by hitting cmd+enter.
//
// Example:
//   <textarea
//     data-controller="submittable-area"
//     data-action="focus->submittable-area#start blur->submittable-area#end"
//   ></textarea>
export default class extends Controller {
  disconnect() {
    this.end()
  }

  start() {
    this.previousFilter = hotkeys.filter
    hotkeys.filter = () => true
    hotkeys("cmd+enter", this.#requestSubmit)
  }

  end() {
    hotkeys.unbind("cmd+enter", this.#requestSubmit)
    hotkeys.filter = this.previousFilter
    this.previousFilter = null
  }

  #requestSubmit = () => {
    this.element.form.requestSubmit()
  }
}
