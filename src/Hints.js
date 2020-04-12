import React from 'react'
import styled from '@emotion/styled'
import {
  getActiveWarnings,
  getAutocompleteWarnings,
  getInputTypeWarnings,
  getOverflowAutoWarnings,
  getSrcsetWarnings,
  getTouchTargetSizeWarning,
  get100vhWarning,
} from './utils'

const Info = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="eye"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path
      fill="currentColor"
      d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
    ></path>
  </svg>
)

const Warning = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="exclamation-circle"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        fill="currentColor"
        d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
      ></path>
    </svg>
  )
}

const accessibleBlue = 'rgb(20, 116, 243)'

const StyledContentContainer = styled.div`
  > div {
    border-bottom: 1px solid ${({ theme }) => theme.color.medium};
    padding: 0.75rem;
  }
`

const StyledContainer = styled.div`
  font-size: ${({ theme }) => theme.typography.size.s2}px;
  h2 {
    font-weight: bold;
    font-size: ${({ theme }) => theme.typography.size.s2}px;
    margin-top: 0;
    margin-bottom: 0;
    padding: 0.5rem 0 0.5rem 1rem;
    background: ${({ theme }) => theme.color.light};
    border-bottom: 1px solid ${({ theme }) => theme.color.medium};

    svg {
      height: 0.8rem;
      position: relative;
      top: 0.075rem;
      margin-right: 0.5rem;
    }
  }
  h3 {
    font-size: ${({ theme }) => theme.typography.size.s2}px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  code {
    font-size: 0.85rem;
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
      box-shadow: 0 0 0 3px ${({ theme }) => theme.color.light};
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
`

const StyledImg = styled.img`
  height: 4rem;
  width: auto;
  max-width: 100%;
`

const StyledEntry = styled.li`
  margin-bottom: 0.5rem;
`

const fixText = 'Learn more'

const ActiveWarnings = ({ warnings }) => {
  if (!warnings.length) return null
  return (
    <div>
      <h3>
        Missing <code>:active</code> styles
      </h3>
      <p>
        Clear <code>:active</code> styles are key to ensuring users on mobile
        get instantaneous feedback on tap, even on slower devices.
      </p>
      <ul>
        {warnings.map((w) => {
          return (
            <StyledEntry>
              {w.type} with text <b>{w.text}</b> (<code>{w.path}</code>)
            </StyledEntry>
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
        Missing <code>autocomplete</code> prop
      </h3>
      <p>
        Most, if not all, textual inputs should have an explicit{' '}
        <code>autocomplete</code> prop.
      </p>
      <ul>
        {warnings.map((w) => {
          return (
            <StyledEntry>
              Input with type <code>{w.type}</code> and label{' '}
              <b>{w.labelText}</b> (<code>{w.path}</code>)
            </StyledEntry>
          )
        })}
      </ul>
      <details>
        <summary>{fixText}</summary>
        <p>
          <a href="https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill">
            Google autocomplete documentation
          </a>
        </p>
        <p>
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete">
            Mozilla autocomplete documentation
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
      <div>
        This will render the default text keyboard on mobile (which could very
        well be what you want!){' '}
        <a href="https://better-mobile-inputs.netlify.com/">
          If you haven't already, take a moment to make sure this is correct.{' '}
        </a>
      </div>
      <ul>
        {warnings.map((w) => {
          return (
            <StyledEntry>
              Input with type <code>{w.type}</code> and label{' '}
              <b>{w.labelText}</b> <code>({w.path})</code>
            </StyledEntry>
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
        {warnings.map(({ path }) => {
          return (
            <StyledEntry>
              <code>{path}</code>
            </StyledEntry>
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
        </a>
      </p>
      <ul>
        {warnings.map(({ path }) => {
          return (
            <StyledEntry>
              <code>{path}</code>
            </StyledEntry>
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
        Forcing your users on phones to download huge images will slow them
        down. Use <code>srcset</code> for a simple way to customize image sizes
        to your users' needs.
      </p>
      <ul>
        {warnings.map(({ src, alt }) => {
          return (
            <StyledEntry>
              <div>
                <StyledImg src={src} alt={alt} />
              </div>
            </StyledEntry>
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

const TouchTargetWarnings = ({ warnings }) => {
  if (!warnings.length) return null

  return (
    <div>
      <h3>Touch target too small </h3>
      <p>
        It's important that clickable elements are large enough for users to
        easily trigger, which generally means &gt;= 40px including padding.
      </p>
      <ul>
        {warnings.map((w) => {
          return (
            <StyledEntry>
              <div>
                {w.type} with text <b>{w.text}</b> <code>{w.path}</code>
              </div>
              {w.width < 42 && <div>width: {w.width}px</div>}
              {w.height < 42 && <div>height: {w.height}px</div>}
            </StyledEntry>
          )
        })}
      </ul>
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

const Hints = ({ container }) => {
  const activeWarnings = getActiveWarnings(container)
  const autocompleteWarnings = getAutocompleteWarnings(container)
  const inputTypeWarnings = getInputTypeWarnings(container)
  const touchTargetWarnings = getTouchTargetSizeWarning(container)
  const overflowWarnings = getOverflowAutoWarnings(container)
  const srcsetWarnings = getSrcsetWarnings(container)
  const heightWarnings = get100vhWarning(container)

  const warningCount =
    activeWarnings.length +
    autocompleteWarnings.length +
    touchTargetWarnings.length +
    overflowWarnings.length +
    srcsetWarnings.length +
    inputTypeWarnings.length +
    overflowWarnings.length +
    heightWarnings.length

  const tipsCount = inputTypeWarnings.length + heightWarnings.length

  React.useEffect(() => {
    const tab = [
      ...document.querySelectorAll('button[role="tab"]'),
    ].find((el) => /^Mobile(\s\(\d\))?$/.test(el.innerText))
    if (tab) {
      if (warningCount === 0) {
        tab.innerText = 'Mobile'
      } else {
        tab.innerText = `Mobile (${warningCount})`
      }
    }
  })

  const renderWarnings = warningCount > 0

  return (
    <StyledContainer>
      {Boolean(renderWarnings) && (
        <div>
          <h2>
            {' '}
            <Warning /> Warnings ({warningCount - tipsCount} element
            {warningCount - tipsCount > 1 ? 's' : ''})
          </h2>
          <StyledContentContainer>
            <ActiveWarnings warnings={activeWarnings} />
            <TouchTargetWarnings warnings={touchTargetWarnings} />
            <AutocompleteWarnings warnings={autocompleteWarnings} />
            <SrcsetWarnings warnings={srcsetWarnings} />
            <OverflowWarning warnings={overflowWarnings} />
          </StyledContentContainer>
        </div>
      )}

      {Boolean(tipsCount) && (
        <div>
          <h2>
            <Info /> Tips ({tipsCount} element{tipsCount > 1 ? 's' : ''})
          </h2>
          <StyledContentContainer>
            <InputTypeWarnings warnings={inputTypeWarnings} />
            <HeightWarnings warnings={heightWarnings} />
          </StyledContentContainer>
        </div>
      )}
    </StyledContainer>
  )
}

export default Hints
