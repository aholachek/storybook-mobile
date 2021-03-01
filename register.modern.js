import React, { Fragment } from 'react';
import { addons, types } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import { useAddonState, useChannel } from '@storybook/api';
import { AddonPanel } from '@storybook/components';
import styled, { ThemeProvider } from 'styled-components';
import { withTheme } from 'emotion-theming';
import { createScheduler } from 'lrt';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

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

const getStylesheetRules = (sheets, k) => {
  let rules = [];

  try {
    rules = sheets[k].rules || sheets[k].cssRules;
  } catch (e) {//
  }

  return rules;
};

const getNodeName = el => el.nodeName === 'A' ? 'a' : el.nodeName === 'BUTTON' ? 'button' : `${el.nodeName.toLowerCase()}[role="button"]`;

const attachLabels = (inputs, container) => inputs.map(input => {
  let labelText = '';

  if (input.labels && input.labels[0]) {
    labelText = input.labels[0].innerText;
  } else if (input.parentElement.nodeName === 'LABEL') {
    labelText = input.parentElement.innerText;
  } else if (input.id) {
    const label = container.querySelector(`label[for="${input.id}"]`);
    if (label) labelText = label.innerText;
  }

  return {
    labelText,
    path: getDomPath(input),
    type: input.type
  };
});

const textInputs = {
  text: true,
  search: true,
  tel: true,
  url: true,
  email: true,
  number: true,
  password: true
};

const getAutocompleteWarnings = container => {
  const inputs = getElements(container, 'input');
  const warnings = inputs.filter(input => {
    const currentType = input.getAttribute('type');
    const autocomplete = input.getAttribute('autocomplete');
    return textInputs[currentType] && !autocomplete;
  });
  return attachLabels(warnings, container);
};

const getInputTypeNumberWarnings = container => {
  const inputs = getElements(container, 'input[type="number"]');
  return attachLabels(inputs);
};

const getInputTypeWarnings = container => {
  const inputs = getElements(container, 'input[type="text"]').concat(getElements(container, 'input:not([type])')).filter(input => !input.getAttribute('inputmode'));
  return attachLabels(inputs, container);
};

const getInstantWarnings = container => ({
  autocomplete: getAutocompleteWarnings(container),
  inputType: getInputTypeWarnings(container),
  inputTypeNumber: getInputTypeNumberWarnings(container)
}); // SCHEDULED ANALYSES
// We schedule these so the UI does not lock up while they're running

const isInside = (dangerZone, bounding) => bounding.top <= dangerZone.bottom && bounding.bottom >= dangerZone.top && bounding.left <= dangerZone.right && bounding.right >= dangerZone.left;

const toPresent = ({
  el,
  bounding: {
    width,
    height
  },
  close
}) => ({
  type: el.nodeName === 'A' ? 'a' : el.nodeName === 'BUTTON' ? 'button' : `${el.nodeName.toLowerCase()}[role="button"]`,
  path: getDomPath(el),
  text: el.innerText,
  html: el.innerHTML,
  width: Math.floor(width),
  height: Math.floor(height),
  close
});

const MIN_SIZE = 32;
const RECOMMENDED_DISTANCE = 8; //const RECOMMENDED_SIZE = 48

const checkMinSize = ({
  height,
  width
}) => height < MIN_SIZE || width < MIN_SIZE;

