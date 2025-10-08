import { Controller } from "@hotwired/stimulus"
import { jsonFetch } from "../helpers/json_fetch"
import { injectScript } from "../helpers/inject_script"

const cardStyle = color => {
  return {
    base: {
      color: "#505050",
      fontFamily: "Barlow, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
      fontSize: "16px",
      "::selection": {
        color: "#fff",
        backgroundColor: color,
      },
      "::placeholder": {
        color: "#828282",
      },
      iconColor: "#828282",
    },
    invalid: {
      color: "#8b0000",
      iconColor: "#8b0000",
    }
  }
}

// See https://stripe.com/docs/elements/appearance-api
const stripeAppearance = theme => {
  return {
    theme: theme == "dark" ? "night" : "stripe",
  }
}

export default class extends Controller {
  static targets = [
    "error",
    "stripeError",
    "verificationError",
    "verificationErrorMessage",
    "transactionId",
    "loading",

    "card",
    "cardSubmit",
    "cardSpinner",
    "cardRemember",
    "cardError",

    "previousCardContainer",
    "previousCardSubmit",
    "previousCardError",

    "oneClick",
    "oneClickLoading",
    "oneClickAppleLogo",
    "oneClickOtherLogo",
    "oneClickError",
    "oneClickFailed",

    "bancontactName",
    "bancontactSubmit",
    "bancontactError",

    "idealName",
    "idealElement",
    "idealSubmit",
    "idealError",

    "linkEmail",
    "linkElement",
    "linkSubmit",
    "linkError",

    "epsName",
    "epsSubmit",
    "epsError",

    "p24Submit",
    "p24Error",

    "alipaySubmit",
    "alipayError",

    "paypalSubmit",
    "paypalError",

    "wechatPaySubmit",
    "wechatPayError",
    "wechatPayImage",

    "blikSubmit",
    "blikError",
    "blikCode",
  ]

