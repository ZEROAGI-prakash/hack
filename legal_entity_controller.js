import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "kind",
    "companyName",
    "countryCode",
    "vin",
    "tin",
    "tinLabelIndividual",
    "tinLabelCompany",
  ]

  connect() {
    this.update()
  }

  update() {
    this.#show(
      this.tinLabelIndividualTarget,
      this.kindTarget.value == "" || this.#isIndividual(),
    )

    this.#show(this.tinLabelCompanyTarget, this.#isCompany())

    // Updates here should also:
    // - be applied to the component as hidden defaults
    // - match validations in the LegalEntity model
    this.#show(this.companyNameTarget, this.#isCompany())
    this.#show(this.vinTarget, this.#isCompany() && this.#isEuropean())
    this.#show(this.tinTarget, this.#isCompany() || this.#isEuropean())
  }

  #isCompany() {
    return this.kindTarget.value == "company"
  }

  #isIndividual() {
    return this.kindTarget.value == "individual"
  }

  #isEuropean() {
    const country = this.countryCodeTarget.selectedOptions[0]
    return country?.dataset?.legalEntityEuropean == "true"
  }

  #show(element, show) {
    if (show) {
      element.removeAttribute("hidden")
    } else {
      element.setAttribute("hidden", true)
    }
  }
}
