import { Controller } from "@hotwired/stimulus"
import { useHotkeys } from "stimulus-use/hotkeys"

export default class extends Controller {
  static targets = ["modal"]

  connect() {
    useHotkeys(this, {
      esc: [this.close],
    })
  }

  show() {
    this.modalTarget.showModal()
  }

  close() {
    this.modalTarget.close()
  }
}
