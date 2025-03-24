const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json'
  }
}

function fetchApi(url: string, options: RequestInit) {
  url = import.meta.env.VITE_API_URL + url
  return fetch(url, { ...defaultOptions, ...options })
}

export const fetchPost = (query: { url: string, data?: any }) => {
  const { url, data } = query
  const body = data ? JSON.stringify(data) : undefined
  return fetchApi(url, {
    method: 'POST',
    body
  })
}

export const fetchGet = (query: { url: string }) => {
  return fetchApi(query.url, {
    method: 'GET'
  })
}

export const fetchPut = (query: { url: string, data?: any }) => {
  const { url, data } = query
  const body = data ? JSON.stringify(data) : undefined
  return fetchApi(url, {
    method: 'PUT',
    body
  })
}

export const fetchDelete = (query: { url: string }) => {
  const { url } = query
  return fetchApi(url, {
    method: 'DELETE'
  })
}


