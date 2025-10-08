import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  resize() {
    this.element.style.height = "inherit"

    const computed = window.getComputedStyle(this.element)
    const height =
      parseInt(computed.getPropertyValue("border-top-width"), 10)
      + this.element.scrollHeight
      + parseInt(computed.getPropertyValue("border-bottom-width"), 10)

    this.element.style.height = `${height}px`
  }
}
