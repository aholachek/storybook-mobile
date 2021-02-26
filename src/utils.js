import getDomPath from './getDomPath'
import {createScheduler} from 'lrt'

const getElements = (container, tag) =>
  Array.from(container.querySelectorAll(tag))

const getStylesheetRules = (sheets, k) => {
  let rules = []
  try {
    rules = sheets[k].rules || sheets[k].cssRules
  } catch (e) {
    //
  }
  return rules
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
    return (!!textInputs.find((type) => currentType === type) && !autocomplete)
  })
  return attachLabels(warnings, container)
}

export const getInputTypeNumberWarnings = (container) => {
  const inputs = getElements(container, 'input[type="number"]')
  return attachLabels(inputs)
}

export const getInputTypeWarnings = (container) => {
  const inputs = getElements(container, 'input[type="text"]')
    .concat(getElements(container, 'input:not([type])'))
    .filter((input) => !input.getAttribute('inputmode'))
  return attachLabels(inputs, container)
}

const isInside = (dangerZone, boundingBox) => {
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
        .filter(([el, boundingBox]) => {
          if (el === el1) return false
          if (isInside(dangerZone, boundingBox)) {
            return el
          }
          return false
        })

      return { close: close ? close : null, el: el1, boundingBox: bounding1 }
    })

  const underMinSize = elsWithClose.filter(
    ({ boundingBox: { width, height } }) => {
      return width < minSize || height < minSize
    }
  )

  const tooClose = elsWithClose.filter(({ close }) => {
    return close && close.length
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

function* activeIterator(container) {
  const buttons = getElements(container, 'button').concat(
    getElements(container, '[role="button"]')
  )
  const links = getElements(container, 'a')
  const elements = buttons.concat(links)
  const len = elements.length
  const result = []

  for (let i = 0; i < len; i++) {
    const el = elements[i]
    const hasActive = getActiveStyles(container, el);
    if (hasActive) {
      result.push({
        type: getNodeName(el),
        text: el.innerText,
        html: el.innerHTML,
        path: getDomPath(el),
      });
    }
    yield
  }

  return result
}

export const getActiveWarnings = (container) => {
  const scheduler = createScheduler()
  const task = scheduler.runTask(activeIterator(container))
  return {abortTask: () => scheduler.abortTask(task), task}
}

export const getOriginalStyles = (container, el) => {
  const sheets = container.styleSheets
  let result = []
  Object.keys(sheets).forEach((k) => {
    const rules = getStylesheetRules(sheets, k)
    rules.forEach((rule) => {
      if (rule) {
        try {
          if (el.matches(rule.selectorText)) {
            result.push(rule.cssText)
          }
        } catch (e) {
          // catch errors in safari
        }
      }
    })
  })
  return result
}

function* vhIterator(container) {
  const elements = getElements(container, '#root *')
  const len = elements.length
  const result = []

  for (let i = 0; i < len; i++) {
    const el = elements[i]
    const styles = getOriginalStyles(container, el)
    const vhWarning = styles.find((style) => /100vh/.test(style))
    if (vhWarning) {
      result.push( { el, css: vhWarning, path: getDomPath(el) })
    }
    yield
  }
  return result
}

export const get100vhWarnings = (container) => {
  const scheduler = createScheduler()
  const task = scheduler.runTask(vhIterator(container))
  return {abortTask: () => scheduler.abortTask(task), task}
}

export const getFastWarnings = ({
  container,
  minSize,
  recommendedSize,
  recommendedDistance,
}) => ({
  tapHighlight: getTapHighlightWarnings(container),
  autocomplete: getAutocompleteWarnings(container),
  inputType: getInputTypeWarnings(container),
  srcset: getSrcsetWarnings(container),
  backgroundImg: getBackgroundImageWarnings(container),
  inputTypeNumber: getInputTypeNumberWarnings(container),
  touchTarget: getTouchTargetSizeWarning({
    container,
    minSize,
    recommendedSize,
    recommendedDistance,
  }),
  // tooWide: getTooWideWarnings(container),
})
