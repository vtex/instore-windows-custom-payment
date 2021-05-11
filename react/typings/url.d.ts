declare module 'url' {
  export type ParsedUrl = {
    protocol: string
    slashes: string
    auth: string
    host: string
    port: string
    hostname: string
    hash: string
    search: string
    query: Record<string, string>
    pathname: string
    path: string
    href: string
  }

  type URIParserType = {
    parse: (
      url: string,
      parseQueryString?: boolean,
      slashesDenoteHost?: string
    ) => ParsedUrl

    format: (params: {
      protocol: string
      host: string
      hash: string
      pathname: string
      query: Record<string, string>
      slashes: boolean
    }) => string
  }

  const URIParser: URIParserType

  export default URIParser
}
