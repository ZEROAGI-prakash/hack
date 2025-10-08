import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {siteKey: String}

  connect() {
    window.grecaptcha.render(this.element.id, {sitekey: this.siteKeyValue})
  }
}
