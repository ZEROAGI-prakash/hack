import { Controller } from "@hotwired/stimulus"
import { jsonFetch } from "../helpers/json_fetch"

export default class extends Controller {
  static targets = ["username", "available", "unavailable", "loading"]
  static values = {url: String}

  checkAvailability() {
    const value = this.usernameTarget.value
    const url = this.urlValue

    this.loadingTarget.hidden = false
    this.unavailableTarget.hidden = true
    this.availableTarget.hidden = true

    if (value.length == 0) {
      this.loadingTarget.hidden = true
      return
    }

    jsonFetch(`${url}?nick=${value}`)
      .then(data => {
        this.availableTarget.hidden = !data.available
        this.unavailableTarget.hidden = data.available
        this.loadingTarget.hidden = true
      })
  }
}