function* getTouchTargetSizeWarning(container) {
  const elements = getElements(container, 'button').concat(getElements(container, '[role="button"]')).concat(getElements(container, 'a'));
  const suspectElements = Array.from(new Set(elements)).map(el => [el, el.getBoundingClientRect()]);
  const len = elements.length;
  const underMinSize = [];
  const tooClose = [];

  for (let i = 0; i < len; i++) {
    const el = elements[i];
    const bounding = el.getBoundingClientRect();
    const dangerZone = {
      top: bounding.top - RECOMMENDED_DISTANCE,
      left: bounding.left - RECOMMENDED_DISTANCE,
      right: bounding.right + RECOMMENDED_DISTANCE,
      bottom: bounding.bottom + RECOMMENDED_DISTANCE
    };
    const close = suspectElements.filter(([susEl, susBounding]) => susEl !== el && isInside(dangerZone, susBounding));
    const isUnderMinSize = checkMinSize(bounding);

    if (isUnderMinSize || close.length > 0) {
      const present = toPresent({
        el,
        bounding,
        close
      });

      if (isUnderMinSize) {
        underMinSize.push(present);
      }

      if (close.length > 0) {
        tooClose.push(present);
      }
    }

    yield i;
  }

  return {
    tooClose,
    underMinSize
  };
}

function* getTapHighlightWarnings(container) {
  const buttons = getElements(container, 'button').concat(getElements(container, '[role="button"]'));
  const links = getElements(container, 'a');
  const elements = buttons.concat(links);
  const len = elements.length;
  const result = [];

  for (let i = 0; i < len; i++) {
    const el = elements[i];

    if (getComputedStyle(el)['-webkit-tap-highlight-color'] === 'rgba(0, 0, 0, 0)') {
      result.push({
        type: getNodeName(el),
        text: el.innerText,
        html: el.innerHTML,
        path: getDomPath(el)
      });
    }

    yield i;
  }

  return result;
}

const MAX_WIDTH = 600;

function* getSrcsetWarnings(container) {
  const images = getElements(container, 'img');
  const len = images.length;
  const result = [];

  for (let i = 0; i < len; i++) {
    const img = images[i];
    const srcSet = img.getAttribute('srcset');
    const src = img.getAttribute('src');

    if (!srcSet && src) {
      const isSVG = Boolean(src.match(/svg$/));

      if (!isSVG) {
        const isLarge = parseInt(getComputedStyle(img).width, 10) > MAX_WIDTH || img.naturalWidth > MAX_WIDTH;

        if (isLarge) {
          result.push({
            src: img.src,
            path: getDomPath(img),
            alt: img.alt
          });
        }
      }
    }

    yield i;
  }

  return result;
}

function* getBackgroundImageWarnings(container) {
  const backgroundImageRegex = /url\(".*?(.png|.jpg|.jpeg)"\)/;
  const elsWithBackgroundImage = getElements(container, '#root *').filter(el => {
    const style = getComputedStyle(el);
    return style['background-image'] && backgroundImageRegex.test(style['background-image']) && // HACK
    // ideally, we would make a new image element and check its "naturalWidth"
    // to get a better idea of the size of the background image, this is a hack
    el.clientWidth > 200;
  });
  if (!elsWithBackgroundImage.length) return [];
  const styleDict = new Map();
  Object.keys(container.styleSheets).forEach(k => {
    getStylesheetRules(container.styleSheets, k).forEach(rule => {
      if (rule) {
        try {
          elsWithBackgroundImage.forEach(el => {
            if (el.matches(rule.selectorText)) {
              styleDict.set(el, (styleDict.get(el) || []).concat(rule));
            }
          });
        } catch (e) {// catch errors in safari
        }
      }
    });
  });
  const responsiveBackgroundImgRegex = /-webkit-min-device-pixel-ratio|min-resolution|image-set/;
  const result = [];
  const elements = Array.from(styleDict.entries());
  const len = elements.length;

  for (let i = 0; i < len; i++) {
    const [el, styles] = elements[i];

    if (styles) {
      const requiresResponsiveWarning = styles.some(style => !responsiveBackgroundImgRegex.test(style));

      if (requiresResponsiveWarning) {
        const bg = getComputedStyle(el).backgroundImage;
        const src = bg.match(/url\("(.*)"\)/) ? bg.match(/url\("(.*)"\)/)[1] : undefined;
        result.push({
          path: getDomPath(el),
          src
        });
      }
    }

    yield i;
  }

  return result;
}

