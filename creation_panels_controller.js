import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"

const activeClassName = "hide-and-seek__nav-item--active"
const activeContentClassName = "hide-and-seek__content-item--active"
const hiddenClassName = "hide-and-seek__nav-item--hidden"
const hiddenContentClassName = "hide-and-seek__content-item--hidden"
const linkIdPrefix = "hide-and-seek__nav-"

export default class extends Controller {
  static targets = ["relatedCreationsSection"]

  openCommentsPanel(event) {
    event.preventDefault()
    this.openPanel("related_comments", true)
  }

  openMakesPanel(event) {
    event.preventDefault()
    this.openPanel("related_makes", true)
  }

  openRelatedCreationsPanel(event) {
    event.preventDefault()
    this.openPanel("related_creations", true)
  }

  openPanel(name, scroll = false) {
    const panelLink = document.getElementById(`${linkIdPrefix}${name}`)

    panelLink.click()

    if (scroll) {
      panelLink.scrollIntoView({behavior: "smooth", alignTop: true})
    }
  }

  setActivePanel(event) {
    const activeLink = event.currentTarget
    const activeTitle = activeLink.parentElement
    const previousActiveTitle =
      document.querySelector(`.${activeClassName}`)
    const activeContent = activeLink.parentElement.nextElementSibling
    const previousActiveContent =
      document.querySelector(`.${activeContentClassName}`)

    if (activeTitle === previousActiveTitle) {
      event.preventDefault()

      previousActiveTitle.classList.toggle(hiddenClassName)
      previousActiveContent.classList.toggle(hiddenContentClassName)

      return
    }

    this.setActiveContent(previousActiveContent, activeContent)
    this.setActiveTitle(previousActiveTitle, activeTitle)

    const panelName = activeLink.id.replace(linkIdPrefix, "")

    this.#updateUrl(activeLink.href)
    this.#handleRelatedCreationsSection(panelName)
  }

  setActiveTitle(previousActiveTitle, activeTitle) {
    if (previousActiveTitle) {
      previousActiveTitle.classList.remove(activeClassName)
      previousActiveTitle.classList.remove(hiddenClassName)
    }

    document
      .querySelectorAll(`.${hiddenClassName}`)
      .forEach((hiddenTitle) => {
        hiddenTitle.classList.remove(hiddenClassName)
      })

    activeTitle.classList.add(activeClassName)
  }

  setActiveContent(previousActiveContent, activeContent) {
    if (previousActiveContent) {
      previousActiveContent.classList.remove(activeContentClassName)
      previousActiveContent.classList.remove(hiddenContentClassName)
      previousActiveContent.hidden = true
    }

    document
      .querySelectorAll(`.${hiddenContentClassName}`)
      .forEach((hiddenContent) => {
        hiddenContent.classList.remove(hiddenContentClassName)
        hiddenContent.hidden = true
      })

    activeContent.classList.add(activeContentClassName)
    activeContent.hidden = false
  }

  #updateUrl(url) {
    const uri = new URL(url)

    // Ugly hack to make sure Turbo saves the right snapshot (HTML output)
    // under the right URL for its internal cache for the back button
    // to work properly on the first render.
    history.pushState({}, null, url)
    Turbo.navigator.view.lastRenderedLocation = uri
    Turbo.navigator.history.replace(uri)
  }

  #handleRelatedCreationsSection(panelName) {
    this.relatedCreationsSectionTarget.hidden = panelName == "related_creations"
  }
}
