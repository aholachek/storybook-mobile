/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/core'
import { withTheme } from 'emotion-theming'

import {
  getActiveWarnings,
  getAutocompleteWarnings,
  getInputTypeWarnings,
  getOverflowAutoWarnings,
  getSrcsetWarnings,
  getTouchTargetSizeWarning,
  get100vhWarning,
} from './utils'

const recommendedSize = 44
const minSize = 32
const recommendedDistance = 8

const accessibleBlue = '#0965df'

const noWarningStyles = css`
  padding: 1rem;
  font-weight: bold;
`

const demoImgStyles = css`
  height: 4rem;
  width: auto;
  max-width: 100%;
`

const entryStyles = css`
  margin-bottom: 0.5rem;
`

const containerStyles = (theme) => css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));

  font-size: ${theme.typography.size.s2}px;

  p {
    line-height: 1.4;
  }

  h3 {
    font-size: ${theme.typography.size.s2}px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  code {
    background: hsla(0, 0%, 50%, 0.1);
    border-radius: 3px;
  }

  summary {
    cursor: pointer;
    display: inline-block;
    padding: 0.2rem 0.3rem;
    border-radius: 5px;
    color: ${accessibleBlue};
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px ${theme.color.mediumlight};
    }
  }

  ul {
    padding-left: 1.25rem;
  }
  a {
    text-decoration: none;
    color: ${accessibleBlue};
    &:hover {
      border-bottom: 1px solid ${accessibleBlue};
    }
  }
  > div {
    padding: 1rem;
    border-bottom: 1px solid ${theme.color.medium};
    border-right: 1px solid ${theme.color.medium};
  }
