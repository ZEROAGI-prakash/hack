import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {title: String, text: String, url: String}

  connect() {
    if (!this.#isAvailable()) this.element.remove()
  }

  share() {
    navigator.share(this.#data())
  }

  #isAvailable() {
    if (typeof navigator.share == "undefined") return false

    return navigator.canShare(this.#data())
  }

  #data() {
    return {
      title: this.titleValue,
      text: this.textValue,
      url: this.urlValue,
    }
  }
}
