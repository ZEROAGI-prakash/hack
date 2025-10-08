import { Controller } from "@hotwired/stimulus"
import { useClickOutside } from "stimulus-use"

export default class extends Controller {
  connect() {
    useClickOutside(this, {
      dispatchEvent: false,
      onlyVisible: false,
    })

    this.element.classList.add("nav-search--stretchable")
  }

  stretch() {
    this.element.classList.add("nav-search--stretched")
    this.element.querySelector("input").focus()
  }

  shrink() {
    this.element.classList.remove("nav-search--stretched")
  }

  // Using clickOutside instead of blur event to avoid
  // closing the search when clicking on the search submit button
  clickOutside() {
    this.shrink()
  }
}
