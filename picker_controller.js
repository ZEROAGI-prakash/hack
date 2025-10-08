import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "pickable", // all elements that can be shown, they must have a data-index
    "handle", // thumbs that reference a pickable, they must have a data-index
  ]

  choose(e) {
    e.preventDefault()
    const index = e.currentTarget.dataset.index

    this.pickableTargets.forEach(pickable => {
      if (pickable.dataset.index == index) {
        this.#showPickable(pickable)
      } else {
        this.#hidePickable(pickable)
      }
    })

    this.handleTargets.forEach(handle => {
      if (handle.dataset.index == index) {
        handle.classList.add("is-active")
      } else {
        handle.classList.remove("is-active")
      }
    })
  }

  #showPickable = (element) => {
    element.classList.remove("is-hidden")
  }

  #hidePickable = (element) => {
    if (!element.classList.contains("is-hidden")) {
      element.classList.add("is-hidden")
      element.dispatchEvent(new CustomEvent("picker:hide"))
    }
  }
}
