// https://gist.github.com/leastbad/660876c18a3ea282d2d3aebf73a518b1

import { addBubbleListener } from "helpers/add_bubble_listener"

const turboDisabled = "[data-turbo=\"false\"]"
const isTurboDisabled = (e) => e.target.matches(turboDisabled)

const changing = (e) => {
  if (isTurboDisabled(e)) return
  document.documentElement.classList.add("page-change")
}

const changed = () => document.documentElement.classList.remove("page-change")

// Page about to change
document.addEventListener("turbo:visit", changing)
document.addEventListener("ajax:beforeSend", changing)
document.addEventListener("submit", changing)
document.addEventListener("cults:loading", changing)

// Page done changing
document.addEventListener("turbo:before-fetch-response", changed)
document.addEventListener("submit-end", changed)
document.addEventListener("turbo:load", changed)
document.addEventListener("ajax:complete", changed)
document.addEventListener("cults:loaded", changing)
addBubbleListener("click", turboDisabled, changed);
