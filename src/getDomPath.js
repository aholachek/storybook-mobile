function getDomPath(el) {
  var stack = []
  while (el.parentNode) {
    let sibCount = 0
    let sibIndex = 0
    for (var i = 0; i < el.parentNode.childNodes.length; i++) {
      var sib = el.parentNode.childNodes[i]
      if (sib.nodeName === el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount
        }
        sibCount++
      }
    }
    if (el.hasAttribute('id') && el.id !== '') {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id)
    } else if (el.classList.toString() !== '' && el.tagName !== 'BODY') {
      stack.unshift(el.nodeName.toLowerCase() + '.' + el.classList.toString())
    } else if (sibCount > 1) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')')
    } else {
      stack.unshift(el.nodeName.toLowerCase())
    }
    el = el.parentNode
  }
  const toFilter = ['html', 'body', 'div#root']
  return stack.filter((el) => !toFilter.includes(el)).join(' > ')
}

export default getDomPath
