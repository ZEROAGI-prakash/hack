import { Controller } from "@hotwired/stimulus"
import Cookies from "js-cookie"

const cookieName = "age_gate"
const className = "redacted"

export default class extends Controller {
  connect() {
    if (Cookies.get(cookieName)) this.#remove()
  }

  accept() {
    Cookies.set(cookieName, true, {expires: 100})
    this.#remove()
  }

  #remove() {
    this.#redactedTarget().classList.remove(className)
    this.element.remove()
  }

  #redactedTarget() {
    return document.querySelector(this.element.dataset.ageGateRedactedTarget)
  }
}
