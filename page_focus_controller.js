import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  focus(e) {
    e.preventDefault()
    const id = this.element.href.replace(/^.*#/, "")
    const element = document.getElementById(id)
    element.scrollIntoView()
    element.focus()
    document.documentElement.classList.add("outline-on")
  }
}
