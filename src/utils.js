import getDomPath from './getDomPath'

export const getActiveStyles = function (container, el) {
  const sheets = container.styleSheets
  const result = []

  const activeRegex = /:active$/

  Object.keys(sheets).forEach((k) => {
    const rules = sheets[k].rules || sheets[k].cssRules
    rules.forEach((rule) => {
      if (!rule) return
      if (!rule.selectorText || !rule.selectorText.match(activeRegex)) return
      const ruleNoPseudoClass = rule.selectorText.replace(activeRegex, '')
      if (el.matches(ruleNoPseudoClass)) {
        result.push(rule)
      }
    })
  })
  return result.length ? result : null
}

const getElements = (container, tag) =>
  Array.from(container.querySelectorAll(tag))

export const getActiveWarnings = (container) => {
  const buttons = getElements(container, 'button').concat(
    getElements(container, '[role="button"]')
  )
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
      type:
        el.nodeName === 'A'
          ? 'a'
          : el.nodeName === 'BUTTON'
          ? 'button'
          : `${el.nodeName.toLowerCase()}[role="button"]`,
      text: el.innerText,
      html: el.innerHTML,
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
    if (input.labels && input.labels[0]) {
      labelText = input.labels[0].innerText
    } else if (input.parentElement.nodeName === 'LABEL')
      labelText = input.parentElement.innerText
    else if (input.id) {
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
      if (!rule) return
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

export const getTouchTargetSizeWarning = ({
  container,
  minSize,
  recommendedSize,
  recommendedDistance,
}) => {
  const els = getElements(container, 'button')
    .concat(getElements(container, '[role="button"]'))
    .concat(getElements(container, 'a'))
    .map((el) => [el, el.getBoundingClientRect()])

  const elsWithClose = els.map(([el1, bounding1], i1) => {
    const close = els.filter(([, bounding2], i2) => {
      if (i2 === i1) return
      if (
        bounding2.right - bounding1.left < recommendedDistance ||
        bounding2.bottom - bounding1.top < recommendedDistance ||
        bounding1.right - bounding2.left < recommendedDistance ||
        bounding1.bottom - bounding2.bottom < recommendedDistance
      ) {
        return true
      }
    })
    return { close: close ? close : null, el: el1, boundingBox: bounding1 }
  })

  const underMinSize = elsWithClose.filter(
    ({ boundingBox: { width, height } }) => {
      return width < minSize || height < minSize
    }
  )

  const tooClose = elsWithClose.filter(
    ({ boundingBox: { width, height }, close }) => {
      return (
        close.length && (width < recommendedSize || height < recommendedSize)
      )
    }
  )

  const present = ({ el, boundingBox: { width, height }, close }) => {
    return {
      type:
        el.nodeName === 'A'
          ? 'a'
          : el.nodeName === 'BUTTON'
          ? 'button'
          : `${el.nodeName.toLowerCase()}[role="button"]`,
      path: getDomPath(el),
      text: el.innerText,
      html: el.innerHTML,
      width: Math.floor(width),
      height: Math.floor(height),
      close,
    }
  }

  return {
    underMinSize: underMinSize.map(present),
    tooClose: tooClose.map(present),
  }
}
