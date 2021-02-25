import React from 'react'
import { addons, types } from '@storybook/addons'
import { STORY_RENDERED } from '@storybook/core-events'
import { useChannel, useAddonState } from '@storybook/api'
import { AddonPanel } from '@storybook/components'
import Hints, { Loading } from './Hints'

const ADDON_ID = 'mobile-hints'
const PARAM_KEY = 'mobile-hints'
const PANEL_ID = `${ADDON_ID}/panel`

const viewportId = 'storybook/viewport'
const noViewport = 'reset'
const defaultViewport = 'mobile1'

const ViewportManager = ({ active }) => {
  const [viewportState, setViewportState] = useAddonState(viewportId)
  const cachedState = React.useRef(null)
  React.useEffect(() => {
    if (cachedState.current && !active) {
      setViewportState({
        selected: cachedState.current,
      })
      cachedState.current = null
    } else {
      if (active && (!viewportState || viewportState.selected === noViewport)) {
        cachedState.current = noViewport
        setViewportState({
          selected: defaultViewport,
        })
      }
    }
  }, [active]) // eslint-disable-line

  return null
}

const StateWrapper = ({ children }) => {
  const [storyId, setStoryId] = React.useState('')

  useChannel({
    [STORY_RENDERED]: (...args) => {
      setStoryId(args)
    }
  })
  return React.cloneElement(children, {
    storyId,
  })
}

const getContainer = () => {
  const iframe = document.getElementById('storybook-preview-iframe')
  if (!iframe) return null
  return iframe.contentDocument
}

const delay = 2000
const MyPanel = ({ storyId }) => {
  const [html, setHTML] = React.useState(undefined)

  React.useEffect(() => {
    // clear HTML when storyId changes
    setHTML(undefined)
    // check for container
    let timeoutId = undefined
    const checkContainer = () => {
      const container = getContainer()
      if (!container || !container.body) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(checkContainer, delay)
      } else {
        setHTML(container.body.innerHTML)
      }
    }
    clearTimeout(timeoutId)
    timeoutId = setTimeout(checkContainer, delay)
    return () => clearTimeout(timeoutId)
  }, [storyId])

  const container = getContainer()

  if (!html || !container) {
    return <Loading />
  }

  return <Hints container={container} />
}

addons.register(ADDON_ID, () => {
  const render = ({ active, key }) => {
    return (
      <React.Fragment key="storybook-mobile">
        <ViewportManager active={active} />
        <AddonPanel active={active} key={key}>
          <StateWrapper active={active}>
            <MyPanel key={key} active={active} />
          </StateWrapper>
        </AddonPanel>
      </React.Fragment>
    )
  }
  const title = 'Mobile'

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title,
    render,
    paramKey: PARAM_KEY,
  })
})
