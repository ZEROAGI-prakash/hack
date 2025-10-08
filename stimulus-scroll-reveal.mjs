import { Controller as o } from "@hotwired/stimulus";
class r extends o {
  initialize() {
    this.intersectionObserverCallback = this.intersectionObserverCallback.bind(this);
  }
  connect() {
    this.class = this.classValue || this.defaultOptions.class || "in", this.threshold = this.thresholdValue || this.defaultOptions.threshold || 0.1, this.rootMargin = this.rootMarginValue || this.defaultOptions.rootMargin || "0px", this.observer = new IntersectionObserver(this.intersectionObserverCallback, this.intersectionObserverOptions), this.itemTargets.forEach((t) => this.observer.observe(t));
  }
  disconnect() {
    this.itemTargets.forEach((t) => this.observer.unobserve(t));
  }
  intersectionObserverCallback(t, i) {
    t.forEach((e) => {
      if (e.intersectionRatio > this.threshold) {
        const s = e.target;
        s.classList.add(...this.class.split(" ")), s.dataset.delay && (s.style.transitionDelay = s.dataset.delay), i.unobserve(s);
      }
    });
  }
  get intersectionObserverOptions() {
    return {
      threshold: this.threshold,
      rootMargin: this.rootMargin
    };
  }
  get defaultOptions() {
    return {};
  }
}
r.targets = ["item"];
r.values = {
  class: String,
  threshold: Number,
  rootMargin: String
};
export {
  r as default
};
