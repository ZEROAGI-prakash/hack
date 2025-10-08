import { Controller } from "@hotwired/stimulus"

// Example usage for an element that scrolls smoothly to itself on connect:
//    <div
//      data-controller="scroll"
//      data-scroll-behavior-value="smooth"
//      data-action="scroll:connect->scroll#scroll"
//    >
//      …
//    </div>
export default class extends Controller {
  static values = {
    behavior: {type: String, default: "instant"},
  }

  connect() {
    setTimeout(() => {
      this.dispatch("connect")
    }, 0)
  }

  scroll() {
    this.element.scrollIntoView({behavior: this.behaviorValue})
  }
}
