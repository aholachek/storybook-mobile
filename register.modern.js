import React from 'react';
import { addons, types } from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';
import { useAddonState, useChannel } from '@storybook/api';
import { AddonPanel } from '@storybook/components';
import styled, { ThemeProvider } from 'styled-components';
import { withTheme } from 'emotion-theming';

function getDomPath(el) {
  var stack = [];

  while (el.parentNode) {
    let sibCount = 0;
    let sibIndex = 0;

    for (var i = 0; i < el.parentNode.childNodes.length; i++) {
      var sib = el.parentNode.childNodes[i];

      if (sib.nodeName === el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount;
        }

        sibCount++;
      }
    }

    if (el.hasAttribute('id') && el.id !== '') {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if (el.classList.toString() !== '' && el.tagName !== 'BODY') {
      stack.unshift(el.nodeName.toLowerCase() + '.' + el.classList.toString());
    } else if (sibCount > 1) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }

    el = el.parentNode;
  }

  const toFilter = ['html', 'body', 'div#root'];
  return stack.filter(el => !toFilter.includes(el)).join(' > ');
}

const getElements = (container, tag) => Array.from(container.querySelectorAll(tag));

const missingRules = (sheets, k) => {
  if ('rules' in sheets[k] || 'cssRules' in sheets[k]) return false;
  return true;
};

const getRules = (sheets, k) => sheets[k].rules || sheets[k].cssRules;

const getNodeName = el => el.nodeName === 'A' ? 'a' : el.nodeName === 'BUTTON' ? 'button' : `${el.nodeName.toLowerCase()}[role="button"]`;

const getActiveStyles = function (container, el) {
  const sheets = container.styleSheets;
  const result = [];
  const activeRegex = /:active$/;
  Object.keys(sheets).forEach(k => {
    if (missingRules(sheets, k)) return;
    getRules(sheets, k).forEach(rule => {
      if (!rule) return;
      if (!rule.selectorText || !rule.selectorText.match(activeRegex)) return;
      const ruleNoPseudoClass = rule.selectorText.replace(activeRegex, '');

      try {
        if (el.matches(ruleNoPseudoClass)) {
          result.push(rule);
        }
      } catch (e) {}
    });
  });
  return result.length ? result : null;
};
const getActiveWarnings = container => {
  const buttons = getElements(container, 'button').concat(getElements(container, '[role="button"]'));
  const links = getElements(container, 'a');
  return buttons.concat(links).map(el => [el, getActiveStyles(container, el)]).filter(tup => tup[1]).map(([el]) => {
    return {
      type: getNodeName(el),
      text: el.innerText,
      html: el.innerHTML,
      path: getDomPath(el)
    };
  });
};
const getTapHighlightWarnings = container => {
  const buttons = getElements(container, 'button').concat(getElements(container, '[role="button"]'));
  const links = getElements(container, 'a');

  const filterActiveStyles = el => {
    const tapHighlight = getComputedStyle(el)['-webkit-tap-highlight-color'];
    if (tapHighlight === 'rgba(0, 0, 0, 0)') return true;
  };

  return buttons.concat(links).filter(filterActiveStyles).map(el => ({
    type: getNodeName(el),
    text: el.innerText,
    html: el.innerHTML,
    path: getDomPath(el)
  }));
};
const maxWidth = 600;
const getSrcsetWarnings = container => {
  const images = getElements(container, 'img');
  const warnings = images.filter(img => {
    const src = img.getAttribute('src');
    const srcSet = img.getAttribute('srcset');
    if (srcSet || !src) return false;
    const isSVG = Boolean(src.match(/svg$/));
    if (isSVG) return false;
    const isLarge = parseInt(getComputedStyle(img).width, 10) > maxWidth || img.naturalWidth > maxWidth;
    if (!isLarge) return false;
    return true;
  }).map(img => {
    return {
      src: img.src,
      path: getDomPath(img),
      alt: img.alt
    };
  });
  return warnings;
};
const getBackgroundImageWarnings = container => {
  const backgroundImageRegex = /url\(".*?(.png|.jpg|.jpeg)"\)/;
  const elsWithBackgroundImage = getElements(container, '#root *').filter(el => {
    const style = getComputedStyle(el);

    if (style['background-image'] && backgroundImageRegex.test(style['background-image']) && el.clientWidth > 200) {
      return true;
    }
  });
  if (!elsWithBackgroundImage.length) return [];
  const styleDict = new Map();
  const sheets = container.styleSheets;
  Object.keys(sheets).forEach(k => {
    if (missingRules(sheets, k)) return;
    getRules(sheets, k).forEach(rule => {
      if (!rule) return;

      try {
        elsWithBackgroundImage.forEach(el => {
          if (el.matches(rule.selectorText)) {
            styleDict.set(el, (styleDict.get(el) || []).concat(rule));
          }
        });
      } catch (e) {}
    });
  });
  const responsiveBackgroundImgRegex = /-webkit-min-device-pixel-ratio|min-resolution|image-set/;
  const filteredEls = [...styleDict.entries()].map(([el, styles]) => {
    if (!styles) return false;
    const requiresResponsiveWarning = styles.reduce((acc, curr) => {
      if (acc === false) return acc;
      if (responsiveBackgroundImgRegex.test(curr)) return false;
      return true;
    }, true);
    return requiresResponsiveWarning ? el : false;
  }).filter(Boolean).map(el => {
    const bg = getComputedStyle(el).backgroundImage;
    const src = bg.match(/url\("(.*)"\)/) ? bg.match(/url\("(.*)"\)/)[1] : undefined;
    return {
      path: getDomPath(el),
      src
    };
  });
  return filteredEls;
};
const textInputs = ['text', 'search', 'tel', 'url', 'email', 'number', 'password'];