  connect() {
    this.#injectStripe()
      .then(this.#initStripe)
      .catch(e => {
        console.error(e)
        this.stripeErrorTarget.hidden = false
      })
  }

  payOneClick(e) {
    e.preventDefault()
    e.stopPropagation()

    this.paymentRequest.show()
  }

  payCard(e) {
    e.preventDefault()
    e.stopPropagation()

    this.cardSubmitTarget.disabled = true
    this.cardErrorTarget.textContent = null

    const rememberOptions =
      this.hasCardRememberTarget && this.cardRememberTarget.checked ?
        {setup_future_usage: "on_session"} :
        {}

    this
      .#createPaymentIntent("card")
      .then(() => this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {card: this.card},
        ...rememberOptions
      }))
      .then(this.#rejectStripeError)
      .then(this.#checkPaymentIntent)
      .catch(error => {
        this.#enableCard()
        this.cardErrorTarget.textContent = error
      })
  }

  payPayPal(e) {
    e.preventDefault()
    e.stopPropagation()

    this.paypalSubmitTarget.disabled = true
    this.paypalErrorTarget.textContent = null

    this
      .#createPaymentIntent("paypal")
      .then(() => this.stripe.confirmPayPalPayment(this.clientSecret, {
        return_url: this.#intentUrl()
      }))
      .then(this.#rejectStripeError)
      .catch(error => {
        this.paypalSubmitTarget.disabled = false
        this.paypalErrorTarget.textContent = error
      })
  }

  payBlik(e) {
    e.preventDefault()
    e.stopPropagation()

    this.blikSubmitTarget.disabled = true
    this.blikErrorTarget.textContent = null

    this
      .#createPaymentIntent("blik")
      .then(() => this.stripe.confirmBlikPayment(this.clientSecret, {
        payment_method: {
          blik: {}
        },
        payment_method_options: {
          blik: {
            code: this.blikCodeTarget.value
          }
        }
      }))
      .then(this.#rejectStripeError)
      .then(this.#checkPaymentIntent)
      .catch(error => {
        this.blikSubmitTarget.disabled = false
        this.blikErrorTarget.textContent = error
      })
  }

  payPreviousCard(e) {
    e.preventDefault()
    e.stopPropagation()

    this.previousCardSubmitTarget.disabled = true
    this.previousCardErrorTarget.textContent = null

    this
      .#createPaymentIntent("previous_card")
      .then(() => this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method:
          this.previousCardSubmitTarget.dataset.stripePreviousCardId,
      }))
      .then(this.#rejectStripeError)
      .then(this.#checkPaymentIntent)
      .catch(error => {
        this.previousCardSubmitTarget.disabled = false
        this.previousCardErrorTarget.textContent = error
      })
  }

  payBancontact(e) {
    e.preventDefault()
    e.stopPropagation()

    this.bancontactSubmitTarget.disabled = true
    this.bancontactErrorTarget.innerText = null
    this
      .#createPaymentIntent("bancontact")
      .then(() => this.stripe.confirmBancontactPayment(this.clientSecret, {
        payment_method: {
          billing_details: {
            name: this.bancontactNameTarget.value,
          },
        },
        return_url: this.#intentUrl(),
      }))
      .then(this.#rejectStripeError)
      .catch(error => {
        this.bancontactSubmitTarget.disabled = false
        this.bancontactErrorTarget.innerText = error
      })
  }

  payLink(e) {
    e.preventDefault()
    e.stopPropagation()

    this.linkSubmitTarget.disabled = true
    this.linkErrorTarget.innerText = null

    this.elements.submit()
      .then(result => {
        if (result.error && result.error.message) {
          this.linkSubmitTarget.disabled = false
          this.linkErrorTarget.innerText = result.error.message
        }
      })
      .then(() => {
        this.stripe.confirmPayment({
          elements: this.elements,
          clientSecret: this.clientSecret,
          confirmParams: {
            return_url: this.#intentUrl(),
          }})
          .then(this.#rejectStripeError)
      })
      .catch(error => {
        this.linkSubmitTarget.disabled = false
        this.linkErrorTarget.innerText = error
      })

  }

  payIdeal(e) {
    e.preventDefault()
    e.stopPropagation()

    this.idealSubmitTarget.disabled = true
    this.idealErrorTarget.innerText = null
    this
      .#createPaymentIntent("ideal")
      .then(() => this.stripe.confirmIdealPayment(this.clientSecret, {
        payment_method: {
          ideal: {},
          billing_details: {
            name: this.idealNameTarget.value,
          },
        },
        return_url: this.#intentUrl(),
      }))
      .then(this.#rejectStripeError)
      .catch(error => {
        this.idealSubmitTarget.disabled = false
        this.idealErrorTarget.innerText = error
      })
  }

  payEps(e) {
    e.preventDefault()
    e.stopPropagation()

    this.epsSubmitTarget.disabled = true
    this.epsErrorTarget.innerText = null
    this
      .#createPaymentIntent("eps")
      .then(() => this.stripe.confirmEpsPayment(this.clientSecret, {
        payment_method: {
          billing_details: {
            name: this.epsNameTarget.value,
          },
        },
        return_url: this.#intentUrl(),
      }))
      .then(this.#rejectStripeError)
      .catch(error => {
        this.epsSubmitTarget.disabled = false
        this.epsErrorTarget.innerText = error
      })
  }

  payP24(e) {
    e.preventDefault()
    e.stopPropagation()

    this.p24SubmitTarget.disabled = true
    this.p24ErrorTarget.innerText = null
    this
      .#createPaymentIntent("p24")
      .then(() => this.stripe.confirmP24Payment(this.clientSecret, {
        payment_method: {
          billing_details: {
            email: this.data.get("email"),
          },
        },
        return_url: this.#intentUrl(),
      }))
      .then(this.#rejectStripeError)
      .catch(error => {
        this.p24SubmitTarget.disabled = false
        this.p24ErrorTarget.innerText = error
      })
  }

  payAlipay(e) {
    e.preventDefault()
    e.stopPropagation()

    this.alipaySubmitTarget.disabled = true
    this.alipayErrorTarget.innerText = null
    this
      .#createPaymentIntent("alipay")
      .then(() => this.stripe.confirmAlipayPayment(this.clientSecret, {
        return_url: this.#intentUrl(),
      }))
      .then(this.#rejectStripeError)
      .catch(error => {
        this.alipaySubmitTarget.disabled = false
        this.alipayErrorTarget.innerText = error
      })
  }

  payWechatPay(e) {
    e.preventDefault()
    e.stopPropagation()

    this.wechatPaySubmitTarget.disabled = true
    this.wechatPayErrorTarget.innerText = null
    this
      .#createPaymentIntent("wechat_pay")
      .then(() => this.stripe.confirmWechatPayPayment(this.clientSecret, {
        payment_method_options: {
          wechat_pay: {
            client: "web",
          },
        }
      }))
      .then(this.#rejectStripeError)
      .then(this.#checkPaymentIntent)
      .catch(error => {
        this.wechatPaySubmitTarget.disabled = false
        this.wechatPayErrorTarget.innerText = error
      })
  }

  mountCard() {
    if (this.card) this.card.destroy()

    this.cardErrorTarget.textContent = null

    this.card = this.elements.create("card", {
      style: cardStyle(this.data.get("color"))
    })
    this.card.mount(this.cardTarget)
    this.card.on("change", ({error}) => {
      this.cardErrorTarget.textContent = error ? error.message : null
      this.cardSubmitTarget.disabled = !!error
      this.cardSpinnerTarget.hidden = !!error
    })
  }

  mountPreviousCard() {
    this.previousCardErrorTarget.textContent = null
  }

  deletePreviousCard(e) {
    e.preventDefault()
    e.stopPropagation()

    const button = e.target

    if (!confirm(button.dataset.confirmText)) return

    button.disabled = true

    jsonFetch(button.dataset.deleteUrl, {method: "DELETE"})
      .then(() => {
        this.previousCardContainerTarget.hidden = true
      })
      .catch(error => {
        this.previousCardErrorTarget.innerText = error.statusText
      })
  }

  #injectStripe() {
    if (window.Stripe) return Promise.resolve()

    return injectScript("https://js.stripe.com/v3/")
  }

  #initStripe = () => {
    this.stripe = window.Stripe(this.data.get("apiKey"))
    this.elements = this.stripe.elements()

    this.#mountOneClick()
    this.#mountBancontact()
    this.#mountIdeal()
    this.#mountEps()
    this.#mountP24()
    this.#mountAlipay()
    this.#mountLink()
    this.#enableCard()

    if (this.hasLoadingTarget) this.loadingTarget.hidden = true
  }

  #enableCard() {
    if (!this.hasCardSubmit) return

    this.cardSubmitTarget.disabled = false
  }

  #createPaymentIntent = (method) => {
    const body = {payment_method: `stripe_${method}`}
    return jsonFetch(this.data.get("intentsUrl"), {method: "POST", body})
      .then(({clientSecret, transactionId}) => {
        this.clientSecret = clientSecret
        this.transactionId = transactionId
      })
      .catch(e => Promise.reject(e.statusText))
  }

  #mountOneClick() {
    if (!this.hasOneClickTarget) return

    this.paymentRequest = this.stripe.paymentRequest({
      country: "FR",
      currency: this.data.get("currency"),
      total: {
        label: this.data.get("label"),
        amount: parseInt(this.data.get("amountCents")),
      },
      displayItems: JSON.parse(this.data.get("items")),
      requestPayerName: true,
    })

    this
      .paymentRequest
      .canMakePayment()
      .then(result => {
        if (!result) {
          this.oneClickLoadingTarget.hidden = true
          return
        }

        const apple = result.applePay
        if (apple && !this.hasOneClickAppleLogoTarget) return

        this
          .#createPaymentIntent("one_click")
          .then(() => {
            this.oneClickOtherLogoTarget.hidden = apple
            if (this.hasOneClickAppleLogoTarget) {
              this.oneClickAppleLogoTarget.hidden = !apple
            }
            this.oneClickTarget.hidden = false
            this.oneClickLoadingTarget.hidden = true
          })
      })

    this.paymentRequest.on("paymentmethod", this.#confirmOneClick)
  }

  #mountBancontact() {
    if (!this.hasBancontactSubmitTarget) return

    this.bancontactSubmitTarget.disabled = false
  }

  #mountIdeal() {
    if (!this.hasIdealSubmitTarget) return

    this.idealSubmitTarget.disabled = false
  }

  #mountEps() {
    if (!this.hasEpsSubmitTarget) return

    this.epsSubmitTarget.disabled = false
  }

  #mountP24() {
    if (!this.hasP24SubmitTarget) return

    this.p24SubmitTarget.disabled = false
  }

  #mountAlipay() {
    if (!this.hasAlipaySubmitTarget) return

    this.alipaySubmitTarget.disabled = false
  }

  #mountLink() {
    if (!this.hasLinkSubmitTarget) return

    this.linkSubmitTarget.disabled = true

    this
      .paymentRequest
      .canMakePayment()
      .then(() => {
        this
          .#createPaymentIntent("link")
          .then(() => {
            const meta = document.getElementById("theme-name")
            const appearance = stripeAppearance(meta.content)
            this.elements = this.stripe.elements({clientSecret: this.clientSecret, appearance: appearance})
            this.linkAuthentication = this.elements.create("linkAuthentication", {
              defaultValues: {
                email: this.data.get("email"),
              }
            })
            this.linkPayment = this.elements.create("payment")

            this.linkAuthentication.on("ready", (_event) => {
              this.linkSubmitTarget.disabled = false
            })

            this.linkAuthentication.mount("#stripe-link-authentication")
            this.linkPayment.mount("#stripe-link-payment")
          })
      })
  }

  // https://stripe.com/docs/stripe-js/elements/payment-request-button#html-js-complete-payment
  #confirmOneClick = (e) => {
    this.#enableCard()
    this.oneClickFailedTarget.hidden = true
    this.oneClickErrorTarget.hidden = true

    this.stripe.confirmCardPayment(
      this.clientSecret,
      {payment_method: e.paymentMethod.id},
      {handleActions: false }
    ).then(({error, paymentIntent}) => {
      // Report to the browser that the payment failed, prompting it to
      // re-show the payment interface, or show an error message and close
      // the payment interface.
      if (error) {
        e.complete("fail")
        this.oneClickFailedTarget.hidden = false
        return
      }

      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      e.complete("success")

      // Check if the PaymentIntent requires any other actions. If so let
      // Stripe.js handle the flow, else, we are already successful.
      if (paymentIntent.status != "requires_action") {
        this.#checkPaymentIntent()
        return
      }

      this.stripe.confirmCardPayment(this.clientSecret).then(({error}) => {
        if (error) {
          this.oneClickFailedTarget.hidden = false
        } else {
          this.#checkPaymentIntent()
        }
      })
    }).catch(() => {
      this.oneClickErrorTarget.hidden = false
    })
  }

  // UI helpers

  #checkPaymentIntent = () => {
    if (!this.verificationAttempts) this.verificationAttempts = 0

    this.verificationErrorTarget.hidden = true

    jsonFetch(this.#intentUrl())
      .then(data => {
        if (data.state == "successful") {
          // This clears the cart
          window.location = data.orderPath
        } else if (this.verificationAttempts >= 30) {
          this.#verificationError(
            `${this.verificationAttempts} checks, state ${data.state}`
          )
        } else {
          this.verificationAttempts += 1
          setTimeout(this.#checkPaymentIntent, this.verificationAttempts * 150)
        }
      })
      .catch(this.#verificationError)
  }

  #intentUrl() {
    return `${this.data.get("intentsUrl")}/${this.transactionId}`
  }

  #verificationError = (message) => {
    this.verificationErrorTarget.hidden = false
    this.transactionIdTarget.innerText = this.transactionId
    this.verificationErrorMessageTarget.innerText = message
  }

  #rejectStripeError(result) {
    if (result.error) return Promise.reject(result.error.message)
  }
}
