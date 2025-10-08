import { Controller } from "@hotwired/stimulus"
import Cookies from "js-cookie"

export default class extends Controller {
  static values = {
    cookieName: String,
    expiresInDays: {type: Number, default: 30},
  }

  connect() {
    if (Cookies.get(this.cookieNameValue)) this.#remove()
  }

  close() {
    Cookies.set(
      this.cookieNameValue,
      true,
      {expires: this.expiresInDaysValue},
    )

    this.#remove()
  }

  #remove() {
    this.element.remove()
  }
}
