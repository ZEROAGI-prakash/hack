const outlineOn = () => document.documentElement.classList.add("outline-on")
const outlineOff = () => document.documentElement.classList.remove("outline-on")

// Enable the outline once the keyboard has been used.
document.addEventListener("keydown", outlineOn)

// Disable the outline once the mouse has been moved or the user is gone.
document.addEventListener("mousedown", outlineOff)
document.addEventListener("blur", outlineOff);
