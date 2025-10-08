import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "prev", "next"]

  prev() {
    this.#scrollBy(-1)
  }

  next() {
    this.#scrollBy(1)
  }

  start() {
    const prev = this.prevTarget
    const next = this.nextTarget
    const container = this.containerTarget
    const scroll = container.scrollLeft
    const scrollMax = container.scrollWidth - container.offsetWidth
    const offset = this.#offset() / 2

    if (scroll <= offset) {
      prev.classList.add("is-hidden")
    } else {
      prev.classList.remove("is-hidden")
    }

    if (scrollMax <= scroll + offset) {
      next.classList.add("is-hidden")
    } else {
      next.classList.remove("is-hidden")
    }

    document.documentElement.classList.add("is-horizontally-scrolling")
  }

  end() {
    document.documentElement.classList.remove("is-horizontally-scrolling")
  }

  #scrollBy(speed) {
    this.containerTarget.scroll({
      left: this.containerTarget.scrollLeft + this.#offset() * speed
    })
  }

  #offset() {
    const style = window.getComputedStyle(this.containerTarget)
    const count = parseInt(style.getPropertyValue("--thumbs"))
    return this.containerTarget.offsetWidth / count
  }
}
