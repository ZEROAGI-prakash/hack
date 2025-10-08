import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.loadCount = 0
  }

  loadAndScrollNext() {
    this.loadCount += 1

    if (this.loadCount > 1) this.element.scrollIntoView()
  }
}