const attachLabels = (inputs, container) => {
  return inputs.map(input => {
    let labelText = '';

    if (input.labels && input.labels[0]) {
      labelText = input.labels[0].innerText;
    } else if (input.parentElement.nodeName === 'LABEL') labelText = input.parentElement.innerText;else if (input.id) {
      const label = container.querySelector(`label for="${input.id}"`);
      if (label) labelText = label.innerText;
    }

    return {
      path: getDomPath(input),
      labelText,
      type: input.type
    };
  });
};

const getAutocompleteWarnings = container => {
  const inputs = getElements(container, 'input');
  const warnings = inputs.filter(input => {
    const currentType = input.getAttribute('type');
    const autocomplete = input.getAttribute('autocomplete');

    if (textInputs.find(type => currentType === type) && !autocomplete) {
      return true;
    }

    return false;
  });
  return attachLabels(warnings, container);
};
const getInputTypeNumberWarnings = container => {
  const inputs = getElements(container, 'input[type="number"]');
  return attachLabels(inputs);
};
const getOriginalStyles = function (container, el) {
  const sheets = container.styleSheets;
  const result = [];
  Object.keys(sheets).forEach(k => {
    if (missingRules(sheets, k)) return;
    getRules(sheets, k).forEach(rule => {
      if (!rule) return;

      try {
        if (el.matches(rule.selectorText)) {
          result.push(rule);
        }
      } catch (e) {}
    });
  });
  return result.length ? result : null;
};
const get100vhWarning = container => {
  return getElements(container, '#root *').map(el => {
    const styles = getOriginalStyles(container, el);
    if (!styles) return false;
    const hasVHWarning = styles.find(style => /100vh/.test(style.cssText));
    if (hasVHWarning) return {
      el,
      css: hasVHWarning.cssText
    };
    return null;
  }).filter(Boolean).map(data => ({ ...data,
    path: getDomPath(data.el)
  }));
};
const getInputTypeWarnings = container => {
  const inputs = getElements(container, 'input[type="text"]').concat(getElements(container, 'input:not([type])')).filter(input => !input.getAttribute('inputmode'));
  return attachLabels(inputs, container);
};

const makePoints = ({
  top,
  right,
  bottom,
  left
}) => {
  return [[top, right], [top, left], [bottom, right], [bottom, left]];
};

const findDistance = (point1, point2) => {
  return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
};

