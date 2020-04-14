import React from 'react'
import styled from 'styled-components'
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
const minSize = 30
const recommendedDistance = 8

const accessibleBlue = '#0965df'

const NoWarning = styled.div`
  padding: 1rem;
  font-weight: bold;
`

const StyledTappableContents = styled.div`
  padding-top: 0.25rem;
  height: 2rem;
  width: auto;
  img {
    height: 2rem !important;
    width: auto !important;
  }
`

const DemoImg = styled.img`
  height: 4rem;
  width: auto;
  max-width: 100%;
  background-color: hsla(0, 0%, 0%, 0.2);
`

const ListEntry = styled.li`
  margin-bottom: 0.5rem;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));

  font-size: ${(props) => props.theme.typography.size.s2}px;

  p {
    line-height: 1.4;
  }

  h3 {
    font-size: ${(props) => props.theme.typography.size.s2}px;
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
      box-shadow: 0 0 0 3px ${(props) => props.theme.color.mediumlight};
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
    border-bottom: 1px solid ${(props) => props.theme.color.medium};
    border-right: 1px solid ${(props) => props.theme.color.medium};
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
            <ListEntry key={i}>
              {w.type} with content{' '}
              {w.text ? (
                <b>{w.text}</b>
              ) : w.html ? (
                <StyledTappableContents
                  dangerouslySetInnerHTML={{ __html: w.html }}
                />
              ) : (
                '[no text found]'
              )}
            </ListEntry>
          )
        })}
      </ul>
      <p>
        <b>Note:</b> This check is not sophisticated enough to pick up active
        styles added with JavaScript, e.g. the{' '}
        <a href="https://material.io/design/interaction/states.html#pressed">
          material ripple effect
        </a>
        .
      </p>
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
        Input with no <code>autocomplete</code> prop detected
      </h3>
      <p>
        Most textual inputs should have an explicit <code>autocomplete</code>{' '}
        prop (even if it's just <code>autocomplete="off"</code>).
      </p>
      <ul>
        {warnings.map((w, i) => {
          return (
            <ListEntry key={i}>
              <code>input type="{w.type}"</code> and label <b>{w.labelText}</b>
            </ListEntry>
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
        well be what you want!) If you haven't already, take a moment to make
        sure this is correct. You can use{' '}
        <a href="https://better-mobile-inputs.netlify.com/">this tool</a> to
        explore keyboard options.
      </p>
      <ul>
        {warnings.map((w, i) => {
          return (
            <ListEntry key={i}>
              <code>input type="{w.type}"</code> and label <b>{w.labelText}</b>
            </ListEntry>
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
            <ListEntry key={i}>
              <code>{path}</code>
            </ListEntry>
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
            <ListEntry key={i}>
              <code>{path}</code>
            </ListEntry>
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
        Asking your users on phones to download larger-than-necessary images
        will slow them down, both in terms of network downloads and image
        decoding. Compress images as much as possible and then use{' '}
        <code>srcset</code> to customize image sizes.
      </p>
      <ul>
        {warnings.map(({ src, alt }, i) => {
          return (
            <ListEntry key={i}>
              <div>
                <DemoImg src={src} alt={alt} />
              </div>
            </ListEntry>
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
          <h3>Small touch target</h3>
          <p>
            With dimensions of less than {minSize}px, these tappable elements
            could be difficult for users to press:
          </p>
          <ul>
            {underMinSize.map((w, i) => {
              return (
                <ListEntry key={i}>
                  <code>{w.type}</code> with content{' '}
                  {w.text ? (
                    <b>{w.text}</b>
                  ) : w.html ? (
                    <StyledTappableContents
                      dangerouslySetInnerHTML={{ __html: w.html }}
                    />
                  ) : (
                    '[no text found]'
                  )}
                </ListEntry>
              )
            })}
          </ul>
        </div>
      )}
      {Boolean(tooClose.length) && (
        <div>
          <h3>Touch targets close together </h3>
          <p>
            These elements have dimensions smaller than {recommendedSize}px and
            are less than {recommendedDistance}px from at least one other
            tappable element:
          </p>
          <ul>
            {tooClose.map((w, i) => {
              return (
                <ListEntry key={i}>
                  <code>{w.type}</code> with content{' '}
                  {w.text ? (
                    <b>{w.text}</b>
                  ) : w.html ? (
                    <StyledTappableContents
                      dangerouslySetInnerHTML={{ __html: w.html }}
                    />
                  ) : (
                    '[no text found]'
                  )}
                </ListEntry>
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
    ).find((el) => /^Mobile(\s\(\d+\))?$/.test(el.innerText))
    if (tab) {
      if (warningCount === 0) {
        tab.innerText = 'Mobile'
      } else {
        tab.innerText = `Mobile (${warningCount})`
      }
    }
  })

  if (!warningCount)
    return <NoWarning>Looking good! No issues detected.</NoWarning>
  return (
    <Container theme={theme}>
      <TouchTargetWarnings warnings={touchTargetWarnings} />
      <AutocompleteWarnings warnings={autocompleteWarnings} />
      <SrcsetWarnings warnings={srcsetWarnings} />
      <OverflowWarning warnings={overflowWarnings} />
      <InputTypeWarnings warnings={inputTypeWarnings} />
      <HeightWarnings warnings={heightWarnings} />
      <ActiveWarnings warnings={activeWarnings} />
    </Container>
  )
}

export default withTheme(Hints)
