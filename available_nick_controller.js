import { Controller } from "@hotwired/stimulus"
import { jsonFetch } from "../helpers/json_fetch"

export default class extends Controller {
  static targets = ["email", "nick"]
  static values = {fetchPath: String}

  autofill() {
    const email = this.emailTarget.value.trim()
    const nick = this.nickTarget.value.trim()

    if (nick.length > 0) return

    jsonFetch(this.fetchPathValue, {method: "POST", body: {email}})
      .then(data => {
        if (!data.nick) return

        this.nickTarget.value = data.nick
        this.nickTarget.dispatchEvent(new Event("input", {bubbles: true}))
      })
  }
}
