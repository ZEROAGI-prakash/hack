import { Controller } from "@hotwired/stimulus"
import { loadScript } from "@paypal/paypal-js"

import { jsonFetch } from "../helpers/json_fetch"

export default class extends Controller {
  static values = {
    // PayPal SDK parameters
    clientId: String,
    locale: String,
    currency: String,

    // Fetch URLs
    buttonIntentsUrl: String,
    capturesUrl: String,
  }

  static targets = [
    "buttonContainer",

    // Errors
    "error",
    "buttonLoadError",

    // Loaders
    "buttonLoading",
  ]

  // Initialize the PayPal SDK & show button
  connect() {
    this
      .#insertScript()
      .then(this.#initButton)
      .catch(e => this.#error(`PayPal connect error: ${e}`, e))
      .then(() => {
        this.buttonLoadingTarget.hidden = true
        this.element.classList.remove("is-loading")
      })
  }

  // Insert PayPal’s script
  #insertScript = () => {
    return loadScript({
      "client-id": this.clientIdValue,
      locale: this.localeValue,
      currency: this.currencyValue,
      components: "buttons",
    })
  }

  // https://developer.paypal.com/sdk/js/reference/
  #initButton = () => {
    if (!window.paypal.Buttons) {
      this.buttonLoadErrorTarget.hidden = false
      return Promise.resolve()
    }

    try {
      return window.paypal
        .Buttons({
          fundingSource: window.paypal.FUNDING.PAYPAL,
          style: {
            height: 42, // 25..55
            color: "blue",
          },
          createOrder: this.#createButtonOrder,
          onApprove: this.#captureButton,
          onError: this.#buttonError,
        })
        .render(this.buttonContainerTarget)
    } catch (e) {
      return Promise.reject(`Button initialization error: ${e}`)
    }
  }

  // Create a PayPal payment intent for a button payment.
  // https://developer.paypal.com/docs/business/checkout/server-side-api-calls/create-order/
  #createButtonOrder = (_data, _actions) => {
    // This helps close the payment accordion
    this.buttonContainerTarget.dispatchEvent(new MouseEvent("click"))

    this.errorTarget.innerHTML = ""

    return jsonFetch(this.buttonIntentsUrlValue, {method: "POST"})
      .then(json => json.paypal_order.code)
      .catch(e => this.#error(this.#intentsErrorMessage(e), e))
  }

  // Capture the button payment intent.
  // https://developer.paypal.com/docs/business/checkout/server-side-api-calls/capture-order/
  #captureButton = (data, _actions) => {
    return this.#capture(data.orderID)
      .catch(e => {
        this.#error(`PayPal error: ${this.#captureErrorMessage(e)}`, e)
      })
  }

  #intentsErrorMessage = (e) => {
    if (e.status === 429) {
      return "Too many requests, please wait before trying again."
    }

    const message = e.statusText || e.responseText || JSON.stringify(e)
    return `Payment intent error: ${message}`
  }

  #captureErrorMessage(e) {
    if (e.name == "INVALID_REQUEST" && e.details) {
      return e.details.map(detail => {
        const name = detail.field.replace("/payment_source/card/", "")
        return `${name}: ${detail.description}`
      }).join(",\n")
    }

    if (e.message) {
      let message = e.message || ""
      if (e.details?.[0]?.description) {
        message += ` (${e.details[0].description})`
      }
      return message
    }

    return e.responseJSON?.error || e.responseText || "Unknown error"
  }

  #capture(id) {
    const body = {paypal_order_code: id}

    return jsonFetch(this.capturesUrlValue, {method: "POST", body})
      .then(data => {
        const url = data.orderPath || data.redirectUrl
        if (!url) throw data.error || data.state

        // This clears the cart
        window.location = url
      })
  }

  #buttonError = (error) => {
    if (error.message == "Detected popup close") return

    this.#error(`PayPal error: ${error.message}`, error)
  }

  #error = (message, error) => {
    console.error("PayPal error", message, error)
    this.errorTarget.innerText = message
  }
}
