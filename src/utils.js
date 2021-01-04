import getDomPath from './getDomPath'

const getElements = (container, tag) =>
  Array.from(container.querySelectorAll(tag))

const getStylesheetRules = (sheets, k) => {
  try {
    const rules = sheets[k].rules || sheets[k].cssRules
    return rules
  } catch (e) {
    return []
  }
}

const getNodeName = (el) =>
  el.nodeName === 'A'
    ? 'a'
    : el.nodeName === 'BUTTON'
    ? 'button'
    : `${el.nodeName.toLowerCase()}[role="button"]`

export const getActiveStyles = function (container, el) {
  const sheets = container.styleSheets
  const result = []

  const activeRegex = /:active$/

  Object.keys(sheets).forEach((k) => {
    getStylesheetRules(sheets, k).forEach((rule) => {
      if (!rule) return
      if (!rule.selectorText || !rule.selectorText.match(activeRegex)) return
      const ruleNoPseudoClass = rule.selectorText.replace(activeRegex, '')
      try {
        if (el.matches(ruleNoPseudoClass)) {
          result.push(rule)
        }
      } catch (e) {
        // safari
      }
    })
  })
  return result.length ? result : null
}

export const getActiveWarnings = (container) => {
  const buttons = getElements(container, 'button').concat(
    getElements(container, '[role="button"]')
  )
  const links = getElements(container, 'a')

  return buttons
    .concat(links)
    .map((el) => [el, getActiveStyles(container, el)])
    .filter((tup) => tup[1])
    .map(([el]) => {
      return {
        type: getNodeName(el),
        text: el.innerText,
        html: el.innerHTML,
        path: getDomPath(el),
      }
    })
}

export const getTapHighlightWarnings = (container) => {
  const buttons = getElements(container, 'button').concat(
    getElements(container, '[role="button"]')
  )
  const links = getElements(container, 'a')

  const filterActiveStyles = (el) => {
    const tapHighlight = getComputedStyle(el)['-webkit-tap-highlight-color']
    if (tapHighlight === 'rgba(0, 0, 0, 0)') return true
  }

  return buttons
    .concat(links)
    .filter(filterActiveStyles)
    .map((el) => ({
      type: getNodeName(el),
      text: el.innerText,
      html: el.innerHTML,
      path: getDomPath(el),
    }))
}

const maxWidth = 600

export const getSrcsetWarnings = (container) => {
  const images = getElements(container, 'img')

  const warnings = images
    .filter((img) => {
      const src = img.getAttribute('src')
      const srcSet = img.getAttribute('srcset')
      if (srcSet || !src) return false
      const isSVG = Boolean(src.match(/svg$/))
      if (isSVG) return false
      const isLarge =
        parseInt(getComputedStyle(img).width, 10) > maxWidth ||
        img.naturalWidth > maxWidth
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

export const getBackgroundImageWarnings = (container) => {
  const backgroundImageRegex = /url\(".*?(.png|.jpg|.jpeg)"\)/
  const elsWithBackgroundImage = getElements(container, '#root *').filter(
    (el) => {
      const style = getComputedStyle(el)
      if (
        style['background-image'] &&
        backgroundImageRegex.test(style['background-image']) &&
        // HACK
        // ideally, we would make a new image element and check its "naturalWidth"
        // to get a better idea of the size of the background image, this is a hack
        el.clientWidth > 200
      ) {
        return true
      }
    }
  )

  if (!elsWithBackgroundImage.length) return []

  const styleDict = new Map()

  const sheets = container.styleSheets
  Object.keys(sheets).forEach((k) => {
    getStylesheetRules(sheets, k).forEach((rule) => {
      if (!rule) return
      try {
        elsWithBackgroundImage.forEach((el) => {
          if (el.matches(rule.selectorText)) {
            styleDict.set(el, (styleDict.get(el) || []).concat(rule))
          }
        })
      } catch (e) {
        // catch errors in safari
      }
    })
  })

  const responsiveBackgroundImgRegex = /-webkit-min-device-pixel-ratio|min-resolution|image-set/

  const filteredEls = [...styleDict.entries()]
    .map(([el, styles]) => {
      if (!styles) return false
      const requiresResponsiveWarning = styles.reduce((acc, curr) => {
        if (acc === false) return acc
        if (responsiveBackgroundImgRegex.test(curr)) return false
        return true
      }, true)
      return requiresResponsiveWarning ? el : false
    })
    .filter(Boolean)
    .map((el) => {
      const bg = getComputedStyle(el).backgroundImage
      const src = bg.match(/url\("(.*)"\)/)
        ? bg.match(/url\("(.*)"\)/)[1]
        : undefined
      return {
        path: getDomPath(el),
        src,
      }
    })

  return filteredEls
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
      const label = container.querySelector(`label[for="${input.id}"]`)
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

export const getInputTypeNumberWarnings = (container) => {
  const inputs = getElements(container, 'input[type="number"]')
  return attachLabels(inputs)
}

export const getOriginalStyles = function (container, el) {
  const sheets = container.styleSheets
  const result = []
  Object.keys(sheets).forEach((k) => {
    getStylesheetRules(sheets, k).forEach((rule) => {
      if (!rule) return
      try {
        if (el.matches(rule.selectorText)) {
          result.push(rule)
        }
      } catch (e) {
        // catch errors in safari
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
  const inputs = getElements(container, 'input[type="text"]')
    .concat(getElements(container, 'input:not([type])'))
    .filter((input) => !input.getAttribute('inputmode'))
  return attachLabels(inputs, container)
}

const isInside = (dangerZone, [, boundingBox]) => {
  return (
    boundingBox.top <= dangerZone.bottom &&
    boundingBox.bottom >= dangerZone.top &&
    boundingBox.left <= dangerZone.right &&
    boundingBox.right >= dangerZone.left
  )
}
export const getTouchTargetSizeWarning = ({
  container,
  minSize,
  recommendedDistance,
}) => {
  const els = getElements(container, 'button')
    .concat(getElements(container, '[role="button"]'))
    .concat(getElements(container, 'a'))
    .map((el) => [el, el.getBoundingClientRect()])

  const suspectEls = new Set([...els])

  const elsWithClose = els
    .map(([el1, bounding1]) => {
      const dangerZone = {
        top: bounding1.top - recommendedDistance,
        left: bounding1.left - recommendedDistance,
        right: bounding1.right + recommendedDistance,
        bottom: bounding1.bottom + recommendedDistance,
      }

      const close = Array.from(suspectEls)
        .filter((el) => {
          if (isInside(dangerZone, el)) {
            return el
          }
          return false
        })

      if (!close.length) {
        suspectEls.delete(el1)
        return false
      }
      return { close: close ? close : null, el: el1, boundingBox: bounding1 }
    })

  const underMinSize = elsWithClose.filter(
    ({ boundingBox: { width, height } }) => {
      return width < minSize || height < minSize
    }
  )

  const tooClose = elsWithClose.filter(({ close }) => {
    return close.length
  })

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

export const getTooWideWarnings = (container) => {
  const containerWidth = container.body.clientWidth
  const allElements = getElements(container, '#root *')
  return allElements
    .filter((el) => {
      return el.clientWidth > containerWidth
    })
    .map((el) => {
      return {
        el,
        path: getDomPath(el),
      }
    })
}
