import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "button", "iconVisible", "iconHidden"]
  static values = {
    showLabel: {type: String, default: "Show password"},
    hideLabel: {type: String, default: "Hide password"},
  }

  toggle() {
    const isPasswordVisible = this.inputTarget.type === "text"
    const showLabel = this.showLabelValue
    const hideLabel = this.hideLabelValue

    // Toggle the input type
    this.inputTarget.type = isPasswordVisible ? "password" : "text"

    // Toggle the icon visibility
    this.iconVisibleTarget.hidden = isPasswordVisible
    this.iconHiddenTarget.hidden = !isPasswordVisible

    // Update the button title and aria-label
    this.buttonTarget.title = isPasswordVisible ? showLabel : hideLabel
    this.buttonTarget.setAttribute(
      "aria-label",
      isPasswordVisible ? showLabel : hideLabel,
    )
  }
}
