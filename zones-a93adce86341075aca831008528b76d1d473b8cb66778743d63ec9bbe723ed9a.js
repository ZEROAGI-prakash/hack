let maxPubliftId = 0

const renderPublift = () => {
  const zones = document.querySelectorAll("[data-zone-publift]")
  if (zones.length == 0) return

  zones.forEach(zone => {
    let id = `publift-${zone.dataset.zonePublift}`

    if (document.getElementById(id)) {
      maxPubliftId += 1
      id = `${id}_${maxPubliftId}`
    }

    const div = document.createElement("div")
    div.id = id
    div.setAttribute("data-fuse", zone.dataset.zonePublift)
    zone.appendChild(div)
  })

  if (!document.getElementById("fuse-tag")) {
    const script = document.createElement("script")
    script.id = "fuse-tag"
    script.async = true
    script.src = "https://cdn.fuseplatform.net/publift/tags/2/3948/fuse.js"
    document.head.appendChild(script)
  }

  window.fusetag || (window.fusetag = {que: []})
  window.fusetag.que.push(() => {
    window.fusetag.pageInit()
  })
}

const clear = () => {
  document.querySelectorAll("[data-zone]").forEach(zone => zone.innerHTML = "")
}

document.addEventListener("turbo:fast-load", renderPublift)
document.addEventListener("turbo:before-cache", clear);
