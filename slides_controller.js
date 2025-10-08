import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "content", "prev", "next", "slide", "handle"]

  show(e) {
    this.#show(e.currentTarget.dataset.index)
  }

  hide() {
    if (!this.#isActive()) return

    this.containerTarget.classList.add("is-hidden")
    document.documentElement.classList.remove("is-modal-open")
    this.#applyPreviousScroll()
  }

  stopPropagation(e) {
    e.stopImmediatePropagation()
  }

  keydown(e) {
    if (!this.#isActive()) {
      const element = document.activeElement
      if (e.key == "Enter" && this.handleTargets.includes(element)) {
        this.#show(element.dataset.index)
      }
    } else {
      if (e.key == "Escape" || e.key == "Enter") {
        this.hide()
      } else if (e.key == "ArrowLeft") {
        this.prev(e)
      } else if (e.key == "ArrowRight") {
        this.next(e)
      }
    }
  }

  scroll() {
    this.#updateNav()
  }

  prev(e) {
    e.stopImmediatePropagation()
    this.#triggerChange()
    this.#scroll(-1)
  }

  next(e) {
    e.stopImmediatePropagation()
    this.#triggerChange()
    this.#scroll(+1)
  }

  #show(index) {
    this.#savePreviousScroll()

    const slide = this.slideTargets.find(slide => slide.dataset.index == index)
    this.#openModal()
    this.#triggerChange()
    this.#scrollToSlide(slide)
    this.#updateNav()
  }

  #savePreviousScroll() {
    this.element.dataset.previousScrollTop = document.scrollingElement.scrollTop
  }

  #applyPreviousScroll() {
    const top = this.element.dataset.previousScrollTop
    document.scrollingElement.scroll({top})
  }

  #updateNav() {
    const content = this.contentTarget
    const scroll = content.scrollLeft
    const offset = content.offsetWidth / 2

    this.#updatePrev(scroll, offset)
    this.#updateNext(scroll, offset)
  }

  #updatePrev(scroll, offset) {
    if (!this.hasPrevTarget) return

    if (scroll <= offset) {
      this.prevTarget.classList.add("is-hidden")
    } else {
      this.prevTarget.classList.remove("is-hidden")
    }
  }

  #updateNext(scroll, offset) {
    if (!this.hasNextTarget) return

    const content = this.contentTarget
    const scrollMax = content.scrollWidth - content.offsetWidth

    if (scrollMax <= scroll + offset) {
      this.nextTarget.classList.add("is-hidden")
    } else {
      this.nextTarget.classList.remove("is-hidden")
    }
  }

  #isActive() {
    return !this.containerTarget.classList.contains("is-hidden")
  }

  #openModal() {
    this.containerTarget.classList.remove("is-hidden")
    document.documentElement.classList.add("is-modal-open")
  }

  #triggerChange() {
    this.slideTargets.forEach(slide => {
      slide.dispatchEvent(new CustomEvent("slides:change"))
    })
  }

  #scroll(increment) {
    const content = this.contentTarget
    content.scroll({
      left: content.scrollLeft + content.offsetWidth * increment
    })
  }

  #scrollToSlide(slide) {
    this.contentTarget.classList.add("is-setting-scroll")
    slide.scrollIntoView()
    this.contentTarget.classList.remove("is-setting-scroll")
  }
}
