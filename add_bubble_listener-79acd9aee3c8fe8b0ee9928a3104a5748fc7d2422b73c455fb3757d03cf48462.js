const addBubbleListener = (event, selector, callback) => {
  document.addEventListener(event, (e) => {
    let target = e.target
    while (target) {
      if (target.matches(selector)) return callback(e)
      target = target.parentElement
    }
  }, false)
}

export { addBubbleListener };
