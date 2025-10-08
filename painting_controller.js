import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  // img target can also be a video element
  static targets = ["img", "source"]

  connect() {
    if (!this.hasImgTarget) return

    this.src = this.imgTarget.src
    this.dataSrc = this.imgTarget.dataset.src

    if (this.dataSrc && "IntersectionObserver" in window) {
      this.element.classList.add("is-sleeping")
      this.observer = new IntersectionObserver(this.#intersection, {
        threshold: 0,
      })
      this.observer.observe(this.element)
    } else {
      this.#startLoading()
      setTimeout(this.#checkImageLoaded, 500)
    }
  }

  disconnect() {
    this.observer?.disconnect()
  }

  loaded() {
    const classList = this.element.classList
    classList.remove("is-loading")
    classList.remove("is-error")
  }

  error = () => {
    const classList = this.element.classList
    classList.remove("is-loading")
    classList.add("is-error")
  }

  #intersection = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.#startLoading()
        this.sourceTargets.forEach(source => {
          source.srcset = source.dataset.srcset
        })
        this.imgTarget.src = this.dataSrc
      }
    })
  }

  #startLoading() {
    this.element.classList.remove("is-sleeping")
    if (!this.#isImageLoaded()) this.element.classList.add("is-loading")
  }

  #checkImageLoaded = () => {
    if (this.#isImageLoaded()) this.loaded()
  }

  #isImageLoaded() {
    const media = this.imgTarget

    // video elements
    if (media.readyState == 4) return true

    // https://stackoverflow.com/a/1977898/311657
    return media.complete && media.naturalWidth
  }
}
