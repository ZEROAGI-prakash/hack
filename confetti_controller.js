import { Controller } from "@hotwired/stimulus"
import confetti from "canvas-confetti"

export default class extends Controller {
  connect() {
    this.dispatch("connect")
  }

  disconnect() {
    confetti.reset()
  }

  spray() {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: {y: 0.3},
      disableForReducedMotion: true,
      shapes: ["square"],
      colors: [
        "#822ef5",
        "#ad77f9",
        "#5608c4",
        "#542d81",
        "#64408c",
        "#725196",
        "#ffffff",
        "#b6b6b6",
        "#552d84",
        "#1d102d",
      ],
    })
  }
}
