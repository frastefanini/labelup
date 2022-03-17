export function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search)

  if (params) {
    return params.get(name)
  }

  return null
}

export function reload() {
  if (window.location) {
    window.location.reload()
  }
}
