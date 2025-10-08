import { Turbo } from "@hotwired/turbo-rails"
import { Controller } from "@hotwired/stimulus"
import { get } from "@rails/request.js"

export default class extends Controller {
  clearCache() {
    Turbo.clearCache()
  }

  getTurboStream(e) {
    e.preventDefault()

    get(e.target.href, {
      contentType: "text/vnd.turbo-stream.html",
      responseKind: "turbo-stream",
    })
  }
}
