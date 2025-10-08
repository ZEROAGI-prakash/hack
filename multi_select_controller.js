import { Controller } from "@hotwired/stimulus"
import TomSelect from "tom-select"

export default class extends Controller {
  static targets = ["select"]
  static values = {maxItems: Number}

  connect() {
    this.instance = new TomSelect(this.selectTarget, {
      plugins: ["remove_button"],
      onItemAdd: function() {
        this.setTextboxValue("")
        this.refreshOptions()
      },
      maxItems: this.maxItemsValue,
      hidePlaceholder: true,
      create: false,
    })
  }

  setupTomSelect(setupFn) {
    setupFn(this.instance)
  }

  enable() {
    this.selectTarget.disabled = false

    this.instance.enable()
  }

  disconnect() {
    this.instance.destroy()
  }
}