const getActiveStyles = function getActiveStyles(container, el) {
  const sheets = container.styleSheets;
  const result = [];
  const activeRegex = /:active$/;
  Object.keys(sheets).forEach(k => {
    getStylesheetRules(sheets, k).forEach(rule => {
      if (rule && rule.selectorText && rule.selectorText.match(activeRegex)) {
        const ruleNoPseudoClass = rule.selectorText.replace(activeRegex, '');

        try {
          if (el.matches(ruleNoPseudoClass)) {
            result.push(rule);
          }
        } catch (e) {// safari
        }
      }
    });
  });
  return result;
};

function* getActiveWarnings(container) {
  const buttons = getElements(container, 'button').concat(getElements(container, '[role="button"]'));
  const links = getElements(container, 'a');
  const elements = buttons.concat(links);
  const len = elements.length;
  const result = [];

  for (let i = 0; i < len; i++) {
    const el = elements[i];
    const hasActive = getActiveStyles(container, el);

    if (hasActive.length) {
      result.push({
        type: getNodeName(el),
        text: el.innerText,
        html: el.innerHTML,
        path: getDomPath(el)
      });
    }

    yield i;
  }

  return result;
}

const getOriginalStyles = (container, el) => {
  const sheets = container.styleSheets;
  let result = [];
  Object.keys(sheets).forEach(k => {
    const rules = getStylesheetRules(sheets, k);
    rules.forEach(rule => {
      if (rule) {
        try {
          if (el.matches(rule.selectorText)) {
            result.push(rule.cssText);
          }
        } catch (e) {// catch errors in safari
        }
      }
    });
  });
  return result;
};

function* get100vhWarnings(container) {
  const elements = getElements(container, '#root *');
  const len = elements.length;
  const result = [];

  for (let i = 0; i < len; i++) {
    const el = elements[i];
    const styles = getOriginalStyles(container, el);
    const vhWarning = styles.find(style => /100vh/.test(style));

    if (vhWarning) {
      result.push({
        el,
        css: vhWarning,
        path: getDomPath(el)
      });
    }

    yield i;
  }

  return result;
}

const schedule = iterator => {
  // 100ms is the threshold where users start to notice UI lag
  // higher values increase lag but do not noticeably improve processing time so 100ms is the sweet spot
  const scheduler = createScheduler({
    chunkBudget: 100
  });
  const task = scheduler.runTask(iterator);
  return {
    task,
    abort: () => scheduler.abortTask(task)
  };
};

const getScheduledWarnings = (container, setState, setComplete) => {
  const analyses = {
    tapHighlight: schedule(getTapHighlightWarnings(container)),
    srcset: schedule(getSrcsetWarnings(container)),
    backgroundImg: schedule(getBackgroundImageWarnings(container)),
    touchTarget: schedule(getTouchTargetSizeWarning(container)),
    active: schedule(getActiveWarnings(container)),
    height: schedule(get100vhWarnings(container))
  };
  const analysesArray = Object.keys(analyses);
  let remaining = analysesArray.length;
  analysesArray.forEach(key => {
    //const start = performance.now()
    analyses[key].task.then(result => {
      //console.log(key, performance.now() - start)
      setState(prev => _extends({}, prev, {
        [key]: result
      }));

      if (--remaining === 0) {
        setComplete(true);
      }
    });
  });
  return () => analysesArray.forEach(key => analyses[key].abort());
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
    _t9,
    _t10;
const accessibleBlue = '#0965df';
const warning = '#bd4700';
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
const StyledWarningTag = styled.div(_t || (_t = _`
  color: ${0};
  background-color: hsl(41, 100%, 92%);
  ${0}
`), warning, tagStyles);

const Warning = () => /*#__PURE__*/React.createElement(StyledWarningTag, null, /*#__PURE__*/React.createElement("svg", {
  "aria-hidden": "true",
  focusable: "false",
  role: "img",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 576 512"
}, /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
})), "warning");

