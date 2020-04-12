import getDomPath from './getDomPath'

export const getActiveStyles = function (container, el) {
  const sheets = container.styleSheets
  const result = []

  const activeRegex = /:active$/

  Object.keys(sheets).forEach((k) => {
    const rules = sheets[k].rules || sheets[k].cssRules
    rules.forEach((rule) => {
      if (!rule.selectorText.match(activeRegex)) return
      const ruleNoPseudoClass = rule.selectorText.replace(activeRegex, '')
      if (el.matches(ruleNoPseudoClass)) {
        result.push(rule)
      }
    })
  })
  return result.length ? result : null
}

const getElements = (container, tag) => [...container.querySelectorAll(tag)]

export const getActiveWarnings = (container) => {
  const buttons = getElements(container, 'button')
  const links = getElements(container, 'a')

  const filterActiveStyles = (el) => {
    const activeStyles = getActiveStyles(container, el)
    if (activeStyles) return false
    return true
  }
  return buttons
    .concat(links)
    .filter(filterActiveStyles)
    .map((el) => ({
      type: el.nodeName === 'A' ? 'Link' : 'Button',
      text: el.innerText,
      path: getDomPath(el),
    }))
}

export const getSrcsetWarnings = (container) => {
  const images = getElements(container, 'img')

  const warnings = images
    .filter((img) => {
      const src = img.getAttribute('src')
      const srcSet = img.getAttribute('srcset')
      if (srcSet) return false
      const isSVG = Boolean(src.match(/svg$/))
      if (isSVG) return false
      const isLarge =
        parseInt(getComputedStyle(img).width, 10) > 300 ||
        img.naturalWidth > 300
      if (!isLarge) return false
      return true
    })
    .map((img) => {
      return {
        src: img.src,
        path: getDomPath(img),
        alt: img.alt,
      }
    })
  return warnings
}

const textInputs = [
  'text',
  'search',
  'tel',
  'url',
  'email',
  'number',
  'password',
]

const attachLabels = (inputs, container) => {
  return inputs.map((input) => {
    let labelText = ''
    if (input.parentElement.nodeName === 'LABEL')
      labelText = input.parentElement.innerText
    if (input.id) {
      const label = container.querySelector(`label for="${input.id}"`)
      if (label) labelText = label.innerText
    }
    return {
      path: getDomPath(input),
      labelText,
      type: input.type,
    }
  })
}

export const getAutocompleteWarnings = (container) => {
  const inputs = getElements(container, 'input')
  const warnings = inputs.filter((input) => {
    const currentType = input.getAttribute('type')
    const autocomplete = input.getAttribute('autocomplete')
    if (textInputs.find((type) => currentType === type) && !autocomplete) {
      return true
    }
    return false
  })
  return attachLabels(warnings, container)
}

export const getOverflowAutoWarnings = (container) => {
  return getElements(container, '#root *')
    .filter((el) => {
      const style = getComputedStyle(el)
      if (style.overflow === 'scroll' || style.overflow === 'auto') {
        if (style['-webkit-overflow-scrolling'] !== 'touch') {
          return true
        }
      }
      return false
    })
    .map((el) => ({
      path: getDomPath(el),
    }))
}

export const getOriginalStyles = function (container, el) {
  const sheets = container.styleSheets
  const result = []
  Object.keys(sheets).forEach((k) => {
    const rules = sheets[k].rules || sheets[k].cssRules
    rules.forEach((rule) => {
      if (el.matches(rule.selectorText)) {
        result.push(rule)
      }
    })
  })
  return result.length ? result : null
}

export const get100vhWarning = (container) => {
  return getElements(container, '#root *')
    .map((el) => {
      const styles = getOriginalStyles(container, el)
      if (!styles) return false
      const hasVHWarning = styles.find((style) => /100vh/.test(style.cssText))
      if (hasVHWarning) return { el, css: hasVHWarning.cssText }
      return null
    })
    .filter(Boolean)
    .map((data) => ({
      ...data,
      path: getDomPath(data.el),
    }))
}

export const getInputTypeWarnings = (container) => {
  const inputs = getElements(container, 'input[type="text"]').filter(
    (input) => !input.getAttribute('inputmode')
  )
  return attachLabels(inputs, container)
}

const minSize = 40

export const getTouchTargetSizeWarning = (container) => {
  const buttons = getElements(container, 'button')
  const links = getElements(container, 'a')
  const tooSmall = (el) => {
    const { width, height } = el.getBoundingClientRect()
    if (width < minSize || height < minSize) {
      return {
        type: el.nodeName === 'A' ? 'Link' : 'Button',
        path: getDomPath(el),
        text: el.innerText,
        width: Math.floor(width),
        height: Math.floor(height),
      }
    }
    return null
  }
  const tooSmallButtons = buttons.map(tooSmall).filter(Boolean)
  const tooSmallLinks = links.map(tooSmall).filter(Boolean)
  return tooSmallButtons.concat(tooSmallLinks)
}
