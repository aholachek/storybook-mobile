import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { withTheme } from 'emotion-theming'
import {
  getTapHighlightWarnings,
  getActiveWarnings,
  getAutocompleteWarnings,
  getInputTypeWarnings,
  getOverflowAutoWarnings,
  getSrcsetWarnings,
  getTouchTargetSizeWarning,
  get100vhWarning,
  getInputTypeNumberWarnings,
} from './utils'

const recommendedSize = 44
const minSize = 30
const recommendedDistance = 8

const accessibleBlue = '#0965df'
const warning = '#bd4700'

const tagStyles = `
  padding: .25rem .5rem;
  font-weight: bold;
  display:inline-block;
  border-radius: 10px;
  margin-bottom: 1rem;
  svg {
    margin-right: .25rem;
    display: inline-block;
    height: .7rem;
    line-height: 1;
    position: relative;
    top: .03rem;
    letter-spacing: .01rem;
  }
`

const StyledWarningTag = styled.div`
  color: ${warning};
  background-color: hsl(41, 100%, 92%);
  ${tagStyles}
`

const Warning = () => {
  return (
    <StyledWarningTag>
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
      >
        <path
          fill="currentColor"
          d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
        ></path>
      </svg>
      warning
    </StyledWarningTag>
  )
}

const StyledInfoTag = styled.div`
  ${tagStyles}
 color: ${accessibleBlue};
 background-color: hsla(214, 92%, 45%, 0.1);
`
const Info = () => {
  return (
    <StyledInfoTag>
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="magic"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="svg-inline--fa fa-magic fa-w-16 fa-5x"
      >
        <path
          fill="currentColor"
          d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z"
          className=""
        ></path>
      </svg>
      hint
    </StyledInfoTag>
  )
}

const NoWarning = styled.div`
  padding: 1rem;
  font-weight: bold;
`

const Spacer = styled.div`
  padding: 1rem;
`

const StyledTappableContents = styled.div`
  display: inline-block;
  padding-top: 0.25rem;
  height: 2rem;
  min-width: 1rem;
  width: auto;
  background-color: hsla(0, 0%, 50%, 0.1);
  border-radius: 3px;
  li {
    list-style-type: none;
  }
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
  ${(props) => (props.nostyle ? 'list-style-type: none;' : '')};
`

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));

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
    max-height: 12rem;
    overflow: auto;
  }
  a {
    text-decoration: none;
    color: ${accessibleBlue};
    &:hover {
      border-bottom: 1px solid ${accessibleBlue};
    }
  }
  > div {
    border-bottom: 1px solid ${(props) => props.theme.color.medium};
    border-right: 1px solid ${(props) => props.theme.color.medium};
  }
