import { Controller } from "@hotwired/stimulus"
import { turboFetch } from "../helpers/html_fetch"

// The theme-name meta can only be: "light", "dark".
// The color-scheme meta can be: "light dark", "light", "dark".
// The themes can be: "auto", "light", "dark".

export default class extends Controller {
  static targets = ["nameMeta", "schemeMeta"]

  static values = {
    updateUrl: String,
  }

  connect() {
    // Ensure theme is up to date when this element is replaced on the page.
    this.#applyTheme()

    // If the preferred browser scheme changes, update the name meta on "auto".
    this.media = window.matchMedia("(prefers-color-scheme: dark)")
    this.media.addEventListener("change", this.#updateNameMetaFromBrowser)
  }

  disconnect() {
    this.media.removeEventListener("change", this.#updateNameMetaFromBrowser)
  }

  // Click on a specific theme
  chooseTheme(e) {
    this.#updateTheme(e.target.value)
  }

  // Toggle between dark/light themes.
  toggleTheme() {
    const theme = this.nameMetaTarget.content == "dark" ? "light" : "dark"
    this.#updateTheme(theme)
  }

  #updateTheme(theme) {
    // Update theme name meta
    this.nameMetaTarget.content = theme

    // Update color scheme meta
    this.schemeMetaTarget.content = this.#themeToScheme(theme)
    this.#saveTheme(theme)
    this.#applyTheme()
  }

  #applyTheme() {
    const theme = this.#schemeToTheme(this.schemeMetaTarget.content)

    const themes = ["auto", "light", "dark"]
    const classes = document.documentElement.classList
    themes.forEach(t => classes.toggle(`theme-${t}`, t == theme))

    this.#updateNameMetaFromBrowser()
  }

  // We find the theme-name from the color-scheme meta and the browser’s
  // preferred color scheme.
  #updateNameMetaFromBrowser = () => {
    if (this.schemeMetaTarget.content != "light dark") return
    if (!window.matchMedia) return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    this.nameMetaTarget.content = media.matches ? "dark" : "light"
  }

  #schemeToTheme(scheme) {
    return scheme == "light dark" ? "auto" : scheme
  }

  #themeToScheme(theme) {
    return theme == "auto" ? "light dark" : theme
  }

  #saveTheme(theme) {
    if (!this.updateUrlValue) return

    turboFetch(this.updateUrlValue, {
      method: "PUT",
      body: {option: {value: theme}},
    })
  }
}
