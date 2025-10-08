import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["star"]

  static values = {
    average: Number,
    current: Number,
  }

  enter(e) {
    this.currentValue = e.target.value
    this.#update()
  }

  leave() {
    this.currentValue = null
    this.#update()
  }

  #update = () => {
    const value =
      (this.hasCurrentValue ? this.currentValue : null) ||
      (this.hasAverageValue ? this.averageValue : 0)

    this.starTargets.forEach(target => {
      target.classList.toggle("is-filled", parseFloat(target.value) <= value)
    })
  }
}
