import { addBubbleListener } from "helpers/add_bubble_listener"

addBubbleListener("keydown", "[data-checkable]", e => {
  if (e.code == "Enter" || e.code == "Space") {
    e.preventDefault()

    const input = document.getElementById(e.target.htmlFor)
    input.checked = true

    // Dispatch click event so other handlers can pick up the change
    const event = document.createEvent("HTMLEvents")
    event.initEvent("click", true, true)
    input.dispatchEvent(event)
  }
});
