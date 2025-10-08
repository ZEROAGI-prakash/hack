import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    setTimeout(this.#init, 0)
  }

  #init = () => {
    const rating = this.data.get("rating")

    if (rating) this.#dispatch("init-creation-rating", {rating})
  }

  #dispatch(name, detail) {
    window.dispatchEvent(new CustomEvent(name, {detail}))
  }
}
