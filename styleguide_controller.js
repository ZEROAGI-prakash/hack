import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "switchButton", "switched" ]

  switchClass({params: {defaultLabel, switchedLabel, switchedClass}}) {
    this.switchedTarget.classList.toggle(switchedClass)

    const hasSwitched = this.switchedTarget.classList.contains(switchedClass)
    const label = hasSwitched ? switchedLabel : defaultLabel

    this.switchButtonTarget.innerHTML = label
  }
}
