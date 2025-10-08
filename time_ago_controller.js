import { Controller } from "@hotwired/stimulus"

// Time ago in words that stays up to date using the browser’s time zone.
//
// Example:
//   <time data-controller="time-ago" datetime="2020-05-18T19:22:17Z">…</time>

const UPDATE_SECONDS = 30

export default class extends Controller {
  connect() {
    this.update()

    // Update regulary
    this.interval = setInterval(this.update, UPDATE_SECONDS * 1000)

    // Update on changes in the `lang` attribute
    this.htmlObserver = new MutationObserver(this.#updateOnHtmlLangChange)
    this.htmlObserver.observe(document.documentElement, {attributes: true})
  }

  disconnect() {
    clearInterval(this.interval)
    this.htmlObserver.disconnect()
  }

  update = () => {
    const time = Date.parse(this.element.attributes.datetime.value)
    this.element.innerText = this.#timeAgoInWords(time, Date.now())
  }

  #updateOnHtmlLangChange = (mutationList) => {
    mutationList.forEach(mutation => {
      if (mutation.attributeName == "lang") this.update()
    })
  }

  #timeAgoInWords(from, to) {
    const diff = to < from ? 0 : to - from
    const minutes = diff / (60 * 1000)
    const hours = minutes / 60
    const days = hours / 24
    const months = days / 30
    const years = months / 12

    if (minutes < 60) return this.#format(-minutes, "minute")
    if (hours < 60) return this.#format(-hours, "hour")
    if (days < 30) return this.#format(-days, "day")
    if (months < 12) return this.#format(-months, "month")
    return this.#format(-years, "year")
  }

  #format(value, unit) {
    const language = document.documentElement.lang
    const formatter = new Intl.RelativeTimeFormat(language, {numeric: "auto"})
    return formatter.format(parseInt(value, 10), unit)
  }
}
