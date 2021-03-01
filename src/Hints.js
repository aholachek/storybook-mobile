import React, { Fragment } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { withTheme } from 'emotion-theming'
import {
  getInstantWarnings,
  getScheduledWarnings,
  MIN_SIZE,
  RECOMMENDED_DISTANCE,
} from './utils'

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

const Warning = () => (
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

const StyledInfoTag = styled.div`
  ${tagStyles}
  color: ${accessibleBlue};
  background-color: hsla(214, 92%, 45%, 0.1);
`
const Hint = () => (
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
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  grid-column: 1 / -1;
  height: 2.875rem;
`

const StyledRescanButton = styled.button`
  margin-left: 0.5rem;
  border-width: 1px;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  border: none;
  font-size: 100%;
  background-color: transparent;
  appearance: none;
  box-shadow: none;
  border: 1px solid;
  &:hover {
    background-color: hsla(0, 0%, 0%, 0.15);
  }
`

const Spinner = styled.div`
  cursor: progress;
  display: inline-block;
  overflow: hidden;
  position: relative;
  margin-right: 0.7rem;
  height: 1.25rem;
  width: 1.25rem;
  border-width: 2px;
  border-style: solid;
  border-radius: 50%;
  border-color: rgba(97, 97, 97, 0.29);
  border-top-color: rgb(100, 100, 100);
  animation: spinner 0.7s linear infinite;
  mix-blend-mode: difference;

  @keyframes spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const fixText = 'Learn more'

const ActiveWarnings = ({ warnings }) => {
  if (!warnings || !warnings.length) return null
  return (
    <Spacer>
      <Hint />
      <h3>
        <code>:active</code> styles on iOS
      </h3>
      <p>
        <code>:active</code> styles will only appear in iOS{' '}
        <a
          href="https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari"
          target="_blank"
          rel="noopener noreferrer"
        >
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
        {warnings.map((w, i) => (
          <ListEntry key={i}>
            <code>{w.type}</code> with content&nbsp;&nbsp;
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
        ))}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p style={{ marginTop: '1rem' }}>
          <a
            href="https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari/33681490#33681490"
            target="_blank"
            rel="noopener noreferrer"
          >
            Relevant Stack Overflow thread
          </a>
        </p>
      </details>
    </Spacer>
  )
}

const TapWarnings = ({ warnings }) => {
  if (!warnings || !warnings.length) return null
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
        {warnings.map((w, i) => (
          <ListEntry key={i}>
            <code>{w.type}</code> with content&nbsp;&nbsp;
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
        ))}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          Some stylesheets remove the tap indication highlight shown on iOS and
          Android browsers by adding the code{' '}
          <code>-webkit-tap-highlight-color: transparent</code>. In order to
          maintain a good mobile experience, tap styles should be added via
          appropriate <code>:active</code> CSS styles (though, note that{' '}
          <a
            href="https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>:active</code> styles work inconsistently in iOS
          </a>
          ) , or via JavaScript on the <code>touchstart</code> event.
        </p>
      </details>
    </Spacer>
  )
}

const AutocompleteWarnings = ({ warnings }) => {
  if (!warnings || !warnings.length) return null
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
        <a
          href="https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164"
          target="_blank"
          rel="noopener noreferrer"
        >
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
        {warnings.map((w, i) => (
          <ListEntry key={i}>
            <code>input type=&quot;{w.type}&quot;</code> and label{' '}
            <b>{w.labelText || '[no label found]'}</b>
          </ListEntry>
        ))}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <ul>
          <li>
            <a
              href="https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill"
              target="_blank"
              rel="noopener noreferrer"
            >
              Autocomplete documentation by Google
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete"
              target="_blank"
              rel="noopener noreferrer"
            >
              Autocomplete documentation by Mozilla
            </a>
          </li>
        </ul>
      </details>
    </Spacer>
  )
}

