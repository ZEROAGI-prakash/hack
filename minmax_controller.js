import { Controller } from "@hotwired/stimulus"

// Keeps a float value in an input from going outside its `min` and `max`
// attributes.
//
// Example:
//
//     <input
//       data-controller="minmax"
//       data-action="change->minmax#check turbo:load@window#check"
//       min="0"
//       max="42"
//     />
export default class extends Controller {
  check() {
    const min = parseFloat(this.element.min)
    const max = parseFloat(this.element.max)
    const value = parseFloat(this.element.value)

    if (isNaN(value) || (!isNaN(min) && value < min)) {
      this.#updateValue(min)
    } else if (!isNaN(max) && value > max) {
      this.#updateValue(max)
    }
  }

  #updateValue(value) {
    this.element.value = value
    this.element.dispatchEvent(new Event("change"))
  }
}
