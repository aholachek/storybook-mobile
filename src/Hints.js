import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { withTheme } from 'emotion-theming'
import {
  getTapHighlightWarnings,
  getActiveWarnings,
  getAutocompleteWarnings,
  getInputTypeWarnings,
  getSrcsetWarnings,
  getTouchTargetSizeWarning,
  get100vhWarning,
  getInputTypeNumberWarnings,
  getBackgroundImageWarnings,
  getTooWideWarnings,
} from './utils'

const recommendedSize = 44
const minSize = 30
const recommendedDistance = 8

const accessibleBlue = '#0965df'
const warning = '#bd4700'

const StyledLogButton = styled.button`
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  border: none;
  font-size: 100%;
  background-color: transparent;
  appearance: none;
  box-shadow: none;
  font-weight: bold;
  border-radius: 8px;
  color: white;
  background-color: ${accessibleBlue};
  padding: 0.25rem 0.5rem;
  display: inline-block;
  margin-bottom: 1rem;
  &:hover {
    background-color: hsl(214, 90%, 38%);
  }
  svg {
    margin-right: 0.25rem;
    display: inline-block;
    height: 0.7rem;
    line-height: 1;
    position: relative;
    top: 0.03rem;
    letter-spacing: 0.01rem;
  }
`

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
const Hint = () => {
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
  img,
  svg {
    max-height: 2rem !important;
    min-height: 1rem !important;
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
    display: block;
    margin-right: 1rem;
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
    padding-bottom: 0.5rem;
    li {
      margin-bottom: 0.3rem;
    }
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

const StyledBanner = styled.div`
  padding: 0.75rem;
  grid-column: 1 / -1;
`

const fixText = 'Learn more'

const timeout = 2200

const LogToConsole = ({ title, els }) => {
  const [success, setSuccess] = React.useState(false)
  const magnifyingGlass = (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
      ></path>
    </svg>
  )

  return (
    <StyledLogButton
      onClick={() => {
        setSuccess(true)
        console.group(
          `%c 📱Storybook Mobile Addon: ${title}`,
          'font-weight: bold'
        )
        els.forEach((el) => console.log(el))
        console.groupEnd()
        setTimeout(() => {
          setSuccess(false)
        }, timeout)
      }}
    >
      {magnifyingGlass}
      {success
        ? 'Success! Pls open devtools'
        : `Log element${els.length > 1 ? 's' : ''} to dev console`}
    </StyledLogButton>
  )
}

const ActiveWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Hint />
      <h3>
        <code>:active</code> styles on iOS
      </h3>
      <p>
        <code>:active</code> styles will only appear in iOS{' '}
        <a href="https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari">
          if a touch listener is added to the element or one of its ancestors
        </a>
        . Once activated in this manner, <code>:active</code> styles (along with{' '}
        <code>:hover</code> styles) will be applied immediately in iOS when a
        user taps, possibly creating a confusing UX. (On Android,{' '}
        <code>:active</code> styles are applied with a slight delay to allow the
        user to use gestures like scroll without necessarily activating{' '}
        <code>:active</code> styles.)
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
        <p style={{ marginTop: '1rem' }}>
          <a href="https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari/33681490#33681490">
            Helpful Stack Overflow thread
          </a>
        </p>
      </details>
    </Spacer>
  )
}

const TapWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Hint />
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
        Input with no <code>autocomplete</code> attribute
      </h3>
      <p>
        Most textual inputs should have an explicit <code>autocomplete</code>{' '}
        attribute.
      </p>
      <p>
        If you truly want to disable autocomplete, try using a{' '}
        <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164">
          semantically valid but unique value rather than{' '}
          <code>autocomplete=&quot;off&quot;</code>
        </a>
        , which doesn&apos;t work in Chrome.
      </p>
      <p>
        Note: <code>autocomplete</code> is styled as <code>autoComplete</code>{' '}
        in JSX.
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
        <ul>
          <li>
            <a href="https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill">
              Google&apos;s autocomplete documentation
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete">
              Mozilla&apos;s autocomplete documentation
            </a>
          </li>
        </ul>
      </details>
    </Spacer>
  )
}

const InputTypeWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Hint />

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
      <details>
        <summary>{fixText}</summary>
        <p>
          <a href="https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/">
            This article reviews the importance of using correct input types on
            the mobile web.
          </a>
        </p>
      </details>
    </Spacer>
  )
}

const InputTypeNumberWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Hint />

      <h3>
        Input type <code>number</code> detected
      </h3>
      <p>
        <code>
          &lt;input type=&quot;text&quot; inputmode=&quot;decimal&quot;/&gt;
        </code>{' '}
        could give you improved usability over{' '}
        <code>&lt;input type=&quot;number&quot; /&gt;</code>.
      </p>
      <p>
        Note: <code>inputmode</code> is styled as <code>inputMode</code> in JSX.{' '}
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