const StyledInfoTag = styled.div(_t2 || (_t2 = _`
  ${0}
  color: ${0};
  background-color: hsla(214, 92%, 45%, 0.1);
`), tagStyles, accessibleBlue);

const Hint = () => /*#__PURE__*/React.createElement(StyledInfoTag, null, /*#__PURE__*/React.createElement("svg", {
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

const Spacer = styled.div(_t3 || (_t3 = _`
  padding: 1rem;
`));
const StyledTappableContents = styled.div(_t4 || (_t4 = _`
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
const DemoImg = styled.img(_t5 || (_t5 = _`
  height: 4rem;
  width: auto;
  max-width: 100%;
  background-color: hsla(0, 0%, 0%, 0.2);
`));
const ListEntry = styled.li(_t6 || (_t6 = _`
  margin-bottom: 0.5rem;
  ${0};
`), props => props.nostyle ? 'list-style-type: none;' : '');
const Container = styled.div(_t7 || (_t7 = _`
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
const StyledBanner = styled.div(_t8 || (_t8 = _`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  grid-column: 1 / -1;
  height: 2.875rem;
`));
const StyledRescanButton = styled.button(_t9 || (_t9 = _`
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
`));
const Spinner = styled.div(_t10 || (_t10 = _`
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
`));
const fixText = 'Learn more';

const ActiveWarnings = ({
  warnings
}) => {
  if (!warnings || !warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("code", null, ":active"), " styles on iOS"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", null, ":active"), " styles will only appear in iOS", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "if a touch listener is added to the element or one of its ancestors"), ". Once activated in this manner, ", /*#__PURE__*/React.createElement("code", null, ":active"), " styles (along with", ' ', /*#__PURE__*/React.createElement("code", null, ":hover"), " styles) will be applied immediately in iOS when a user taps, possibly creating a confusing UX. (On Android,", ' ', /*#__PURE__*/React.createElement("code", null, ":active"), " styles are applied with a slight delay to allow the user to use gestures like scroll without necessarily activating", ' ', /*#__PURE__*/React.createElement("code", null, ":active"), " styles.)"), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i
  }, /*#__PURE__*/React.createElement("code", null, w.type), " with content\xA0\xA0", w.text ? /*#__PURE__*/React.createElement("b", null, w.text) : w.html ? /*#__PURE__*/React.createElement(StyledTappableContents, {
    dangerouslySetInnerHTML: {
      __html: w.html
    }
  }) : '[no text found]'))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '1rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari/33681490#33681490",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Relevant Stack Overflow thread"))));
};

const TapWarnings = ({
  warnings
}) => {
  if (!warnings || !warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, "Tap style removed from tappable element"), /*#__PURE__*/React.createElement("p", null, "These elements have an invisible", ' ', /*#__PURE__*/React.createElement("code", null, "-webkit-tap-highlight-color"), ". While this might be intentional, please verify that they have appropriate tap indication styles added through other means."), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i
  }, /*#__PURE__*/React.createElement("code", null, w.type), " with content\xA0\xA0", w.text ? /*#__PURE__*/React.createElement("b", null, w.text) : w.html ? /*#__PURE__*/React.createElement(StyledTappableContents, {
    dangerouslySetInnerHTML: {
      __html: w.html
    }
  }) : '[no text found]'))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", null, "Some stylesheets remove the tap indication highlight shown on iOS and Android browsers by adding the code", ' ', /*#__PURE__*/React.createElement("code", null, "-webkit-tap-highlight-color: transparent"), ". In order to maintain a good mobile experience, tap styles should be added via appropriate ", /*#__PURE__*/React.createElement("code", null, ":active"), " CSS styles (though, note that", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("code", null, ":active"), " styles work inconsistently in iOS"), ") , or via JavaScript on the ", /*#__PURE__*/React.createElement("code", null, "touchstart"), " event.")));
};

