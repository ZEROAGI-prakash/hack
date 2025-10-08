import { Controller } from "@hotwired/stimulus"
import TomSelect from "tom-select"

export default class extends Controller {
  static targets = ["input"]

  connect() {
    this.instance = new TomSelect(this.inputTarget, {
      plugins: ["remove_button"],
      persist: false,
      create: true,
      createOnBlur: true,
    })
  }

  disconnect() {
    this.instance.destroy()
  }
}
