import { Controller } from "@hotwired/stimulus"

// Localize a date in the current language and time zone.
//
// Example:
//
//   <time data-controller="time-format" datetime="2020-05-18T19:22:17Z">
//     2020-05-18 19:22 UTC
//   </time>
//
// In language `es` and time zone `America/New_York` would change the DOM to:
//
//   <time data-controller="time-format" datetime="2020-05-18T19:22:17Z">
//     18 de mayo de 2020, 15:22 GMT-4
//   </time>
//
// You can use the `data-time-format-template-value="date"` attribute to only
// show dates. In the previous example, this would show:

//   <time
//     data-controller="time-format"
//     data-time-format-template-value="date"
//     datetime="2020-05-18T19:22:17Z"
//   >
//     18 de mayo de 2020
//   </time>
export default class extends Controller {
  static values = {template: String}

  connect() {
    // Listen for changes in the `lang` attribute.
    this.htmlObserver = new MutationObserver(this.#updateOnHtmlLangChange)
    this.htmlObserver.observe(document.documentElement, {attributes: true})

    this.update()
  }

  update() {
    const language = document.documentElement.lang
    const time = Date.parse(this.element.attributes.datetime.value)
    const options = this.#options()
    const formatted = new Intl.DateTimeFormat(language, options).format(time)
    this.element.innerText = formatted
  }

  #options() {
    if (this.hasTemplateValue && this.templateValue == "date") {
      return {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    } else {
      return {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
      }
    }
  }

  #updateOnHtmlLangChange = (mutationList) => {
    mutationList.forEach(mutation => {
      if (mutation.attributeName == "lang") this.update()
    })
  }
}
