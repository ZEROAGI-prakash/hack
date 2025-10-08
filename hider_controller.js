import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["hidden"]

  hide() {
    this.hiddenTargets.forEach(target => target.setAttribute("hidden", true))
  }

  show() {
    this.hiddenTargets.forEach(target => target.removeAttribute("hidden"))
  }

  toggle() {
    this.hiddenTargets.forEach(target => target.toggleAttribute("hidden"))
  }

  remove() {
    this.hiddenTargets.forEach(target => target.remove())
  }
}