const TooWideWarnings = ({ warnings }) => {
  if (!warnings.length) return null

  const title = `Element${
    warnings.length > 1 ? 's' : ''
  } introducing horizontal overflow`

  return (
    <Spacer>
      <Hint />
      <h3>{title}</h3>
      <p>
        The following element{warnings.length > 1 ? 's' : ''} had a width that
        exceeded that of the page, possibly introducing a horizontal scroll.
        While this may be intentional, please verify that this is not an error.
      </p>
      <LogToConsole title={title} els={warnings.map((w) => w.el)} />
      <div>
        {warnings.map(({ path }, i) => {
          return (
            <ListEntry key={i} style={{ marginBottom: '1rem' }} as="div">
              <code>{path}</code>
            </ListEntry>
          )
        })}
      </div>
    </Spacer>
  )
}

const HeightWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Hint />
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

const BackgroundImageWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Warning />
      <h3>Non-dynamic background image</h3>
      <p>
        Downloading larger-than-necessary images hurts performance for users on
        mobile. You can use{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/image-set">
          <code>image-set</code>
        </a>{' '}
        to serve an appropriate background image based on the user&apos;s device
        resolution.
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
        <ul>
          <li>
            <a href="https://css-tricks.com/responsive-images-css/">
              CSS Tricks article discussing responsive background images in
              greater detail, including the interaction of{' '}
              <code>image-set</code> with media queries.
            </a>
          </li>
        </ul>
      </details>
    </Spacer>
  )
}

const SrcsetWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <Spacer>
      <Warning />
      <h3>
        Large image without <code>srcset</code>
      </h3>
      <p>
        Downloading larger-than-necessary images hurts performance for users on
        mobile. You can use <code>srcset</code> to customize image sizes for
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
        <ul>
          <li>
            <a href="https://cloudfour.com/thinks/responsive-images-the-simple-way">
              Good overview of the problem
            </a>
          </li>
          <li>
            <a href="https://www.responsivebreakpoints.com/">
              Tool to generate responsive images
            </a>
          </li>
        </ul>
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

const Wrapper = ({ theme, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>{children}</Container>
    </ThemeProvider>
  )
}

const Hints = ({ container, theme, loading, running }) => {
  if (running)
    return (
      <Wrapper theme={theme}>
        <StyledBanner>Running scan...</StyledBanner>
      </Wrapper>
    )

  const warnings = {
    tapHighlight: getTapHighlightWarnings(container),
    active: getActiveWarnings(container),
    autocomplete: getAutocompleteWarnings(container),
    inputType: getInputTypeWarnings(container),
    touchTarget: getTouchTargetSizeWarning({
      container,
      minSize,
      recommendedSize,
      recommendedDistance,
    }),
    srcset: getSrcsetWarnings(container),
    backgroundImg: getBackgroundImageWarnings(container),
    height: get100vhWarning(container),
    inputTypeNumber: getInputTypeNumberWarnings(container),
    // tooWide: getTooWideWarnings(container),
  }

  const warningCount = Object.keys(warnings)
    .map((key) => warnings[key])
    .reduce((acc, curr) => {
      const count = Array.isArray(curr)
        ? convertToBool(curr.length)
        : //touchTarget returns an object not an array
          Object.keys(curr)
            .map((key) => curr[key])
            .reduce((acc, curr) => {
              return acc + convertToBool(curr.length)
            }, 0)
      return acc + count
    }, 0)

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

  if (!warningCount && !loading)
    return (
      <Wrapper theme={theme}>
        <StyledBanner>Looking good! No mobile hints available.</StyledBanner>
      </Wrapper>
    )

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <StyledBanner>
          {loading
            ? 'Preliminary results shown, still scanning...'
            : 'Scan complete!'}
        </StyledBanner>
        <TouchTargetWarnings warnings={warnings.touchTarget} />
        <AutocompleteWarnings warnings={warnings.autocomplete} />
        <SrcsetWarnings warnings={warnings.srcset} />
        <BackgroundImageWarnings warnings={warnings.backgroundImg} />
        {/* <TooWideWarnings warnings={warnings.tooWide} container={container} /> */}
        <InputTypeWarnings warnings={warnings.inputType} />
        <InputTypeNumberWarnings warnings={warnings.inputTypeNumber} />
        <HeightWarnings warnings={warnings.height} />
        <TapWarnings warnings={warnings.tapHighlight} />
        <ActiveWarnings warnings={warnings.active} />
      </Container>
    </ThemeProvider>
  )
}

export default withTheme(Hints)