const AutocompleteWarnings = ({
  warnings
}) => {
  if (!warnings || !warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Input with no ", /*#__PURE__*/React.createElement("code", null, "autocomplete"), " attribute"), /*#__PURE__*/React.createElement("p", null, "Most textual inputs should have an explicit ", /*#__PURE__*/React.createElement("code", null, "autocomplete"), ' ', "attribute."), /*#__PURE__*/React.createElement("p", null, "If you truly want to disable autocomplete, try using a", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "semantically valid but unique value rather than", ' ', /*#__PURE__*/React.createElement("code", null, "autocomplete=\"off\"")), ", which doesn't work in Chrome."), /*#__PURE__*/React.createElement("p", null, "Note: ", /*#__PURE__*/React.createElement("code", null, "autocomplete"), " is styled as ", /*#__PURE__*/React.createElement("code", null, "autoComplete"), ' ', "in JSX."), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i
  }, /*#__PURE__*/React.createElement("code", null, "input type=\"", w.type, "\""), " and label", ' ', /*#__PURE__*/React.createElement("b", null, w.labelText || '[no label found]')))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Autocomplete documentation by Google")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Autocomplete documentation by Mozilla")))));
};

const InputTypeWarnings = ({
  warnings
}) => {
  if (!warnings || !warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, "Plain input type ", /*#__PURE__*/React.createElement("code", null, "text"), " detected"), /*#__PURE__*/React.createElement("p", null, "This will render the default text keyboard on mobile (which could very well be what you want!) If you haven't already, take a moment to make sure this is correct. You can use", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://better-mobile-inputs.netlify.com/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "this tool"), ' ', "to explore keyboard options."), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i
  }, /*#__PURE__*/React.createElement("code", null, "input type=\"", w.type, "\""), " and label", ' ', /*#__PURE__*/React.createElement("b", null, w.labelText || '[no label found]')))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: "https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Article reviewing the importance of using correct input types on the mobile web from CSS Tricks."))));
};

const InputTypeNumberWarnings = ({
  warnings
}) => {
  if (!warnings || !warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, "Input type ", /*#__PURE__*/React.createElement("code", null, "number"), " detected"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", null, "<input type=\"text\" inputmode=\"decimal\"/>"), ' ', "could give you improved usability over", ' ', /*#__PURE__*/React.createElement("code", null, "<input type=\"number\" />"), "."), /*#__PURE__*/React.createElement("p", null, "Note: ", /*#__PURE__*/React.createElement("code", null, "inputmode"), " is styled as ", /*#__PURE__*/React.createElement("code", null, "inputMode"), " in JSX.", ' '), /*#__PURE__*/React.createElement("ul", null, warnings.map((w, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i
  }, /*#__PURE__*/React.createElement("code", null, "input type=\"", w.type, "\""), " and label", ' ', /*#__PURE__*/React.createElement("b", null, w.labelText || '[no label found]')))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: "https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Overview of the issues with", ' ', /*#__PURE__*/React.createElement("code", null, "input type=\"number\""), " from gov.uk."))));
};

const HeightWarnings = ({
  warnings
}) => {
  if (!warnings || !warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Hint, null), /*#__PURE__*/React.createElement("h3", null, "Usage of ", /*#__PURE__*/React.createElement("code", null, "100vh"), " CSS"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: "https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Viewport units are tricky on mobile."), ' ', "On some mobile browers, depending on scroll position, ", /*#__PURE__*/React.createElement("code", null, "100vh"), ' ', "might take up more than 100% of screen height due to browser chrome like the address bar."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
    path
  }, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i
  }, /*#__PURE__*/React.createElement("code", null, path)))));
};

