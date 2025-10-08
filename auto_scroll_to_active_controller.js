import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["active"]

  connect() {
    if (!this.#needsAutoScroll()) return

    const leftGap = 10

    this.element.scrollTo({left: this.#activeElementX() - leftGap})
  }

  #activeElementX() {
    if (this._activeElementX) {
      return this._activeElementX
    }

    this._activeElementX =
      this.activeTarget.getBoundingClientRect().x

    return this._activeElementX
  }

  #needsAutoScroll() {
    if (!this.hasActiveTarget) return false

    const hasScroll = this.element.clientWidth < this.element.scrollWidth

    if (!hasScroll) return false

    const activeElementRightX =
      this.#activeElementX() + this.activeTarget.clientWidth
    const isInViewport = activeElementRightX < this.element.clientWidth

    return !isInViewport
  }
}
