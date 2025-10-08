const htmlFetch = async (url, { headers, body, ...options } = {}) => {
  options = {
    headers: new Headers({
      Accept: "text/html",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-Token": csrfToken(),
      ...headers,
    }),
    credentials: "same-origin",
    body: body && JSON.stringify(body),
    ...options,
  }

  const response = await fetch(url, options)
  return response.ok ? response.text() : Promise.reject(response)
}

const turboFetch = (url, {headers, ...options} = {}) => {
  return htmlFetch(url, {
    headers: {
      Accept: "text/vnd.turbo-stream.html",
      ...headers,
    },
    ...options,
  }).then(html => document.body.insertAdjacentHTML("afterend", html))
}

const csrfToken = () => {
  return document.querySelector("meta[name=\"csrf-token\"]").content
}

export { htmlFetch, turboFetch }