const BackgroundImageWarnings = ({
  warnings
}) => {
  if (!warnings || !warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Non-dynamic background image"), /*#__PURE__*/React.createElement("p", null, "Downloading larger-than-necessary images hurts performance for users on mobile. You can use", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS/image-set",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("code", null, "image-set")), ' ', "to serve an appropriate background image based on the user's device resolution."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
    src,
    alt
  }, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i,
    nostyle: true
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DemoImg, {
    src: src,
    alt: alt
  }))))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://css-tricks.com/responsive-images-css/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Article discussing responsive background images in greater detail, including the interaction of ", /*#__PURE__*/React.createElement("code", null, "image-set"), " with media queries, from CSS Tricks.")))));
};

const SrcsetWarnings = ({
  warnings
}) => {
  if (!warnings || !warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Large image without ", /*#__PURE__*/React.createElement("code", null, "srcset")), /*#__PURE__*/React.createElement("p", null, "Downloading larger-than-necessary images hurts performance for users on mobile. You can use ", /*#__PURE__*/React.createElement("code", null, "srcset"), " to customize image sizes for different device resolutions and sizes."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
    src,
    alt
  }, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i,
    nostyle: true
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DemoImg, {
    src: src,
    alt: alt
  }))))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://cloudfour.com/thinks/responsive-images-the-simple-way",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Summary of the why and how of responsive images")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://www.responsivebreakpoints.com/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "A tool to generate responsive images")))));
};

const TouchTargetWarnings = ({
  warnings
}) => {
  if (!warnings) return null;
  const {
    underMinSize,
    tooClose
  } = warnings;
  if (!underMinSize.length && !tooClose.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), Boolean(underMinSize.length) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Small touch target"), /*#__PURE__*/React.createElement("p", null, "With heights and/or widths of less than ", MIN_SIZE, "px, these tappable elements could be difficult for users to press:"), /*#__PURE__*/React.createElement("ul", null, underMinSize.map((w, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i
  }, /*#__PURE__*/React.createElement("code", null, w.type), " with content\xA0\xA0", w.text ? /*#__PURE__*/React.createElement("b", null, w.text) : w.html ? /*#__PURE__*/React.createElement(StyledTappableContents, {
    dangerouslySetInnerHTML: {
      __html: w.html
    }
  }) : '[no text found]')))), Boolean(tooClose.length) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: underMinSize.length ? '.5rem' : '0'
    }
  }, "Touch targets close together", ' '), /*#__PURE__*/React.createElement("p", null, "These tappable elements are less than ", RECOMMENDED_DISTANCE, "px from at least one other tappable element:"), /*#__PURE__*/React.createElement("ul", null, tooClose.map((w, i) => /*#__PURE__*/React.createElement(ListEntry, {
    key: i
  }, /*#__PURE__*/React.createElement("code", null, w.type), " with content\xA0\xA0", w.text ? /*#__PURE__*/React.createElement("b", null, w.text) : w.html ? /*#__PURE__*/React.createElement(StyledTappableContents, {
    dangerouslySetInnerHTML: {
      __html: w.html
    }
  }) : '[no text found]')))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://www.nngroup.com/articles/touch-target-size/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Touch target size article from the Nielsen Norman Group")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://web.dev/accessible-tap-targets/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tap target size recommendations from Google")))));
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

const Loading = withTheme(({
  theme
}) => /*#__PURE__*/React.createElement(Wrapper, {
  theme: theme
}, /*#__PURE__*/React.createElement(StyledBanner, null, /*#__PURE__*/React.createElement(Spinner, null), /*#__PURE__*/React.createElement("span", null, "Running scan..."))));

