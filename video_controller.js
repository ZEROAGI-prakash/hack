import "youtube-video-js"

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["youtubeIframe"]

  pause() {
    this.youtubeIframeTarget.pause()
  }
}
