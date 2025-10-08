import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["addDiscountLink"]

  updateLink(e) {
    if (!this.hasAddDiscountLinkTarget) return

    const link = this.addDiscountLinkTarget
    const price = e.currentTarget.value
    const url = new URL(link.href)
    const params = new URLSearchParams(url.search)
    params.set("discount[amount_in_currency]", price)
    url.search = params.toString()
    link.setAttribute("href", url.toString())
  }
}