const InputTypeWarnings = ({ warnings }) => {
  if (!warnings || !warnings.length) return null
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
        <a
          href="https://better-mobile-inputs.netlify.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          this tool
        </a>{' '}
        to explore keyboard options.
      </p>
      <ul>
        {warnings.map((w, i) => (
          <ListEntry key={i}>
            <code>input type=&quot;{w.type}&quot;</code> and label{' '}
            <b>{w.labelText || '[no label found]'}</b>
          </ListEntry>
        ))}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          <a
            href="https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Article reviewing the importance of using correct input types on the
            mobile web from CSS Tricks.
          </a>
        </p>
      </details>
    </Spacer>
  )
}

const InputTypeNumberWarnings = ({ warnings }) => {
  if (!warnings || !warnings.length) return null
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
        {warnings.map((w, i) => (
          <ListEntry key={i}>
            <code>input type=&quot;{w.type}&quot;</code> and label{' '}
            <b>{w.labelText || '[no label found]'}</b>
          </ListEntry>
        ))}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          <a
            href="https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Overview of the issues with{' '}
            <code>input type=&quot;number&quot;</code> from gov.uk.
          </a>
        </p>
      </details>
    </Spacer>
  )
}

// const TooWideWarnings = ({ warnings }) => {
//   if (!warnings || !warnings.length) return null

//   const title = `Element${
//     warnings.length > 1 ? 's' : ''
//   } introducing horizontal overflow`

//   return (
//     <Spacer>
//       <Hint />
//       <h3>{title}</h3>
//       <p>
//         The following element{warnings.length > 1 ? 's' : ''} had a width that
//         exceeded that of the page, possibly introducing a horizontal scroll.
//         While this may be intentional, please verify that this is not an error.
//       </p>
//       <LogToConsole title={title} els={warnings.map((w) => w.el)} />
//       <div>
//         {warnings.map(({ path }, i) => (
//             <ListEntry key={i} style={{ marginBottom: '1rem' }} as="div">
//               <code>{path}</code>
//             </ListEntry>
//           )
//         )}
//       </div>
//     </Spacer>
//   )
// }

const HeightWarnings = ({ warnings }) => {
  if (!warnings || !warnings.length) return null
  return (
    <Spacer>
      <Hint />
      <h3>
        Usage of <code>100vh</code> CSS
      </h3>
      <p>
        Viewport units are{' '}
        <a
          href="https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          tricky on mobile.
        </a>{' '}
        On some mobile browers, depending on scroll position, <code>100vh</code>{' '}
        might take up more than 100% of screen height due to browser chrome like
        the address bar.
      </p>
      <ul>
        {warnings.map(({ path }, i) => (
          <ListEntry key={i}>
            <code>{path}</code>
          </ListEntry>
        ))}
      </ul>
    </Spacer>
  )
}

const BackgroundImageWarnings = ({ warnings }) => {
  if (!warnings || !warnings.length) return null
  return (
    <Spacer>
      <Warning />
      <h3>Non-dynamic background image</h3>
      <p>
        Downloading larger-than-necessary images hurts performance for users on
        mobile. You can use{' '}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/image-set"
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>image-set</code>
        </a>{' '}
        to serve an appropriate background image based on the user&apos;s device
        resolution.
      </p>
      <ul>
        {warnings.map(({ src, alt }, i) => (
          <ListEntry key={i} nostyle>
            <div>
              <DemoImg src={src} alt={alt} />
            </div>
          </ListEntry>
        ))}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <ul>
          <li>
            <a
              href="https://css-tricks.com/responsive-images-css/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Article discussing responsive background images in greater detail,
              including the interaction of <code>image-set</code> with media
              queries, from CSS Tricks.
            </a>
          </li>
        </ul>
      </details>
    </Spacer>
  )
}

const SrcsetWarnings = ({ warnings }) => {
  if (!warnings || !warnings.length) return null
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
        {warnings.map(({ src, alt }, i) => (
          <ListEntry key={i} nostyle>
            <div>
              <DemoImg src={src} alt={alt} />
            </div>
          </ListEntry>
        ))}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <ul>
          <li>
            <a
              href="https://cloudfour.com/thinks/responsive-images-the-simple-way"
              target="_blank"
              rel="noopener noreferrer"
            >
              Summary of the why and how of responsive images
            </a>
          </li>
          <li>
            <a
              href="https://www.responsivebreakpoints.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              A tool to generate responsive images
            </a>
          </li>
        </ul>
      </details>
    </Spacer>
  )
}

