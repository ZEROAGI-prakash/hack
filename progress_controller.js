import { Turbo } from "@hotwired/turbo-rails"
import { Controller } from "@hotwired/stimulus"
import { jsonFetch } from "../helpers/json_fetch"

// Monitor a progress bar.
//
// Example:
//   <div data-controller="progress" data-progress-url-value="/progress.json">
//      <progress data-progress-target="bar" value="0" max="100" />
//      <span data-progress-target="text"></span>
//   </div>
//
// On "/progress.json" return a JSON with a progress between 0 and 1:
//   {progress: 0.5, message: "Uploading"}
//
// When finished you can redirect the page with the redirect JSON value:
//   {progress: 1, message: "Redirecting…", redirect: "/done"}

export default class extends Controller {
  static values = {url: String}
  static targets = ["bar", "text"]

  connect() {
    this.#poll()
  }

  disconnect() {
    clearTimeout(this.timeout)
  }

  #poll = () => {
    this.timeout = setTimeout(this.#fetch, 2 * 1000)
  }

  #fetch = () => {
    jsonFetch(this.urlValue)
      .then(json => this.#update(json))
  }

  #update = (data) => {
    if (!data.progress) return

    if (data.progress < 0) data.progress = 0
    if (data.progress > 1) data.progress = 1

    const percentage = data.progress * 100
    this.barTarget.style.width = "#{percentage}%"
    this.barTarget.setAttribute("aria-valuenow", percentage)
    this.textTarget.innerText = data.message

    if (data.redirect) {
      Turbo.visit(data.redirect)
    } else {
      this.#poll()
    }
  }
}
