import URIParser from 'url'

function parseURI(uri: string) {
  const decodedURI = decodeURI(uri)

  return decodedURI ? URIParser.parse(decodedURI, true) : null
}

export function getURIParams(uri: string) {
  const parsedURI = parseURI(uri)

  return parsedURI ? parsedURI.query : null
}

export function getURIHash(uri: string) {
  const parsedURI = parseURI(uri)

  return parsedURI ? parsedURI.hash : null
}

export function getURIHashParams(uri: string) {
  const hash = getURIHash(uri)

  if (!hash) {
    return null
  }

  const hashContent = hash.replace('#', '')

  return hash ? getURIParams(`https://mydomain.com/?${hashContent}`) : null
}

export function appendHashOnURI(uri: string, hash: string) {
  const parsedUrl = parseURI(uri)

  if (!parsedUrl) {
    return null
  }

  const { protocol, host, path, query } = parsedUrl

  return buildUri(protocol, host, path, query, hash)
}

export function getURIHost(uri: string) {
  const parsedURI = parseURI(uri)

  return parsedURI ? parsedURI.host : null
}

export function getURIProtocol(uri: string) {
  const parsedURI = parseURI(uri)

  return parsedURI ? parsedURI.protocol.replace(':', '') : null
}

export function convertDictionaryToQueryString(
  obj: Record<string, string | number>
) {
  if (!obj) return ''

  const str: string[] = []

  for (const p in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(p)) {
      str.push(
        `${window.encodeURIComponent(p)}=${window.encodeURIComponent(obj[p])}`
      )
    }
  }

  return str.join('&')
}

// eslint-disable-next-line max-params
export function buildUri(
  protocol: string,
  host: string,
  path: string,
  query: Record<string, string>,
  hash: string
) {
  return URIParser.format({
    protocol,
    host,
    hash,
    pathname: path,
    query,
    slashes: true,
  })
}

export function addParamToQueryString(uri, key, value) {
  const parsedURIObj = parseURI(uri)

  if (!parsedURIObj) {
    return null
  }

  const parsedURI = {
    host: parsedURIObj.host,
    port: parsedURIObj.port,
    pathname: parsedURIObj.pathname,
    protocol: parsedURIObj.protocol,
    query: parsedURIObj.query,
    slashes: true,
    hash: '',
  }

  parsedURI.query = Object.assign(parsedURI.query, { [key]: value })

  return URIParser.format(parsedURI)
}
