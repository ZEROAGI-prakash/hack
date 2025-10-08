import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["nav", "filler"]

  connect() {
    if (this.hasNavTarget && this.hasFillerTarget) {
      this.fillerObserver = new IntersectionObserver(
        this.#onFillerIntersect,
        {threshold: 0},
      )

      this.fillerObserver.observe(this.fillerTarget)
    }
  }

  disconnect() {
    if (this.fillerObserver) {
      this.fillerObserver.disconnect()
    }
  }

  #onFillerIntersect = (entries) => {
    entries.forEach(entry => {
      if (entry.target === this.fillerTarget) {
        this.#handleSticky(entry)
      }
    })
  }

  #handleSticky = (entry) => {
    const height = entry.isIntersecting ? 0 : this.navTarget.offsetHeight

    if (this.hasFillerTarget) {
      this.fillerTarget.style.marginBottom = `${height}px`
    }

    this.navTarget.classList.toggle("nav--sticky", !entry.isIntersecting)
    document
      .documentElement
      .classList
      .toggle("has-sticky-nav", !entry.isIntersecting)
  }
}
