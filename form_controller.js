import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "submit", "input", "error"]
  static values = {confirmLeave: String}

  connect() {
    this.toggleValidationSubmission()
  }

  disconnect() {
    document.removeEventListener(
      "turbo:before-visit",
      this.#onBeforeLeave,
    )
    this.element.classList.remove("form--dismissed")
  }

  submit() {
    if (this.confirmLeaveValue) {
      this.submitting = true

      document.addEventListener("turbo:before-visit", this.#onBeforeLeave)
      document.addEventListener(
        "turbo:before-stream-render",
        () => { this.submitting = false },
        {once: true},
      )
    }

    (this.hasFormTarget ? this.formTarget : this.element).requestSubmit()
  }

  #onBeforeLeave = (e) => {
    if (this.submitting && !confirm(this.confirmLeaveValue)) {
      e.preventDefault()
    }
  }

  submitIfValid() {
    const valid = this.inputTargets.every(input => input.validity.valid)
    if (valid) this.submit()
  }

  dismiss() {
    this.element.classList.add("form--dismissed")
  }

  clearError() {
    this.errorTargets.forEach(error => error.remove())
  }

  toggleValidationSubmission() {
    const valid = this.inputTargets.every(input => input.validity.valid)
    this.submitTargets.forEach(submit => {
      submit.classList.toggle("is-disabled", !valid)
    })
  }
}
