const injectScript = (src, beforeInsert) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.setAttribute("src", src)
    script.addEventListener("load", resolve)
    script.addEventListener(
      "error",
      e => {
        const message = e.error ? ` (${e.error})` : ""
        reject(`Script load error${message}`)
      },
    )

    if (beforeInsert) beforeInsert(script)

    document.head.appendChild(script)
  })
}

export { injectScript }
