import { Turbo } from "@hotwired/turbo-rails"
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "select", "loader"]

  disconnect() {
    this.#loadEnd()
  }

  update() {
    this.#loadStart()

    const url = new URL(this.formTarget.action)
    url.searchParams.set(this.selectTarget.name, this.selectTarget.value)
    Turbo.visit(url, {frame: this.element.id})
  }

  #loadStart() {
    this.selectTarget.disabled = true
    this.loaderTarget.hidden = false
  }

  #loadEnd() {
    this.selectTarget.disabled = false
    this.loaderTarget.hidden = true
  }
}