`

const fixText = 'Learn more'

const ActiveWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Info />
      <h3>
        <code>:active</code> styles on iOS
      </h3>
      <p>
        For <code>:active</code> styles to show on iOS, you need to{' '}
        <a href="https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari">
          add a touch listener to the element.
        </a>{' '}
        Please verify such a listener exists.
      </p>
      <ul>
        {warnings.map((w, i) => {
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
    </Spacer>
  )
}

const TapWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Info />
      <h3>Tap style removed from tappable element</h3>
      <p>
        These elements have an invisible{' '}
        <code>-webkit-tap-highlight-color</code>. While this might be
        intentional, please verify that they have appropriate tap indication
        styles added through other means.
      </p>
      <ul>
        {warnings.map((w, i) => {
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
      <details>
        <summary>{fixText}</summary>
        <p>
          Some stylesheets remove the tap indication highlight shown on iOS and
          Android browsers by adding the code{' '}
          <code>-webkit-tap-highlight-color: transparent</code>. In order to
          maintain a good mobile experience, tap styles should be added via
          appropriate <code>:active</code> CSS styles (though, note{' '}
          <code>:active</code> styles work inconsistently in iOS), or via
          JavaScript on the <code>touchstart</code> event.
        </p>
      </details>
    </Spacer>
  )
}

const AutocompleteWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Warning />
      <h3>
        Input with no <code>autocomplete</code> prop
      </h3>
      <p>
        Most textual inputs should have an explicit <code>autocomplete</code>{' '}
        prop (even if it&apos;s just <code>autocomplete=&quot;off&quot;</code>).
      </p>
      <ul>
        {warnings.map((w, i) => {
          return (
            <ListEntry key={i}>
              <code>input type=&quot;{w.type}&quot;</code> and label{' '}
              <b>{w.labelText || '[no label found]'}</b>
            </ListEntry>
          )
        })}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          <a href="https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill">
            Google&apos;s autocomplete documentation
          </a>
        </p>
        <p>
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete">
            Mozilla&apos;ss autocomplete documentation
          </a>
        </p>
      </details>
    </Spacer>
  )
}

const InputTypeWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Info />

      <h3>
        Plain input type <code>text</code> detected
      </h3>
      <p>
        This will render the default text keyboard on mobile (which could very
        well be what you want!) If you haven&apos;t already, take a moment to
        make sure this is correct. You can use{' '}
        <a href="https://better-mobile-inputs.netlify.com/">this tool</a> to
        explore keyboard options.
      </p>
      <ul>
        {warnings.map((w, i) => {
          return (
            <ListEntry key={i}>
              <code>input type=&quot;{w.type}&quot;</code> and label{' '}
              <b>{w.labelText || '[no label found]'}</b>
            </ListEntry>
          )
        })}
      </ul>
    </Spacer>
  )
}

const InputTypeNumberWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Info />

      <h3>
        Input type <code>number</code> used
      </h3>
      <p>
        Often,{' '}
        <code>
          &lt;input type=&quot;text&quot; inputmode=&quot;decimal&quot;/&gt;
        </code>{' '}
        will give you improved usability over{' '}
        <code>&lt;input type=&quot;number&quot; /&gt;</code>.
      </p>
      <ul>
        {warnings.map((w, i) => {
          return (
            <ListEntry key={i}>
              <code>input type=&quot;{w.type}&quot;</code> and label{' '}
              <b>{w.labelText || '[no label found]'}</b>
            </ListEntry>
          )
        })}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          <a href="https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/">
            This article has a good overview of the issues with{' '}
            <code>input type=&quot;number&quot;</code>.
          </a>
        </p>
      </details>
    </Spacer>
  )
}

const OverflowWarning = ({ warnings }) => {
  if (!warnings.length) return null

  return (
    <Spacer>
      <Warning />
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
          CSS: <code>-webkit-overflow-scrolling:touch;</code> to any container
          with a style of <code>overflow: auto</code> or{' '}
          <code>overflow: scroll</code>.{' '}
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling">
            Learn more about the property here.
          </a>
        </p>
      </details>
    </Spacer>
  )
}

const HeightWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Info />
      <h3>
        Usage of <code>100vh</code> CSS
      </h3>
      <p>
        Viewport units are{' '}
        <a href="https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html">
          tricky on mobile.
        </a>{' '}
        On some mobile browers, depending on scroll position, <code>100vh</code>{' '}
        might take up more than 100% of screen height due to browser chrome like
        the address bar.
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
    </Spacer>
  )
}

const SrcsetWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Warning />
      <h3>
        Large image without <code>srscset</code>
      </h3>
      <p>
        Asking your users on phones to download larger-than-necessary images
        will slow them down, both in terms of network downloads and image
        decoding. You can use <code>srcset</code> to customize image sizes for
        different device resolutions and sizes.
      </p>
      <ul>
        {warnings.map(({ src, alt }, i) => {
          return (
            <ListEntry key={i} nostyle>
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
          Here&apos;s a{' '}
          <a href="https://cloudfour.com/thinks/responsive-images-the-simple-way">
            good overview of the problem and how to solve it with{' '}
            <code>srcset</code>
          </a>
          .
        </p>
      </details>
    </Spacer>
  )
}

const TouchTargetWarnings = ({ warnings: { underMinSize, tooClose } }) => {
  if (!underMinSize.length && !tooClose.length) return null
  return (
    <Spacer>
      <Warning />

      {Boolean(underMinSize.length) && (
        <div>
          <h3>Small touch target</h3>
          <p>
            With heights and/or widths of less than {minSize}px, these tappable
            elements could be difficult for users to press:
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
          <h3
            style={{
              marginTop: underMinSize.length ? '.5rem' : '0',
            }}
          >
            Touch targets close together{' '}
          </h3>
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
        <ul>
          <li>
            <a href="https://www.nngroup.com/articles/touch-target-size/">
              Touch target size article from the Nielsen Normal Group
            </a>
          </li>
          <li>
            <a href="https://developers.google.com/web/fundamentals/accessibility/accessible-styles">
              Google&apos;s tap target size recommendations
            </a>
          </li>
        </ul>
        <p></p>
      </details>
    </Spacer>
  )
}

const convertToBool = (num) => (num > 0 ? 1 : 0)

const Hints = ({ container, theme }) => {
  const tapHighlightWarnings = getTapHighlightWarnings(container)
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
  const inputTypeNumberWarnings = getInputTypeNumberWarnings(container)

  const warningCount =
    convertToBool(tapHighlightWarnings.length) +
    convertToBool(autocompleteWarnings.length) +
    convertToBool(touchTargetWarnings.underMinSize.length) +
    convertToBool(touchTargetWarnings.tooClose.length) +
    convertToBool(overflowWarnings.length) +
    convertToBool(srcsetWarnings.length) +
    convertToBool(inputTypeWarnings.length) +
    convertToBool(overflowWarnings.length) +
    convertToBool(heightWarnings.length) +
    convertToBool(inputTypeNumberWarnings.length) +
    convertToBool(activeWarnings.length)

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
    return <NoWarning>Looking good! No mobile hints available.</NoWarning>
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <TouchTargetWarnings warnings={touchTargetWarnings} />
        <AutocompleteWarnings warnings={autocompleteWarnings} />
        <SrcsetWarnings warnings={srcsetWarnings} />
        <OverflowWarning warnings={overflowWarnings} />
        <InputTypeWarnings warnings={inputTypeWarnings} />
        <InputTypeNumberWarnings warnings={inputTypeNumberWarnings} />
        <HeightWarnings warnings={heightWarnings} />
        <TapWarnings warnings={tapHighlightWarnings} />
        <ActiveWarnings warnings={activeWarnings} />
      </Container>
    </ThemeProvider>
  )
}

export default withTheme(Hints)