const getTouchTargetSizeWarning = ({
  container,
  minSize,
  recommendedSize,
  recommendedDistance
}) => {
  const els = getElements(container, 'button').concat(getElements(container, '[role="button"]')).concat(getElements(container, 'a')).map(el => [el, el.getBoundingClientRect()]);
  const elsWithClose = els.map(([el1, bounding1], i1) => {
    const close = els.filter(([, bounding2], i2) => {
      if (i2 === i1) return;
      const points1 = makePoints(bounding1);
      const points2 = makePoints(bounding2);
      let isTooClose = false;
      points1.forEach(point1 => {
        points2.forEach(point2 => {
          const distance = findDistance(point1, point2);

          if (distance < recommendedDistance) {
            isTooClose = true;
          }
        });
      });
      return isTooClose;
    });
    return {
      close: close ? close : null,
      el: el1,
      boundingBox: bounding1
    };
  });
  const underMinSize = elsWithClose.filter(({
    boundingBox: {
      width,
      height
    }
  }) => {
    return width < minSize || height < minSize;
  });
  const tooClose = elsWithClose.filter(({
    boundingBox: {
      width,
      height
    },
    close
  }) => {
    return close.length && (width < recommendedSize || height < recommendedSize);
  });

  const present = ({
    el,
    boundingBox: {
      width,
      height
    },
    close
  }) => {
    return {
      type: el.nodeName === 'A' ? 'a' : el.nodeName === 'BUTTON' ? 'button' : `${el.nodeName.toLowerCase()}[role="button"]`,
      path: getDomPath(el),
      text: el.innerText,
      html: el.innerHTML,
      width: Math.floor(width),
      height: Math.floor(height),
      close
    };
  };

  return {
    underMinSize: underMinSize.map(present),
    tooClose: tooClose.map(present)
  };
};

let _ = t => t,
    _t,
    _t2,
    _t3,
    _t4,
    _t5,
    _t6,
    _t7,
    _t8,
    _t9;
const recommendedSize = 44;
const minSize = 30;
const recommendedDistance = 8;
const accessibleBlue = '#0965df';
const warning = '#bd4700';
const StyledLogButton = styled.button(_t || (_t = _`
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
  background-color: ${0};
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
`), accessibleBlue);
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
`;
const StyledWarningTag = styled.div(_t2 || (_t2 = _`
  color: ${0};
  background-color: hsl(41, 100%, 92%);
  ${0}
`), warning, tagStyles);

const Warning = () => {
  return /*#__PURE__*/React.createElement(StyledWarningTag, null, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    focusable: "false",
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 576 512"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
  })), "warning");
};

const StyledInfoTag = styled.div(_t3 || (_t3 = _`
  ${0}
 color: ${0};
 background-color: hsla(214, 92%, 45%, 0.1);
`), tagStyles, accessibleBlue);

const Hint = () => {
  return /*#__PURE__*/React.createElement(StyledInfoTag, null, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": "magic",
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512",
    className: "svg-inline--fa fa-magic fa-w-16 fa-5x"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z",
    className: ""
  })), "hint");
};

const Spacer = styled.div(_t4 || (_t4 = _`
  padding: 1rem;
`));
const StyledTappableContents = styled.div(_t5 || (_t5 = _`
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
`));
const DemoImg = styled.img(_t6 || (_t6 = _`
  height: 4rem;
  width: auto;
  max-width: 100%;
  background-color: hsla(0, 0%, 0%, 0.2);
`));
const ListEntry = styled.li(_t7 || (_t7 = _`
  margin-bottom: 0.5rem;
  ${0};
`), props => props.nostyle ? 'list-style-type: none;' : '');
const Container = styled.div(_t8 || (_t8 = _`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));

  font-size: ${0}px;

  p {
    line-height: 1.4;
  }

  h3 {
    font-size: ${0}px;
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
    color: ${0};
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px ${0};
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
    color: ${0};
    &:hover {
      border-bottom: 1px solid ${0};
    }
  }
  > div {
    border-bottom: 1px solid ${0};
    border-right: 1px solid ${0};
  }
`), props => props.theme.typography.size.s2, props => props.theme.typography.size.s2, accessibleBlue, props => props.theme.color.mediumlight, accessibleBlue, accessibleBlue, props => props.theme.color.medium, props => props.theme.color.medium);
const StyledBanner = styled.div(_t9 || (_t9 = _`
  padding: 0.75rem;
  grid-column: 1 / -1;
