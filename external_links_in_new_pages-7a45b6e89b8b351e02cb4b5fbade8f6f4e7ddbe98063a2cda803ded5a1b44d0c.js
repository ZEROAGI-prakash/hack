document.addEventListener("turbo:load", () => {
  for (const link of document.links) {
    if (!link.href) return
    if (link.rel != "") return
    if (link.target != "") return

    if (
      link.hostname == window.location.hostname &&
      !link.href.match(/\.pdf$/)
    ) return

    link.rel = "noopener"
    link.target = "_blank"
  }
});