const Hints = ({
  container,
  theme
}) => {
  const [warnings, setWarnings] = React.useState(undefined);
  const [scanComplete, setScanComplete] = React.useState(false);
  const [rescan, setRescan] = React.useState(0);
  React.useEffect(() => {
    setScanComplete(false);
    setWarnings(getInstantWarnings(container));
    return getScheduledWarnings(container, setWarnings, setScanComplete);
  }, [container, rescan]);
  const warningCount = React.useMemo(() => warnings ? Object.keys(warnings).reduce((acc, key) => {
    const curr = warnings[key];
    const count = Array.isArray(curr) ? convertToBool(curr.length) : //touchTarget returns an object not an array
    Object.keys(curr).map(key => curr[key]).reduce((acc, curr) => {
      return acc + convertToBool(curr.length);
    }, 0);
    return acc + count;
  }, 0) : 0, [warnings]); // Before counting, show the Loading state

  if (!warnings) {
    return /*#__PURE__*/React.createElement(Loading, null);
  }

  const onRescanClick = () => setRescan(prev => prev + 1);

  if (warningCount === 0 && scanComplete) {
    return /*#__PURE__*/React.createElement(Wrapper, {
      theme: theme
    }, /*#__PURE__*/React.createElement(StyledBanner, null, /*#__PURE__*/React.createElement("span", null, "Scan complete! No issues found."), /*#__PURE__*/React.createElement(StyledRescanButton, {
      onClick: onRescanClick,
      type: "button"
    }, "Rescan")));
  }

  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(StyledBanner, null, scanComplete ? /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("span", null, "Scan complete! ", warningCount, " issues found."), /*#__PURE__*/React.createElement(StyledRescanButton, {
    onClick: onRescanClick,
    type: "button"
  }, "Rescan")) : /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Spinner, null), /*#__PURE__*/React.createElement("span", null, warningCount > 0 ? `Running scan - ${warningCount} issues found so far` : 'Running scan', "..."))), /*#__PURE__*/React.createElement(TouchTargetWarnings, {
    warnings: warnings.touchTarget
  }), /*#__PURE__*/React.createElement(AutocompleteWarnings, {
    warnings: warnings.autocomplete
  }), /*#__PURE__*/React.createElement(InputTypeWarnings, {
    warnings: warnings.inputType
  }), /*#__PURE__*/React.createElement(InputTypeNumberWarnings, {
    warnings: warnings.inputTypeNumber
  }), /*#__PURE__*/React.createElement(TapWarnings, {
    warnings: warnings.tapHighlight
  }), /*#__PURE__*/React.createElement(ActiveWarnings, {
    warnings: warnings.active
  }), /*#__PURE__*/React.createElement(SrcsetWarnings, {
    warnings: warnings.srcset
  }), /*#__PURE__*/React.createElement(BackgroundImageWarnings, {
    warnings: warnings.backgroundImg
  }), /*#__PURE__*/React.createElement(HeightWarnings, {
    warnings: warnings.height
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
  }, [active]); // eslint-disable-line

  return null;
};

const StateWrapper = ({
  children
}) => {
  const [storyId, setStoryId] = React.useState('');
  useChannel({
    [STORY_RENDERED]: (...args) => {
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
  active,
  storyId
}) => {
  const [html, setHTML] = React.useState(undefined);
  React.useEffect(() => {
    // clear HTML when storyId changes
    setHTML(undefined); // check for container

    let timeoutId = undefined;

    const checkContainer = () => {
      const container = getContainer();

      if (!container || !container.body) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkContainer, delay);
      } else {
        setHTML(container.body.innerHTML);
      }
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(checkContainer, delay);
    return () => clearTimeout(timeoutId);
  }, [storyId]);
  const container = getContainer();
  if (!active) return null;

  if (!html || !container) {
    return /*#__PURE__*/React.createElement(Loading, null);
  }

  return /*#__PURE__*/React.createElement(Hints$1, {
    container: container
  });
};

addons.register(ADDON_ID, () => {
  const render = ({
    active,
    key
  }) => {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: "storybook-mobile"
    }, /*#__PURE__*/React.createElement(ViewportManager, {
      active: active
    }), /*#__PURE__*/React.createElement(AddonPanel, {
      key: key,
      active: active
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
