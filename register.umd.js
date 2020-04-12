(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@storybook/addons'), require('@storybook/core-events'), require('@storybook/api'), require('@storybook/components'), require('react'), require('@emotion/styled')) :
  typeof define === 'function' && define.amd ? define(['@storybook/addons', '@storybook/core-events', '@storybook/api', '@storybook/components', 'react', '@emotion/styled'], factory) :
  (factory(global.addons,global.coreEvents,global.api,global.components,global.react,global.styled));
}(this, (function (addons,coreEvents,api,components,React,styled) {
  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  styled = styled && styled.hasOwnProperty('default') ? styled['default'] : styled;

  function getDomPath(el) {
    var stack = [];

    while (el.parentNode) {
      var sibCount = 0;
      var sibIndex = 0;

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

    var toFilter = ['html', 'body', 'div#root'];
    return stack.filter(function (el) { return !toFilter.includes(el); }).join(' > ');
  }

  var getActiveStyles = function (container, el) {
    var sheets = container.styleSheets;
    var result = [];
    var activeRegex = /:active$/;
    Object.keys(sheets).forEach(function (k) {
      var rules = sheets[k].rules || sheets[k].cssRules;
      rules.forEach(function (rule) {
        if (!rule) { return; }
        if (!rule.selectorText || !rule.selectorText.match(activeRegex)) { return; }
        var ruleNoPseudoClass = rule.selectorText.replace(activeRegex, '');

        if (el.matches(ruleNoPseudoClass)) {
          result.push(rule);
        }
      });
    });
    return result.length ? result : null;
  };

  var getElements = function (container, tag) { return [].concat( container.querySelectorAll(tag) ); };

  var getActiveWarnings = function (container) {
    var buttons = getElements(container, 'button');
    var links = getElements(container, 'a');

    var filterActiveStyles = function (el) {
      var activeStyles = getActiveStyles(container, el);
      if (activeStyles) { return false; }
      return true;
    };

    return buttons.concat(links).filter(filterActiveStyles).map(function (el) { return ({
      type: el.nodeName === 'A' ? 'Link' : 'Button',
      text: el.innerText,
      path: getDomPath(el)
    }); });
  };
  var getSrcsetWarnings = function (container) {
    var images = getElements(container, 'img');
    var warnings = images.filter(function (img) {
      var src = img.getAttribute('src');
      var srcSet = img.getAttribute('srcset');
      if (srcSet) { return false; }
      var isSVG = Boolean(src.match(/svg$/));
      if (isSVG) { return false; }
      var isLarge = parseInt(getComputedStyle(img).width, 10) > 300 || img.naturalWidth > 300;
      if (!isLarge) { return false; }
      return true;
    }).map(function (img) {
      return {
        src: img.src,
        path: getDomPath(img),
        alt: img.alt
      };
    });
    return warnings;
  };
  var textInputs = ['text', 'search', 'tel', 'url', 'email', 'number', 'password'];

  var attachLabels = function (inputs, container) {
    return inputs.map(function (input) {
      var labelText = '';
      if (input.parentElement.nodeName === 'LABEL') { labelText = input.parentElement.innerText; }

      if (input.id) {
        var label = container.querySelector(("label for=\"" + (input.id) + "\""));
        if (label) { labelText = label.innerText; }
      }

      return {
        path: getDomPath(input),
        labelText: labelText,
        type: input.type
      };
    });
  };

  var getAutocompleteWarnings = function (container) {
    var inputs = getElements(container, 'input');
    var warnings = inputs.filter(function (input) {
      var currentType = input.getAttribute('type');
      var autocomplete = input.getAttribute('autocomplete');

      if (textInputs.find(function (type) { return currentType === type; }) && !autocomplete) {
        return true;
      }

      return false;
    });
    return attachLabels(warnings, container);
  };
  var getOverflowAutoWarnings = function (container) {
    return getElements(container, '#root *').filter(function (el) {
      var style = getComputedStyle(el);

      if (style.overflow === 'scroll' || style.overflow === 'auto') {
        if (style['-webkit-overflow-scrolling'] !== 'touch') {
          return true;
        }
      }

      return false;
    }).map(function (el) { return ({
      path: getDomPath(el)
    }); });
  };
  var getOriginalStyles = function (container, el) {
    var sheets = container.styleSheets;
    var result = [];
    Object.keys(sheets).forEach(function (k) {
      var rules = sheets[k].rules || sheets[k].cssRules;
      rules.forEach(function (rule) {
        if (!rule) { return; }

        if (el.matches(rule.selectorText)) {
          result.push(rule);
        }
      });
    });
    return result.length ? result : null;
  };
  var get100vhWarning = function (container) {
    return getElements(container, '#root *').map(function (el) {
      var styles = getOriginalStyles(container, el);
      if (!styles) { return false; }
      var hasVHWarning = styles.find(function (style) { return /100vh/.test(style.cssText); });
      if (hasVHWarning) { return {
        el: el,
        css: hasVHWarning.cssText
      }; }
      return null;
    }).filter(Boolean).map(function (data) { return (Object.assign({}, data,
      {path: getDomPath(data.el)})); });
  };
  var getInputTypeWarnings = function (container) {
    var inputs = getElements(container, 'input[type="text"]').filter(function (input) { return !input.getAttribute('inputmode'); });
    return attachLabels(inputs, container);
  };
  var minSize = 40;
  var getTouchTargetSizeWarning = function (container) {
    var buttons = getElements(container, 'button');
    var links = getElements(container, 'a');

    var tooSmall = function (el) {
      var ref = el.getBoundingClientRect();
      var width = ref.width;
      var height = ref.height;

      if (width < minSize || height < minSize) {
        return {
          type: el.nodeName === 'A' ? 'Link' : 'Button',
          path: getDomPath(el),
          text: el.innerText,
          width: Math.floor(width),
          height: Math.floor(height)
        };
      }

      return null;
    };

    var tooSmallButtons = buttons.map(tooSmall).filter(Boolean);
    var tooSmallLinks = links.map(tooSmall).filter(Boolean);
    return tooSmallButtons.concat(tooSmallLinks);
  };

  var templateObject$3 = Object.freeze(["\n  margin-bottom: 0.5rem;\n"]);
  var templateObject$2 = Object.freeze(["\n  height: 4rem;\n  width: auto;\n  max-width: 100%;\n"]);
  var templateObject$1 = Object.freeze(["\n  font-size: ", "px;\n  h2 {\n    font-weight: bold;\n    font-size: ", "px;\n    margin-top: 0;\n    margin-bottom: 0;\n    padding: 0.5rem 0 0.5rem 1rem;\n    background: ", ";\n    border-bottom: 1px solid ", ";\n\n    svg {\n      height: 0.8rem;\n      position: relative;\n      top: 0.075rem;\n      margin-right: 0.5rem;\n    }\n  }\n  h3 {\n    font-size: ", "px;\n    font-weight: bold;\n    margin-bottom: 0.5rem;\n    margin-top: 0;\n  }\n\n  code {\n    font-size: 0.85rem;\n    background: hsla(0, 0%, 50%, 0.1);\n    border-radius: 3px;\n  }\n\n  summary {\n    cursor: pointer;\n    display: inline-block;\n    padding: 0.2rem 0.3rem;\n    border-radius: 5px;\n    color: ", ";\n    &:focus {\n      outline: none;\n      box-shadow: 0 0 0 3px ", ";\n    }\n  }\n\n  ul {\n    padding-left: 1.25rem;\n  }\n  a {\n    text-decoration: none;\n    color: ", ";\n    &:hover {\n      border-bottom: 1px solid ", ";\n    }\n  }\n"]);
  var templateObject = Object.freeze(["\n  > div {\n    border-bottom: 1px solid ", ";\n    padding: 0.75rem;\n  }\n"]);

  var Info = function () { return React.createElement( 'svg', { 'aria-hidden': "true", focusable: "false", 'data-prefix': "fas", 'data-icon': "eye", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 576 512" },
      React.createElement( 'path', { fill: "currentColor", d: "M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" })
    ); };

  var Warning = function () {
    return React.createElement( 'svg', { 'aria-hidden': "true", focusable: "false", 'data-prefix': "fas", 'data-icon': "exclamation-circle", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
        React.createElement( 'path', { fill: "currentColor", d: "M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" })
      );
  };

  var accessibleBlue = 'rgb(20, 116, 243)';
  var StyledContentContainer = styled.div(templateObject, function (ref) {
    var theme = ref.theme;

    return theme.color.medium;
  });
  var StyledContainer = styled.div(templateObject$1, function (ref) {
    var theme = ref.theme;

    return theme.typography.size.s2;
  }, function (ref) {
    var theme = ref.theme;

    return theme.typography.size.s2;
  }, function (ref) {
    var theme = ref.theme;

    return theme.color.light;
  }, function (ref) {
    var theme = ref.theme;

    return theme.color.medium;
  }, function (ref) {
    var theme = ref.theme;

    return theme.typography.size.s2;
  }, accessibleBlue, function (ref) {
    var theme = ref.theme;

    return theme.color.light;
  }, accessibleBlue, accessibleBlue);
  var StyledImg = styled.img(templateObject$2);
  var StyledEntry = styled.li(templateObject$3);
  var fixText = 'Learn more';

  var ActiveWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React.createElement( 'div', null,
        React.createElement( 'h3', null, "Missing ", React.createElement( 'code', null, ":active" ), " styles" ),
        React.createElement( 'p', null, "Clear ", React.createElement( 'code', null, ":active" ), " styles are key to ensuring users on mobile get instantaneous feedback on tap, even on slower devices." ),
        React.createElement( 'ul', null,
          warnings.map(function (w) {
          return React.createElement( StyledEntry, null,
                w.type, " with text ", React.createElement( 'b', null, w.text ), " (", React.createElement( 'code', null, w.path ), ")" );
        })
        ),
        React.createElement( 'details', null,
          React.createElement( 'summary', null, fixText ),
          React.createElement( 'p', null,
            React.createElement( 'a', { href: "https://fvsch.com/styling-buttons/#states" }, "This article"), ' ', "offers a great overview of how to style buttons." )
        )
      );
  };

  var AutocompleteWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React.createElement( 'div', null,
        React.createElement( 'h3', null, "Missing ", React.createElement( 'code', null, "autocomplete" ), " prop" ),
        React.createElement( 'p', null, "Most, if not all, textual inputs should have an explicit", ' ',
          React.createElement( 'code', null, "autocomplete" ), " prop." ),
        React.createElement( 'ul', null,
          warnings.map(function (w) {
          return React.createElement( StyledEntry, null, "Input with type ", React.createElement( 'code', null, w.type ), " and label", ' ',
                React.createElement( 'b', null, w.labelText ), " (", React.createElement( 'code', null, w.path ), ")" );
        })
        ),
        React.createElement( 'details', null,
          React.createElement( 'summary', null, fixText ),
          React.createElement( 'p', null,
            React.createElement( 'a', { href: "https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill" }, "Google autocomplete documentation")
          ),
          React.createElement( 'p', null,
            React.createElement( 'a', { href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete" }, "Mozilla autocomplete documentation")
          )
        )
      );
  };

  var InputTypeWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React.createElement( 'div', null,
        React.createElement( 'h3', null, "Input type ", React.createElement( 'code', null, "text" ), " with no ", React.createElement( 'code', null, "inputmode" ), ' '
        ),
        React.createElement( 'div', null, "This will render the default text keyboard on mobile (which could very well be what you want!)", ' ',
          React.createElement( 'a', { href: "https://better-mobile-inputs.netlify.com/" }, "If you haven't already, take a moment to make sure this is correct.", ' '
          )
        ),
        React.createElement( 'ul', null,
          warnings.map(function (w) {
          return React.createElement( StyledEntry, null, "Input with type ", React.createElement( 'code', null, w.type ), " and label", ' ',
                React.createElement( 'b', null, w.labelText ), " ", React.createElement( 'code', null, "(", w.path, ")" )
              );
        })
        )
      );
  };

  var OverflowWarning = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React.createElement( 'div', null,
        React.createElement( 'h3', null, "Scrollable container without", ' ',
          React.createElement( 'code', null, "-webkit-overflow-scrolling:touch" )
        ),
        React.createElement( 'p', null, "This element will scroll awkwardly and abruptly on iOS." ),
        React.createElement( 'ul', null,
          warnings.map(function (ref) {
          var path = ref.path;

          return React.createElement( StyledEntry, null,
                React.createElement( 'code', null, path )
              );
        })
        ),
        React.createElement( 'details', null,
          React.createElement( 'summary', null, fixText ),
          React.createElement( 'p', null, "To ensure your users benefit from momentum scrolling, add this line of CSS: ", React.createElement( 'code', null, "-webkit-overflow-scrolling:touch" ), " to any container with a style of ", React.createElement( 'code', null, "overflow: auto" ), " or", ' ',
            React.createElement( 'code', null, "overflow: scroll" ), ".", ' ',
            React.createElement( 'a', { href: "https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling" }, "Learn more about the property here.")
          )
        )
      );
  };

  var HeightWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React.createElement( 'div', null,
        React.createElement( 'h3', null, "Usage of ", React.createElement( 'code', null, "100vh" ), " CSS" ),
        React.createElement( 'p', null, "Viewport units are", ' ',
          React.createElement( 'a', { href: "https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html" }, "tricky on mobile.")
        ),
        React.createElement( 'ul', null,
          warnings.map(function (ref) {
          var path = ref.path;

          return React.createElement( StyledEntry, null,
                React.createElement( 'code', null, path )
              );
        })
        )
      );
  };

  var SrcsetWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React.createElement( 'div', null,
        React.createElement( 'h3', null, "Large image without ", React.createElement( 'code', null, "srscset" )
        ),
        React.createElement( 'p', null, "Forcing your users on phones to download huge images will slow them down. Use ", React.createElement( 'code', null, "srcset" ), " for a simple way to customize image sizes to your users' needs." ),
        React.createElement( 'ul', null,
          warnings.map(function (ref) {
          var src = ref.src;
          var alt = ref.alt;

          return React.createElement( StyledEntry, null,
                React.createElement( 'div', null,
                  React.createElement( StyledImg, { src: src, alt: alt })
                )
              );
        })
        ),
        React.createElement( 'details', null,
          React.createElement( 'summary', null, fixText ),
          React.createElement( 'p', null, "Here's a", ' ',
            React.createElement( 'a', { href: "https://cloudfour.com/thinks/responsive-images-the-simple-way" }, "good overview of the problem and how to solve it with", ' ',
              React.createElement( 'code', null, "srcset" )
            ), "." )
        )
      );
  };

  var TouchTargetWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React.createElement( 'div', null,
        React.createElement( 'h3', null, "Touch target too small " ),
        React.createElement( 'p', null, "It's important that clickable elements are large enough for users to easily trigger, which generally means >= 40px including padding." ),
        React.createElement( 'ul', null,
          warnings.map(function (w) {
          return React.createElement( StyledEntry, null,
                React.createElement( 'div', null,
                  w.type, " with text ", React.createElement( 'b', null, w.text ), " ", React.createElement( 'code', null, w.path )
                ),
                w.width < 42 && React.createElement( 'div', null, "width: ", w.width, "px" ),
                w.height < 42 && React.createElement( 'div', null, "height: ", w.height, "px" )
              );
        })
        ),
        React.createElement( 'details', null,
          React.createElement( 'summary', null, fixText ),
          React.createElement( 'p', null,
            React.createElement( 'a', { href: "https://material.io/design/usability/accessibility.html#layout-typography" }, "Material design accessibility guidelines")
          )
        )
      );
  };

  var Hints = function (ref) {
    var container = ref.container;

    var activeWarnings = getActiveWarnings(container);
    var autocompleteWarnings = getAutocompleteWarnings(container);
    var inputTypeWarnings = getInputTypeWarnings(container);
    var touchTargetWarnings = getTouchTargetSizeWarning(container);
    var overflowWarnings = getOverflowAutoWarnings(container);
    var srcsetWarnings = getSrcsetWarnings(container);
    var heightWarnings = get100vhWarning(container);
    var warningCount = activeWarnings.length + autocompleteWarnings.length + touchTargetWarnings.length + overflowWarnings.length + srcsetWarnings.length + inputTypeWarnings.length + overflowWarnings.length + heightWarnings.length;
    var tipsCount = inputTypeWarnings.length + heightWarnings.length;
    React.useEffect(function () {
      var tab = [].concat( document.querySelectorAll('button[role="tab"]') ).find(function (el) { return /^Mobile(\s\(\d\))?$/.test(el.innerText); });

      if (tab) {
        if (warningCount === 0) {
          tab.innerText = 'Mobile';
        } else {
          tab.innerText = "Mobile (" + warningCount + ")";
        }
      }
    });
    var renderWarnings = warningCount > 0;
    return React.createElement( StyledContainer, null,
        Boolean(renderWarnings) && React.createElement( 'div', null,
            React.createElement( 'h2', null,
              ' ',
              React.createElement( Warning, null ), " Warnings (", warningCount - tipsCount, " element ", warningCount - tipsCount > 1 ? 's' : '', ")" ),
            React.createElement( StyledContentContainer, null,
              React.createElement( ActiveWarnings, { warnings: activeWarnings }),
              React.createElement( TouchTargetWarnings, { warnings: touchTargetWarnings }),
              React.createElement( AutocompleteWarnings, { warnings: autocompleteWarnings }),
              React.createElement( SrcsetWarnings, { warnings: srcsetWarnings }),
              React.createElement( OverflowWarning, { warnings: overflowWarnings })
            )
          ),

        Boolean(tipsCount) && React.createElement( 'div', null,
            React.createElement( 'h2', null,
              React.createElement( Info, null ), " Tips (", tipsCount, " element", tipsCount > 1 ? 's' : '', ")" ),
            React.createElement( StyledContentContainer, null,
              React.createElement( InputTypeWarnings, { warnings: inputTypeWarnings }),
              React.createElement( HeightWarnings, { warnings: heightWarnings })
            )
          )
      );
  };

  var templateObject$4 = Object.freeze(["\n  padding: 1rem;\n  font-weight: bold;\n"]);
  var StyledLoading = styled.div(templateObject$4);
  var ADDON_ID = 'mobile-hints';
  var PARAM_KEY = 'mobile-hints';
  var PANEL_ID = ADDON_ID + "/panel";
  var viewportId = 'storybook/viewport';
  var noViewport = 'reset';
  var defaultViewport = 'mobile1';

  var ViewportManager = function (ref) {
    var active = ref.active;

    var ref$1 = api.useAddonState(viewportId);
    var viewportState = ref$1[0];
    var setViewportState = ref$1[1];
    var cachedState = React.useRef(null);
    React.useEffect(function () {
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

  var StateWrapper = function (ref) {
    var obj;

    var children = ref.children;
    var ref$1 = React.useState('');
    var storyId = ref$1[0];
    var setStoryId = ref$1[1];
    api.useChannel(( obj = {}, obj[coreEvents.STORY_CHANGED] = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        setStoryId(args);
      }, obj ));
    return React.cloneElement(children, {
      storyId: storyId
    });
  };

  var getContainer = function () {
    var iframe = document.getElementById('storybook-preview-iframe');
    if (!iframe) { return null; }
    return iframe.contentDocument;
  };

  var delay = 1000;

  var MyPanel = function (ref) {
    var storyId = ref.storyId;

    var ref$1 = React.useState('');
    var html = ref$1[0];
    var setHTML = ref$1[1];
    React.useEffect(function () {
      var setContainer = function () {
        var container = getContainer();

        if (!container || !container.body) {
          setTimeout(setContainer, delay);
          return;
        }

        setHTML(container.body.innerHTML);
      };

      setTimeout(setContainer, delay);
    }, [storyId]);
    if (!html) { return React.createElement( StyledLoading, null, "Running mobile audit..." ); }
    var container = getContainer();
    return React.createElement( Hints, { container: container });
  };

  addons.addons.register(ADDON_ID, function () {
    var render = function (ref) {
      var active = ref.active;
      var key = ref.key;

      return React.createElement( React.Fragment, null,
          React.createElement( ViewportManager, { active: active }),
          React.createElement( components.AddonPanel, { active: active, key: key },
            React.createElement( StateWrapper, { active: active },
              React.createElement( MyPanel, { key: key, active: active })
            )
          )
        );
    };

    var title = 'Mobile';
    addons.addons.add(PANEL_ID, {
      type: addons.types.PANEL,
      title: title,
      render: render,
      paramKey: PARAM_KEY
    });
  });

})));
