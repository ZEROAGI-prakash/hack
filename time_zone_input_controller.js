import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const value = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (value) this.element.value = value
  }
}