`

const fixText = 'Learn more'

const ActiveWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <div>
      <h3>
        No <code>:active</code> style detected
      </h3>
      <p>
        Clear <code>:active</code> styles are key to ensuring users on mobile
        get instantaneous feedback on tap, even on slower devices.
      </p>
      <ul>
        {warnings.map((w, i) => {
          return (
            <li css={entryStyles} key={i}>
              {w.type} with text <b>{w.text}</b>
            </li>
          )
        })}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          <a href="https://fvsch.com/styling-buttons/#states">This article</a>{' '}
          offers a great overview of how to style buttons.
        </p>
      </details>
    </div>
  )
}

const AutocompleteWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <div>
      <h3>
        No <code>autocomplete</code> prop detected
      </h3>
      <p>
        Most textual inputs should have an explicit <code>autocomplete</code>{' '}
        prop (even if it's just <code>autocomplete="off"</code>).
      </p>
      <ul>
        {warnings.map((w, i) => {
          return (
            <li css={entryStyles} key={i}>
              <code>input type="{w.type}"</code> and label <b>{w.labelText}</b>
            </li>
          )
        })}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          <a href="https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill">
            Google's autocomplete documentation
          </a>
        </p>
        <p>
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete">
            Mozilla's autocomplete documentation
          </a>
        </p>
      </details>
    </div>
  )
}

const InputTypeWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <div>
      <h3>
        Input type <code>text</code> with no <code>inputmode</code>{' '}
      </h3>
      <p>
        This will render the default text keyboard on mobile (which could very
        well be what you want!){' '}
        <a href="https://better-mobile-inputs.netlify.com/">
          If you haven't already, take a moment to make sure this is correct.{' '}
        </a>
      </p>
      <ul>
        {warnings.map((w, i) => {
          return (
            <li css={entryStyles} key={i}>
              <code>input type="{w.type}"</code> and label <b>{w.labelText}</b>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const OverflowWarning = ({ warnings }) => {
  if (!warnings.length) return null

  return (
    <div>
      <h3>
        Scrollable container without{' '}
        <code>-webkit-overflow-scrolling:touch</code>
      </h3>
      <p>This element will scroll awkwardly and abruptly on iOS.</p>
      <ul>
        {warnings.map(({ path }, i) => {
          return (
            <li css={entryStyles} key={i}>
              <code>{path}</code>
            </li>
          )
        })}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          To ensure your users benefit from momentum scrolling, add this line of
          CSS: <code>-webkit-overflow-scrolling:touch</code> to any container
          with a style of <code>overflow: auto</code> or{' '}
          <code>overflow: scroll</code>.{' '}
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling">
            Learn more about the property here.
          </a>
        </p>
      </details>
    </div>
  )
}

const HeightWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <div>
      <h3>
        Usage of <code>100vh</code> CSS
      </h3>
      <p>
        Viewport units are{' '}
        <a href="https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html">
          tricky on mobile.
        </a>{' '}
        On some mobile browers, depending on scroll position and direction,{' '}
        <code>100vh</code> might take up more than 100% of screen height.
      </p>
      <ul>
        {warnings.map(({ path }, i) => {
          return (
            <li css={entryStyles} key={i}>
              <code>{path}</code>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const SrcsetWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <div>
      <h3>
        Large image without <code>srscset</code>
      </h3>
      <p>
        Asking your users on phones to download huge images will slow them down,
        both in terms of network downloads and image decoding. Compress images
        as much as possible and then use <code>srcset</code> to customize image
        sizes.
      </p>
      <ul>
        {warnings.map(({ src, alt }, i) => {
          return (
            <li css={entryStyles} key={i}>
              <div>
                <img css={demoImgStyles} src={src} alt={alt} />
              </div>
            </li>
          )
        })}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          Here's a{' '}
          <a href="https://cloudfour.com/thinks/responsive-images-the-simple-way">
            good overview of the problem and how to solve it with{' '}
            <code>srcset</code>
          </a>
          .
        </p>
      </details>
    </div>
  )
}

const TouchTargetWarnings = ({ warnings: { underMinSize, tooClose } }) => {
  if (!underMinSize.length && !tooClose.length) return null
  return (
    <div>
      {Boolean(underMinSize.length) && (
        <div>
          <h3>Touch target too small </h3>
          <p>
            With dimensions of less than {minSize}px, these tappable elements
            could be difficult for users to press:
          </p>
          <ul>
            {underMinSize.map((w, i) => {
              return (
                <li css={entryStyles} key={i}>
                  <div>
                    {w.type} with text <b>{w.text}</b>
                  </div>
                  {w.width < minSize && <div>width: {w.width}px</div>}
                  {w.height < minSize && <div>height: {w.height}px</div>}
                  {}
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {Boolean(tooClose.length) && (
        <div>
          <h3>Touch targets too close together </h3>
          <p>
            These elements have dimensions smaller than {recommendedSize}px and
            are less than {recommendedDistance}px from at least one other
            tappable element:
          </p>
          <ul>
            {tooClose.map((w, i) => {
              return (
                <li css={entryStyles} key={i}>
                  <div>
                    {w.type} with text <b>{w.text}</b>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <details>
        <summary>{fixText}</summary>
        <p>
          <a href="https://material.io/design/usability/accessibility.html#layout-typography">
            Material design accessibility guidelines
          </a>
        </p>
      </details>
    </div>
  )
}

const Hints = ({ container, theme }) => {
  const activeWarnings = getActiveWarnings(container)
  const autocompleteWarnings = getAutocompleteWarnings(container)
  const inputTypeWarnings = getInputTypeWarnings(container)
  const touchTargetWarnings = getTouchTargetSizeWarning({
    container,
    minSize,
    recommendedSize,
    recommendedDistance,
  })
  const overflowWarnings = getOverflowAutoWarnings(container)
  const srcsetWarnings = getSrcsetWarnings(container)
  const heightWarnings = get100vhWarning(container)

  const warningCount =
    activeWarnings.length +
    autocompleteWarnings.length +
    touchTargetWarnings.underMinSize.length +
    touchTargetWarnings.tooClose.length +
    overflowWarnings.length +
    srcsetWarnings.length +
    inputTypeWarnings.length +
    overflowWarnings.length +
    heightWarnings.length

  React.useEffect(() => {
    const tab = Array.from(
      document.querySelectorAll('button[role="tab"]')
    ).find((el) => /^Mobile(\s\(\d\))?$/.test(el.innerText))
    if (tab) {
      if (warningCount === 0) {
        tab.innerText = 'Mobile'
      } else {
        tab.innerText = `Mobile (${warningCount})`
      }
    }
  })

  if (!warningCount)
    return <div css={noWarningStyles}>Looking good! No issues detected.</div>
  return (
    <div css={containerStyles(theme)}>
      <ActiveWarnings warnings={activeWarnings} />
      <TouchTargetWarnings warnings={touchTargetWarnings} />
      <AutocompleteWarnings warnings={autocompleteWarnings} />
      <SrcsetWarnings warnings={srcsetWarnings} />
      <OverflowWarning warnings={overflowWarnings} />
      <InputTypeWarnings warnings={inputTypeWarnings} />
      <HeightWarnings warnings={heightWarnings} />
    </div>
  )
}

export default withTheme(Hints)
