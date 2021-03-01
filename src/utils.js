import getDomPath from './getDomPath'
import { createScheduler } from 'lrt'

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

const attachLabels = (inputs, container) =>
  inputs.map((input) => {
    let labelText = ''
    if (input.labels && input.labels[0]) {
      labelText = input.labels[0].innerText
    } else if (input.parentElement.nodeName === 'LABEL') {
      labelText = input.parentElement.innerText
    } else if (input.id) {
      const label = container.querySelector(`label[for="${input.id}"]`)
      if (label) labelText = label.innerText
    }
    return {
      labelText,
      path: getDomPath(input),
      type: input.type,
    }
  })

const textInputs = {
  text: true,
  search: true,
  tel: true,
  url: true,
  email: true,
  number: true,
  password: true,
}

const getAutocompleteWarnings = (container) => {
  const inputs = getElements(container, 'input')
  const warnings = inputs.filter((input) => {
    const currentType = input.getAttribute('type')
    const autocomplete = input.getAttribute('autocomplete')
    return textInputs[currentType] && !autocomplete
  })
  return attachLabels(warnings, container)
}

const getInputTypeNumberWarnings = (container) => {
  const inputs = getElements(container, 'input[type="number"]')
  return attachLabels(inputs)
}

const getInputTypeWarnings = (container) => {
  const inputs = getElements(container, 'input[type="text"]')
    .concat(getElements(container, 'input:not([type])'))
    .filter((input) => !input.getAttribute('inputmode'))
  return attachLabels(inputs, container)
}

export const getInstantWarnings = (container) => ({
  autocomplete: getAutocompleteWarnings(container),
  inputType: getInputTypeWarnings(container),
  inputTypeNumber: getInputTypeNumberWarnings(container),
})

// SCHEDULED ANALYSES
// We schedule these so the UI does not lock up while they're running

const isInside = (dangerZone, bounding) =>
  bounding.top <= dangerZone.bottom &&
  bounding.bottom >= dangerZone.top &&
  bounding.left <= dangerZone.right &&
  bounding.right >= dangerZone.left

const toPresent = ({ el, bounding: { width, height }, close }) => ({
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
})

export const MIN_SIZE = 32
export const RECOMMENDED_DISTANCE = 8
//const RECOMMENDED_SIZE = 48

const checkMinSize = ({ height, width }) =>
  height < MIN_SIZE || width < MIN_SIZE

function* getTouchTargetSizeWarning(container) {
  const elements = getElements(container, 'button')
    .concat(getElements(container, '[role="button"]'))
    .concat(getElements(container, 'a'))

  const suspectElements = Array.from(new Set(elements)).map((el) => [
    el,
    el.getBoundingClientRect(),
  ])

  const len = elements.length
  const underMinSize = []
  const tooClose = []

  for (let i = 0; i < len; i++) {
    const el = elements[i]
    const bounding = el.getBoundingClientRect()

    const dangerZone = {
      top: bounding.top - RECOMMENDED_DISTANCE,
      left: bounding.left - RECOMMENDED_DISTANCE,
      right: bounding.right + RECOMMENDED_DISTANCE,
      bottom: bounding.bottom + RECOMMENDED_DISTANCE,
    }

    const close = suspectElements.filter(
      ([susEl, susBounding]) =>
        susEl !== el && isInside(dangerZone, susBounding)
    )

    const isUnderMinSize = checkMinSize(bounding)
    if (isUnderMinSize || close.length > 0) {
      const present = toPresent({ el, bounding, close })
      if (isUnderMinSize) {
        underMinSize.push(present)
      }
      if (close.length > 0) {
        tooClose.push(present)
      }
    }
    yield i
  }

  return { tooClose, underMinSize }
}

function* getTapHighlightWarnings(container) {
  const buttons = getElements(container, 'button').concat(
    getElements(container, '[role="button"]')
  )
  const links = getElements(container, 'a')
  const elements = buttons.concat(links)
  const len = elements.length

  const result = []
  for (let i = 0; i < len; i++) {
    const el = elements[i]
    if (
      getComputedStyle(el)['-webkit-tap-highlight-color'] === 'rgba(0, 0, 0, 0)'
    ) {
      result.push({
        type: getNodeName(el),
        text: el.innerText,
        html: el.innerHTML,
        path: getDomPath(el),
      })
    }
    yield i
  }

  return result
}

const MAX_WIDTH = 600

function* getSrcsetWarnings(container) {
  const images = getElements(container, 'img')
  const len = images.length

  const result = []

  for (let i = 0; i < len; i++) {
    const img = images[i]
    const srcSet = img.getAttribute('srcset')
    const src = img.getAttribute('src')
    if (!srcSet && src) {
      const isSVG = Boolean(src.match(/svg$/))
      if (!isSVG) {
        const isLarge =
          parseInt(getComputedStyle(img).width, 10) > MAX_WIDTH ||
          img.naturalWidth > MAX_WIDTH
        if (isLarge) {
          result.push({
            src: img.src,
            path: getDomPath(img),
            alt: img.alt,
          })
        }
      }
    }
    yield i
  }

  return result
}

