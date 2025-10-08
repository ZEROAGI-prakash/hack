import { Controller } from "@hotwired/stimulus"
import { jsonFetch } from "../helpers/json_fetch"

export default class extends Controller {
  submit(e) {
    e.preventDefault()

    const url = this.data.get("url")
    const followed = this.data.get("followed") == "true"
    const method = followed ? "DELETE" : "POST"

    this.#disable()
    jsonFetch(url, {method})
      .then(() => {
        this.markAsFollowed({followed: !followed})
        this.#dispatchFollowEvent({followed: !followed})
        this.#enable()
      })
      .catch(this.#handleError)
  }

  markAsFollowed({followed = true}) {
    const classes = this.element.classList

    if (this.data.get("followedClass") != this.data.get("unfollowedClass")) {
      classes.toggle(this.data.get("followedClass"), followed)
      classes.toggle(this.data.get("unfollowedClass"), !followed)
    }

    this.element.innerText = followed
      ? this.data.get("followedText")
      : this.data.get("unfollowedText")

    this.data.set("followed", followed ? "true" : "false")
  }

  #handleError = (response) => {
    if (response.status == 401) {
      window.location = this.data.get("authUrl")
    } else if (response.status == 403) {
      console.error("User restriction prevents from following")
      this.#enable()
    } else {
      console.error("Unknown error", response)
    }
    return response
  }

  #disable() {
    this.element.disabled = true
  }

  #enable() {
    this.element.disabled = false
  }

  #dispatchFollowEvent({followed = true}) {
    const name = followed ? "cults:follow" : "cults:unfollow"
    window.dispatchEvent(new CustomEvent(name))
  }
}
