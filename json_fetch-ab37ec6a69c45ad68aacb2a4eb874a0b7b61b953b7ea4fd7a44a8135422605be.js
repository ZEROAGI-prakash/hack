const jsonFetch = async (url, {headers, body, ...options} = {}) => {
  options = {
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-Token": csrfToken(),
      ...headers,
    }),
    credentials: "same-origin",
    body: body && JSON.stringify(body),
    ...options
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    return rejectResponse(response)
  } else if (response.status == 204) {
    return response
  } else {
    return response.json()
  }
}

const csrfToken = () => {
  return document.querySelector("meta[name=\"csrf-token\"]").content
}

const rejectResponse = async (response) => {
  const text = await response.text()

  return Promise.reject({
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    responseText: response.statusText,
    responseJSON: tryParsing(text),
  })
}

const tryParsing = (text) => {
  try {
    return JSON.parse(text)
  } catch (_e) {
    return null
  }
}

export { jsonFetch };