function* getBackgroundImageWarnings(container) {
  const backgroundImageRegex = /url\(".*?(.png|.jpg|.jpeg)"\)/
  const elsWithBackgroundImage = getElements(container, '#root *').filter(
    (el) => {
      const style = getComputedStyle(el)
      return (
        style['background-image'] &&
        backgroundImageRegex.test(style['background-image']) &&
        // HACK
        // ideally, we would make a new image element and check its "naturalWidth"
        // to get a better idea of the size of the background image, this is a hack
        el.clientWidth > 200
      )
    }
  )

  if (!elsWithBackgroundImage.length) return []

  const styleDict = new Map()

  Object.keys(container.styleSheets).forEach((k) => {
    getStylesheetRules(container.styleSheets, k).forEach((rule) => {
      if (rule) {
        try {
          elsWithBackgroundImage.forEach((el) => {
            if (el.matches(rule.selectorText)) {
              styleDict.set(el, (styleDict.get(el) || []).concat(rule))
            }
          })
        } catch (e) {
          // catch errors in safari
        }
      }
    })
  })

  const responsiveBackgroundImgRegex = /-webkit-min-device-pixel-ratio|min-resolution|image-set/

  const result = []
  const elements = Array.from(styleDict.entries())
  const len = elements.length

  for (let i = 0; i < len; i++) {
    const [el, styles] = elements[i]
    if (styles) {
      const requiresResponsiveWarning = styles.some(
        (style) => !responsiveBackgroundImgRegex.test(style)
      )
      if (requiresResponsiveWarning) {
        const bg = getComputedStyle(el).backgroundImage
        const src = bg.match(/url\("(.*)"\)/)
          ? bg.match(/url\("(.*)"\)/)[1]
          : undefined
        result.push({
          path: getDomPath(el),
          src,
        })
      }
    }
    yield i
  }

  return result
}

export const getActiveStyles = function (container, el) {
  const sheets = container.styleSheets
  const result = []

  const activeRegex = /:active$/

  Object.keys(sheets).forEach((k) => {
    getStylesheetRules(sheets, k).forEach((rule) => {
      if (rule && rule.selectorText && rule.selectorText.match(activeRegex)) {
        const ruleNoPseudoClass = rule.selectorText.replace(activeRegex, '')
        try {
          if (el.matches(ruleNoPseudoClass)) {
            result.push(rule)
          }
        } catch (e) {
          // safari
        }
      }
    })
  })
  return result
}

function* getActiveWarnings(container) {
  const buttons = getElements(container, 'button').concat(
    getElements(container, '[role="button"]')
  )
  const links = getElements(container, 'a')
  const elements = buttons.concat(links)
  const len = elements.length
  const result = []

  for (let i = 0; i < len; i++) {
    const el = elements[i]
    const hasActive = getActiveStyles(container, el)
    if (hasActive.length) {
      result.push({
        type: getNodeName(el),
        text: el.innerText,
        html: el.innerHTML,
        path: getDomPath(el),
      })
    }
    yield i
  }

  return result
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

function* get100vhWarnings(container) {
  const elements = getElements(container, '#root *')
  const len = elements.length
  const result = []

  for (let i = 0; i < len; i++) {
    const el = elements[i]
    const styles = getOriginalStyles(container, el)
    const vhWarning = styles.find((style) => /100vh/.test(style))
    if (vhWarning) {
      result.push({ el, css: vhWarning, path: getDomPath(el) })
    }
    yield i
  }

  return result
}

/*function* getTooWideWarnings(container) {
  const containerWidth = container.body.clientWidth
  const elements = getElements(container, '#root *')
  const len = elements.length
  const result = []

  for (let i = 0; i < len; i++) {
    const el = elements[i]
    if (el.clientWidth > containerWidth) {
      result.push({
        el,
        path: getDomPath(el),
      })
    }
    yield i
  }

  return result
}*/

const schedule = (iterator) => {
  // 100ms is the threshold where users start to notice UI lag
  // higher values increase lag but do not noticeably improve processing time so 100ms is the sweet spot
  const scheduler = createScheduler({ chunkBudget: 100 })
  const task = scheduler.runTask(iterator)
  return { task, abort: () => scheduler.abortTask(task) }
}

export const getScheduledWarnings = (container, setState, setComplete) => {
  const analyses = {
    // tooWide: schedule(getTooWideWarnings(container)),
    tapHighlight: schedule(getTapHighlightWarnings(container)),
    srcset: schedule(getSrcsetWarnings(container)),
    backgroundImg: schedule(getBackgroundImageWarnings(container)),
    touchTarget: schedule(getTouchTargetSizeWarning(container)),
    active: schedule(getActiveWarnings(container)),
    height: schedule(get100vhWarnings(container)),
  }
  const analysesArray = Object.keys(analyses)
  let remaining = analysesArray.length
  analysesArray.forEach((key) => {
    //const start = performance.now()
    analyses[key].task.then((result) => {
      //console.log(key, performance.now() - start)
      setState((prev) => ({ ...prev, [key]: result }))
      if (--remaining === 0) {
        setComplete(true)
      }
    })
  })
  return () => analysesArray.forEach((key) => analyses[key].abort())
}
