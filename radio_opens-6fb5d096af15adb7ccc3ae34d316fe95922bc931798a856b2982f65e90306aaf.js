import { addBubbleListener } from "helpers/add_bubble_listener"

// Listens to radio inputs to trigger the showing or hiding of another element.
//
// When checked, the attached element will be shown and all other radio
// inputs with the same name will have their attached element hidden.
//
// Example:
//
//     <input type=radio name=agree data-radio-opens="#yes" checked /> Yes
//     <input type=radio name=agree data-radio-opens="#no" /> No
//
//     <div id="yes">Then you agree</div>
//     <div id="no">Then you disagree</div>
//
// Checking the "No" radio button hides "Then you agree" and shows "Then you
// disagree".

const updateCheck = (element, open) => {
  const targets = document.querySelectorAll(element.dataset.radioOpens)
  targets.forEach(target => {
    target.style.display = open ? "block" : "none"
    target.setAttribute("aria-hidden", open ? "false" : "true")
    target.querySelectorAll("input, textarea, select").forEach(input => {
      input.disabled = !open
    })
  })
}

const open = (element) => {
  const siblings = document.querySelectorAll(`input[name='${element.name}']`)
  siblings.forEach(sibling => updateCheck(sibling, sibling == element))
}

addBubbleListener("click", "[data-radio-opens]", e => open(e.target))

document.addEventListener("turbo:load", () => {
  document.querySelectorAll("[data-radio-opens]:checked").forEach(open)
});
