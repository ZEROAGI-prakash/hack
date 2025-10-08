import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sprite"]

  mousemove(e) {
    this.#scrub({x: e.clientX})
  }

  touchmove(e) {
    const touch = e.changedTouches[0]

    if (this.element.dataset.scrubTouch == "vertical") {
      this.#scrub({y: touch.clientY})
    } else {
      this.#scrub({x: touch.clientX})
    }
  }

  touchstart() {
    document.documentElement.classList.add("is-horizontally-scrolling")
  }

  touchend() {
    document.documentElement.classList.remove("is-horizontally-scrolling")
  }

  restart() {
    this.#imageMove(0)
  }

  #scrub({x, y}) {
    const imageCount = 20
    const bounds = this.element.getBoundingClientRect()
    const sliceCount = (bounds.width / imageCount) - 1

    const position = x ? x - bounds.left : y - bounds.top
    let index = Math.floor(position / sliceCount)
    if (index < 0 || imageCount <= index) index = 0

    this.#imageMove(index * bounds.height)
  }

  #imageMove(top) {
    requestAnimationFrame(() => {
      // translateZ for a faster animation
      this.spriteTarget.style.transform = `translateY(${-top}px) translateZ(0)`
    })
  }
}
