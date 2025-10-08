const isIpad = () => {
  return navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform)
}

const isSafari = () => {
  return (
    !!navigator.userAgent.match(/safari/i) &&
    !navigator.userAgent.match(/chrome/i) &&
    typeof document.body.style.webkitFilter !== "undefined" &&
    !window.chrome
  )
}

const safariAccept = (accept) => {
  if (isIpad()) return null
  if (isSafari()) return accept.replace(/\.bmp,/gi, "")
  return accept
}

export { isSafari, safariAccept };
