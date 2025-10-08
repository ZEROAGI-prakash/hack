import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    text: String,
  }

  show(event) {
    event.preventDefault()
    alert(this.textValue)
  }
}
