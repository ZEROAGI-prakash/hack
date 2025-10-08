import { Controller } from "@hotwired/stimulus"
import { jsonFetch } from "../helpers/json_fetch"

export default class extends Controller {
  static targets = ["button"]
  static values = {followeesPath: String}

  connect() {
    this.#fetchFollowedNicks().then(({nicks}) => {
      this.buttonTargets.forEach(button => {
        if (!nicks.includes(button.dataset.followBatchNick)) return

        button.dispatchEvent(new CustomEvent("cults:markAsFollowed"))
      })
    })
  }

  #fetchFollowedNicks() {
    return jsonFetch(this.followeesPathValue, {method: "GET"})
  }
}