const TouchTargetWarnings = ({ warnings }) => {
  if (!warnings) return null
  const { underMinSize, tooClose } = warnings
  if (!underMinSize.length && !tooClose.length) return null
  return (
    <Spacer>
      <Warning />

      {Boolean(underMinSize.length) && (
        <div>
          <h3>Small touch target</h3>
          <p>
            With heights and/or widths of less than {MIN_SIZE}px, these tappable
            elements could be difficult for users to press:
          </p>
          <ul>
            {underMinSize.map((w, i) => (
              <ListEntry key={i}>
                <code>{w.type}</code> with content&nbsp;&nbsp;
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
            ))}
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
            These tappable elements are less than {RECOMMENDED_DISTANCE}px from
            at least one other tappable element:
          </p>
          <ul>
            {tooClose.map((w, i) => (
              <ListEntry key={i}>
                <code>{w.type}</code> with content&nbsp;&nbsp;
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
            ))}
          </ul>
        </div>
      )}
      <details>
        <summary>{fixText}</summary>
        <ul>
          <li>
            <a
              href="https://www.nngroup.com/articles/touch-target-size/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Touch target size article from the Nielsen Norman Group
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/accessible-tap-targets/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tap target size recommendations from Google
            </a>
          </li>
        </ul>
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

export const Loading = withTheme(({ theme }) => (
  <Wrapper theme={theme}>
    <StyledBanner>
      <Spinner />
      <span>Running scan...</span>
    </StyledBanner>
  </Wrapper>
))

const Hints = ({ container, theme }) => {
  const [warnings, setWarnings] = React.useState(undefined)
  const [scanComplete, setScanComplete] = React.useState(false)
  const [rescan, setRescan] = React.useState(0)

  React.useEffect(() => {
    setScanComplete(false)
    setWarnings(getInstantWarnings(container))
    return getScheduledWarnings(container, setWarnings, setScanComplete)
  }, [container, rescan])

  const warningCount = React.useMemo(
    () =>
      warnings
        ? Object.keys(warnings).reduce((acc, key) => {
            const curr = warnings[key]
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
        : 0,
    [warnings]
  )

  // Before counting, show the Loading state
  if (!warnings) {
    return <Loading />
  }

  const onRescanClick = () => setRescan((prev) => prev + 1)

  if (warningCount === 0 && scanComplete) {
    return (
      <Wrapper theme={theme}>
        <StyledBanner>
          <span>Scan complete! No issues found.</span>
          <StyledRescanButton onClick={onRescanClick} type="button">
            Rescan
          </StyledRescanButton>
        </StyledBanner>
      </Wrapper>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <StyledBanner>
          {scanComplete ? (
            <Fragment>
              <span>Scan complete! {warningCount} issues found.</span>
              <StyledRescanButton onClick={onRescanClick} type="button">
                Rescan
              </StyledRescanButton>
            </Fragment>
          ) : (
            <Fragment>
              <Spinner />
              <span>
                {warningCount > 0
                  ? `Running scan - ${warningCount} issues found so far`
                  : 'Running scan'}
                ...
              </span>
            </Fragment>
          )}
        </StyledBanner>
        <TouchTargetWarnings warnings={warnings.touchTarget} />
        <AutocompleteWarnings warnings={warnings.autocomplete} />
        {/* <TooWideWarnings warnings={warnings.tooWide} container={container} /> */}
        <InputTypeWarnings warnings={warnings.inputType} />
        <InputTypeNumberWarnings warnings={warnings.inputTypeNumber} />
        <HeightWarnings warnings={warnings.height} />
        <TapWarnings warnings={warnings.tapHighlight} />
        <ActiveWarnings warnings={warnings.active} />
        <SrcsetWarnings warnings={warnings.srcset} />
        <BackgroundImageWarnings warnings={warnings.backgroundImg} />
      </Container>
    </ThemeProvider>
  )
}

export default withTheme(Hints)
