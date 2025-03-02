const SvgModules =  import.meta.glob('./*.svg', {
  query: '?react',
  import: 'default',
  eager: true
})

for(let uri in SvgModules) {
  const matchRs = uri.match(/^.\/(.*).svg$/)
  const name = matchRs ? matchRs[1] : ''
  if (name) {
    SvgModules[name] = SvgModules[uri]
    delete SvgModules[uri]
  } else {
    SvgModules[uri] = null
  }
}

export default SvgModules