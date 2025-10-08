import { Controller } from "@hotwired/stimulus"

const rounded = (value) => {
  const rounded = Math.round(value * 100) / 100
  return isNaN(rounded) ? "?" : rounded.toFixed(2)
}

const percentage = (price, percent) => {
  return price - price * percent / 100
}

// Calculate the price of a creation
//
// Example:
//     <div
//       data-controller="price-calculator"
//       data-price-calculator-commission-rate="0.1"
//     >
//       Price:
//       <input
//         data-price-calculator-target="price"
//         data-action="change->price-calculator#update"
//       /> €
//       <input
//         data-price-calculator-target="promotion"
//         data-action="change->price-calculator#update"
//       /> %
//       Price: <span data-price-calculator-target="publicPrice"></span> €
//       Commission: <span data-price-calculator-target="commission"></span> €
//       Revenue: <span data-price-calculator-target="revenue"></span> €
//     />
export default class extends Controller {
  static values = {
    commissionRate: Number,
    minimum: Number,
  }

  static targets = [
    "price",
    "promotionPercentage",
    "promotionPercentageMax",
    "commission",
    "revenue",
    "publicPrice",
    "publicCommission",
    "publicRevenue",
    "percentageError",
  ]

  update() {
    this.#updatePromotionPercentage()

    if (this.hasPromotionPercentageTarget) {
      return this.#updatePublicPriceComposition()
    }

    this.#updatePriceComposition()
  }

  #updatePromotionPercentage() {
    if (!this.hasPromotionPercentageTarget) return

    const promotion = this.promotionPercentageTarget

    // Update maximum
    const maxPromotionPercentage = this.#maxPromotionPercentage()
    promotion.max = maxPromotionPercentage
    this.promotionPercentageMaxTarget.innerText = maxPromotionPercentage

    // Force to integer
    const promotionPercentage = parseInt(promotion.value, 10)
    promotion.value = promotionPercentage

    this.percentageErrorTarget.hidden =
      promotionPercentage != maxPromotionPercentage ||
      promotionPercentage == 99

    this.publicPriceTarget.innerText = rounded(this.#publicPrice())
  }

  #updatePriceComposition() {
    const price = this.#price()
    const commission = this.#commissionAmount(price)
    const revenue = this.#revenueAmount(price)

    this.commissionTarget.innerText = rounded(commission)
    this.revenueTarget.innerText = rounded(revenue)
  }

  #updatePublicPriceComposition() {
    const price = this.#publicPrice()
    const commission = this.#commissionAmount(price)
    const revenue = this.#revenueAmount(price)

    this.publicCommissionTarget.innerText = rounded(commission)
    this.publicRevenueTarget.innerText = rounded(revenue)
  }

  #revenueAmount(price) {
    return price - this.#commissionAmount(price)
  }

  #commissionAmount(price) {
    return price * this.commissionRateValue
  }

  #maxPromotionPercentage() {
    const minimum = this.minimumValue
    const price = this.#price()

    for (let percent = 100; percent > 0; percent--) {
      if (percentage(price, percent) >= minimum) return percent
    }

    return 0
  }

  #price() {
    const value = this.priceTarget.value ||
      this.priceTarget.dataset["priceCalculatorPriceValue"]

    return parseFloat(value)
  }

  #publicPrice() {
    const price = this.#price()

    if (!this.hasPromotionPercentageTarget) return price

    return percentage(price, this.promotionPercentageTarget.value)
  }
}
