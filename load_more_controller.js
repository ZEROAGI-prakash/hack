import { Controller } from "@hotwired/stimulus"
import { useWindowResize } from "stimulus-use"

const openClassname = "has-load-more-on-y--visible"
const ellipsisClassname = "has-load-more-on-y__content--ellipsis"

export default class extends Controller {
  static targets = ["container", "shrunk", "button"]
  static values = {
    showMore: String,
    showLess: String,
  }

  connect() {
    useWindowResize(this)

    this.isOpen = this.containerTarget.classList.contains(openClassname)
    this.updateButton()
  }

  windowResize() {
    this.updateButton()
  }

  updateButton() {
    if (this.hasShrunkTarget) {
      this.shrunkTarget.classList.remove(ellipsisClassname)
    }

    if (!this.#hasOverflownText()) {
      this.buttonTarget.hidden = true

      return
    }

    this.buttonTarget.hidden = false

    if (this.hasShrunkTarget) {
      this.shrunkTarget.classList.add(ellipsisClassname)
    }
  }

  toggle() {
    this.isOpen = !this.isOpen
    this.containerTarget.classList.toggle(openClassname, this.isOpen)
    this.#updateText()
  }

  #hasOverflownText() {
    if (!this.hasShrunkTarget) return true

    const shrunk = this.shrunkTarget

    return(
      shrunk.scrollHeight > shrunk.clientHeight ||
      shrunk.scrollWidth > shrunk.clientWidth
    )
  }

  #updateText() {
    if (this.isOpen) {
      this.buttonTarget.innerHTML = this.showLessValue

      return
    }

    this.buttonTarget.innerHTML = this.showMoreValue
  }
}
