import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const event = new Event(this.data.get("name"))
    event.data = JSON.parse(this.data.get("data"))
    document.dispatchEvent(event)
  }
}