`));
const fixText = 'Learn more';

const ActiveWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("code", null, ":active"), " styles on iOS"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", null, ":active"), " styles will only appear in iOS", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari"
  }, "if a touch listener is added to the element or one of its ancestors"), ". Once activated in this manner, ", /*#__PURE__*/React.createElement("code", null, ":active"), " styles (along with", ' ', /*#__PURE__*/React.createElement("code", null, ":hover"), " styles) will be applied immediately in iOS when a user taps, possibly creating a confusing UX. (On Android,", ' ', /*#__PURE__*/React.createElement("code", null, ":active"), " styles are applied with a slight delay to allow the user to use gestures like scroll without necessarily activating", ' ', /*#__PURE__*/React.createElement("code", null, ":active"), " styles.)"), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, w.type), " with content", ' ', w.text ? /*#__PURE__*/React.createElement("b", null, w.text) : w.html ? /*#__PURE__*/React.createElement(StyledTappableContents, {
      dangerouslySetInnerHTML: {
        __html: w.html
      }
    }) : '[no text found]');
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '1rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari/33681490#33681490"
  }, "Helpful Stack Overflow thread"))));
};

const TapWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, "Tap style removed from tappable element"), /*#__PURE__*/React.createElement("p", null, "These elements have an invisible", ' ', /*#__PURE__*/React.createElement("code", null, "-webkit-tap-highlight-color"), ". While this might be intentional, please verify that they have appropriate tap indication styles added through other means."), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, w.type), " with content", ' ', w.text ? /*#__PURE__*/React.createElement("b", null, w.text) : w.html ? /*#__PURE__*/React.createElement(StyledTappableContents, {
      dangerouslySetInnerHTML: {
        __html: w.html
      }
    }) : '[no text found]');
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", null, "Some stylesheets remove the tap indication highlight shown on iOS and Android browsers by adding the code", ' ', /*#__PURE__*/React.createElement("code", null, "-webkit-tap-highlight-color: transparent"), ". In order to maintain a good mobile experience, tap styles should be added via appropriate ", /*#__PURE__*/React.createElement("code", null, ":active"), " CSS styles (though, note", ' ', /*#__PURE__*/React.createElement("code", null, ":active"), " styles work inconsistently in iOS), or via JavaScript on the ", /*#__PURE__*/React.createElement("code", null, "touchstart"), " event.")));
};

const AutocompleteWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Input with no ", /*#__PURE__*/React.createElement("code", null, "autocomplete"), " attribute"), /*#__PURE__*/React.createElement("p", null, "Most textual inputs should have an explicit ", /*#__PURE__*/React.createElement("code", null, "autocomplete"), ' ', "attribute."), /*#__PURE__*/React.createElement("p", null, "If you truly want to disable autocomplete, try using a", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164"
  }, "semantically valid but unique value rather than", ' ', /*#__PURE__*/React.createElement("code", null, "autocomplete=\"off\"")), ", which doesn't work in Chrome."), /*#__PURE__*/React.createElement("p", null, "Note: ", /*#__PURE__*/React.createElement("code", null, "autocomplete"), " is styled as ", /*#__PURE__*/React.createElement("code", null, "autoComplete"), ' ', "in JSX."), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, "input type=\"", w.type, "\""), " and label", ' ', /*#__PURE__*/React.createElement("b", null, w.labelText || '[no label found]'));
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill"
  }, "Google's autocomplete documentation")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete"
  }, "Mozilla's autocomplete documentation")))));
};

const InputTypeWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, "Plain input type ", /*#__PURE__*/React.createElement("code", null, "text"), " detected"), /*#__PURE__*/React.createElement("p", null, "This will render the default text keyboard on mobile (which could very well be what you want!) If you haven't already, take a moment to make sure this is correct. You can use", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://better-mobile-inputs.netlify.com/"
  }, "this tool"), " to explore keyboard options."), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, "input type=\"", w.type, "\""), " and label", ' ', /*#__PURE__*/React.createElement("b", null, w.labelText || '[no label found]'));
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: "https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/"
  }, "This article reviews the importance of using correct input types on the mobile web."))));
};

const InputTypeNumberWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, "Input type ", /*#__PURE__*/React.createElement("code", null, "number"), " detected"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", null, "<input type=\"text\" inputmode=\"decimal\"/>"), ' ', "could give you improved usability over", ' ', /*#__PURE__*/React.createElement("code", null, "<input type=\"number\" />"), "."), /*#__PURE__*/React.createElement("p", null, "Note: ", /*#__PURE__*/React.createElement("code", null, "inputmode"), " is styled as ", /*#__PURE__*/React.createElement("code", null, "inputMode"), " in JSX.", ' '), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, "input type=\"", w.type, "\""), " and label", ' ', /*#__PURE__*/React.createElement("b", null, w.labelText || '[no label found]'));
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: "https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/"
  }, "This article has a good overview of the issues with", ' ', /*#__PURE__*/React.createElement("code", null, "input type=\"number\""), "."))));
};

const HeightWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, "Usage of ", /*#__PURE__*/React.createElement("code", null, "100vh"), " CSS"), /*#__PURE__*/React.createElement("p", null, "Viewport units are", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html"
  }, "tricky on mobile."), ' ', "On some mobile browers, depending on scroll position, ", /*#__PURE__*/React.createElement("code", null, "100vh"), ' ', "might take up more than 100% of screen height due to browser chrome like the address bar."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
    path
  }, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, path));
  })));
};

const BackgroundImageWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Non-dynamic background image"), /*#__PURE__*/React.createElement("p", null, "Downloading larger-than-necessary images hurts performance for users on mobile. You can use", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS/image-set"
  }, /*#__PURE__*/React.createElement("code", null, "image-set")), ' ', "to serve an appropriate background image based on the user's device resolution."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
    src,
    alt
  }, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i,
      nostyle: true
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DemoImg, {
      src: src,
      alt: alt
    })));
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://css-tricks.com/responsive-images-css/"
  }, "CSS Tricks article discussing responsive background images in greater detail, including the interaction of", ' ', /*#__PURE__*/React.createElement("code", null, "image-set"), " with media queries.")))));
};

const SrcsetWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Large image without ", /*#__PURE__*/React.createElement("code", null, "srcset")), /*#__PURE__*/React.createElement("p", null, "Downloading larger-than-necessary images hurts performance for users on mobile. You can use ", /*#__PURE__*/React.createElement("code", null, "srcset"), " to customize image sizes for different device resolutions and sizes."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
    src,
    alt
  }, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i,
      nostyle: true
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DemoImg, {
      src: src,
      alt: alt
    })));
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://cloudfour.com/thinks/responsive-images-the-simple-way"
  }, "Good overview of the problem")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://www.responsivebreakpoints.com/"
  }, "Tool to generate responsive images")))));
};

const TouchTargetWarnings = ({
  warnings: {
    underMinSize,
    tooClose
  }
}) => {
  if (!underMinSize.length && !tooClose.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), Boolean(underMinSize.length) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Small touch target"), /*#__PURE__*/React.createElement("p", null, "With heights and/or widths of less than ", minSize, "px, these tappable elements could be difficult for users to press:"), /*#__PURE__*/React.createElement("ul", null, underMinSize.map((w, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, w.type), " with content", ' ', w.text ? /*#__PURE__*/React.createElement("b", null, w.text) : w.html ? /*#__PURE__*/React.createElement(StyledTappableContents, {
      dangerouslySetInnerHTML: {
        __html: w.html
      }
    }) : '[no text found]');
  }))), Boolean(tooClose.length) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: underMinSize.length ? '.5rem' : '0'
    }
  }, "Touch targets close together", ' '), /*#__PURE__*/React.createElement("p", null, "These elements have dimensions smaller than ", recommendedSize, "px and are less than ", recommendedDistance, "px from at least one other tappable element:"), /*#__PURE__*/React.createElement("ul", null, tooClose.map((w, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, w.type), " with content", ' ', w.text ? /*#__PURE__*/React.createElement("b", null, w.text) : w.html ? /*#__PURE__*/React.createElement(StyledTappableContents, {
      dangerouslySetInnerHTML: {
        __html: w.html
      }
    }) : '[no text found]');
  }))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://www.nngroup.com/articles/touch-target-size/"
  }, "Touch target size article from the Nielsen Normal Group")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://developers.google.com/web/fundamentals/accessibility/accessible-styles"
  }, "Google's tap target size recommendations"))), /*#__PURE__*/React.createElement("p", null)));
};

const convertToBool = num => num > 0 ? 1 : 0;

const Wrapper = ({
  theme,
  children
}) => {
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(Container, null, children));
};

const Hints = ({
  container,
  theme,
  loading,
  running
}) => {
  if (running) return /*#__PURE__*/React.createElement(Wrapper, {
    theme: theme
  }, /*#__PURE__*/React.createElement(StyledBanner, null, "Running scan..."));
  const warnings = {
    tapHighlight: getTapHighlightWarnings(container),
    active: getActiveWarnings(container),
    autocomplete: getAutocompleteWarnings(container),
    inputType: getInputTypeWarnings(container),
    touchTarget: getTouchTargetSizeWarning({
      container,
      minSize,
      recommendedSize,
      recommendedDistance
    }),
    srcset: getSrcsetWarnings(container),
    backgroundImg: getBackgroundImageWarnings(container),
    height: get100vhWarning(container),
    inputTypeNumber: getInputTypeNumberWarnings(container)
  };
  const warningCount = Object.keys(warnings).map(key => warnings[key]).reduce((acc, curr) => {
    const count = Array.isArray(curr) ? convertToBool(curr.length) : Object.keys(curr).map(key => curr[key]).reduce((acc, curr) => {
      return acc + convertToBool(curr.length);
    }, 0);
    return acc + count;
  }, 0);
  React.useEffect(() => {
    const tab = Array.from(document.querySelectorAll('button[role="tab"]')).find(el => /^Mobile(\s\(\d+\))?$/.test(el.innerText));

    if (tab) {
      if (warningCount === 0) {
        tab.innerText = 'Mobile';
      } else {
        tab.innerText = `Mobile (${warningCount})`;
      }
    }
  });
  if (!warningCount && !loading) return /*#__PURE__*/React.createElement(Wrapper, {
    theme: theme
  }, /*#__PURE__*/React.createElement(StyledBanner, null, "Looking good! No mobile hints available."));
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(StyledBanner, null, loading ? 'Preliminary results shown, still scanning...' : 'Scan complete!'), /*#__PURE__*/React.createElement(TouchTargetWarnings, {
    warnings: warnings.touchTarget
  }), /*#__PURE__*/React.createElement(AutocompleteWarnings, {
    warnings: warnings.autocomplete
  }), /*#__PURE__*/React.createElement(SrcsetWarnings, {
    warnings: warnings.srcset
  }), /*#__PURE__*/React.createElement(BackgroundImageWarnings, {
    warnings: warnings.backgroundImg
  }), /*#__PURE__*/React.createElement(InputTypeWarnings, {
    warnings: warnings.inputType
  }), /*#__PURE__*/React.createElement(InputTypeNumberWarnings, {
    warnings: warnings.inputTypeNumber
  }), /*#__PURE__*/React.createElement(HeightWarnings, {
    warnings: warnings.height
  }), /*#__PURE__*/React.createElement(TapWarnings, {
    warnings: warnings.tapHighlight
  }), /*#__PURE__*/React.createElement(ActiveWarnings, {
    warnings: warnings.active
  })));
};

var Hints$1 = withTheme(Hints);

const ADDON_ID = 'mobile-hints';
const PARAM_KEY = 'mobile-hints';
const PANEL_ID = `${ADDON_ID}/panel`;
const viewportId = 'storybook/viewport';
const noViewport = 'reset';
const defaultViewport = 'mobile1';

const ViewportManager = ({
  active
}) => {
  const [viewportState, setViewportState] = useAddonState(viewportId);
  const cachedState = React.useRef(null);
  React.useEffect(() => {
    if (cachedState.current && !active) {
      setViewportState({
        selected: cachedState.current
      });
      cachedState.current = null;
    } else {
      if (active && (!viewportState || viewportState.selected === noViewport)) {
        cachedState.current = noViewport;
        setViewportState({
          selected: defaultViewport
        });
      }
    }
  }, [active]);
  return null;
};

const StateWrapper = ({
  children
}) => {
  const [storyId, setStoryId] = React.useState('');
  useChannel({
    [STORY_CHANGED]: (...args) => {
      setStoryId(args);
    }
  });
  return React.cloneElement(children, {
    storyId
  });
};

const getContainer = () => {
  const iframe = document.getElementById('storybook-preview-iframe');
  if (!iframe) return null;
  return iframe.contentDocument;
};

const delay = 2000;

const MyPanel = ({
  storyId
}) => {
  const [html, setHTML] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const setContainer = () => {
      const container = getContainer();

      if (!container || !container.body) {
        setTimeout(setContainer, delay);
        return;
      }

      setHTML(container.body.innerHTML);
      setLoading(false);
    };

    setLoading(true);
    setTimeout(setContainer, delay);
  }, [storyId]);
  const container = getContainer();
  return /*#__PURE__*/React.createElement(Hints$1, {
    container: container,
    loading: loading,
    running: !html
  });
};

addons.register(ADDON_ID, () => {
  const render = ({
    active,
    key
  }) => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ViewportManager, {
      active: active
    }), /*#__PURE__*/React.createElement(AddonPanel, {
      active: active,
      key: key
    }, /*#__PURE__*/React.createElement(StateWrapper, {
      active: active
    }, /*#__PURE__*/React.createElement(MyPanel, {
      key: key,
      active: active
    }))));
  };

  const title = 'Mobile';
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title,
    render,
    paramKey: PARAM_KEY
  });
});
