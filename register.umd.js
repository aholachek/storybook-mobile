(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@storybook/addons'), require('@storybook/core-events'), require('@storybook/api'), require('@storybook/components'), require('react'), require('styled-components'), require('emotion-theming')) :
  typeof define === 'function' && define.amd ? define(['@storybook/addons', '@storybook/core-events', '@storybook/api', '@storybook/components', 'react', 'styled-components', 'emotion-theming'], factory) :
  (factory(global.addons,global.coreEvents,global.api,global.components,global.react,global.styled,global.emotionTheming));
}(this, (function (addons,coreEvents,api,components,React,styled,emotionTheming) {
  var React__default = 'default' in React ? React['default'] : React;
  var styled__default = 'default' in styled ? styled['default'] : styled;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function memoize(fn) {
    var cache = {};
    return function (arg) {
      if (cache[arg] === undefined) cache[arg] = fn(arg);
      return cache[arg];
    };
  }

  var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

  var index = memoize(function (prop) {
    return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
    /* o */
    && prop.charCodeAt(1) === 110
    /* n */
    && prop.charCodeAt(2) < 91;
  }
  /* Z+1 */
  );

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var inheritsLoose = _inheritsLoose;

  /*

  Based off glamor's StyleSheet, thanks Sunil ❤️

  high performance StyleSheet for css-in-js systems

  - uses multiple style tags behind the scenes for millions of rules
  - uses `insertRule` for appending in production for *much* faster performance

  // usage

  import { StyleSheet } from '@emotion/sheet'

  let styleSheet = new StyleSheet({ key: '', container: document.head })

  styleSheet.insert('#box { border: 1px solid red; }')
  - appends a css rule into the stylesheet

  styleSheet.flush()
  - empties the stylesheet of all its contents

  */
  // $FlowFixMe
  function sheetForTag(tag) {
    if (tag.sheet) {
      // $FlowFixMe
      return tag.sheet;
    } // this weirdness brought to you by firefox

    /* istanbul ignore next */


    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode === tag) {
        // $FlowFixMe
        return document.styleSheets[i];
      }
    }
  }

  function createStyleElement(options) {
    var tag = document.createElement('style');
    tag.setAttribute('data-emotion', options.key);

    if (options.nonce !== undefined) {
      tag.setAttribute('nonce', options.nonce);
    }

    tag.appendChild(document.createTextNode(''));
    return tag;
  }

  var StyleSheet =
  /*#__PURE__*/
  function () {
    function StyleSheet(options) {
      this.isSpeedy = options.speedy === undefined ? process.env.NODE_ENV === 'production' : options.speedy;
      this.tags = [];
      this.ctr = 0;
      this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

      this.key = options.key;
      this.container = options.container;
      this.before = null;
    }

    var _proto = StyleSheet.prototype;

    _proto.insert = function insert(rule) {
      // the max length is how many rules we have per style tag, it's 65000 in speedy mode
      // it's 1 in dev because we insert source maps that map a single rule to a location
      // and you can only have one source map per style tag
      if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
        var _tag = createStyleElement(this);

        var before;

        if (this.tags.length === 0) {
          before = this.before;
        } else {
          before = this.tags[this.tags.length - 1].nextSibling;
        }

        this.container.insertBefore(_tag, before);
        this.tags.push(_tag);
      }

      var tag = this.tags[this.tags.length - 1];

      if (this.isSpeedy) {
        var sheet = sheetForTag(tag);

        try {
          // this is a really hot path
          // we check the second character first because having "i"
          // as the second character will happen less often than
          // having "@" as the first character
          var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64; // this is the ultrafast version, works across browsers
          // the big drawback is that the css won't be editable in devtools

          sheet.insertRule(rule, // we need to insert @import rules before anything else
          // otherwise there will be an error
          // technically this means that the @import rules will
          // _usually_(not always since there could be multiple style tags)
          // be the first ones in prod and generally later in dev
          // this shouldn't really matter in the real world though
          // @import is generally only used for font faces from google fonts and etc.
          // so while this could be technically correct then it would be slower and larger
          // for a tiny bit of correctness that won't matter in the real world
          isImportRule ? 0 : sheet.cssRules.length);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn("There was a problem inserting the following rule: \"" + rule + "\"", e);
          }
        }
      } else {
        tag.appendChild(document.createTextNode(rule));
      }

      this.ctr++;
    };

    _proto.flush = function flush() {
      // $FlowFixMe
      this.tags.forEach(function (tag) {
        return tag.parentNode.removeChild(tag);
      });
      this.tags = [];
      this.ctr = 0;
    };

    return StyleSheet;
  }();

  function stylis_min (W) {
    function M(d, c, e, h, a) {
      for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
        g = e.charCodeAt(l);
        l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

        if (0 === b + n + v + m) {
          if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
            switch (g) {
              case 32:
              case 9:
              case 59:
              case 13:
              case 10:
                break;

              default:
                f += e.charAt(l);
            }

            g = 59;
          }

          switch (g) {
            case 123:
              f = f.trim();
              q = f.charCodeAt(0);
              k = 1;

              for (t = ++l; l < B;) {
                switch (g = e.charCodeAt(l)) {
                  case 123:
                    k++;
                    break;

                  case 125:
                    k--;
                    break;

                  case 47:
                    switch (g = e.charCodeAt(l + 1)) {
                      case 42:
                      case 47:
                        a: {
                          for (u = l + 1; u < J; ++u) {
                            switch (e.charCodeAt(u)) {
                              case 47:
                                if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                  l = u + 1;
                                  break a;
                                }

                                break;

                              case 10:
                                if (47 === g) {
                                  l = u + 1;
                                  break a;
                                }

                            }
                          }

                          l = u;
                        }

                    }

                    break;

                  case 91:
                    g++;

                  case 40:
                    g++;

                  case 34:
                  case 39:
                    for (; l++ < J && e.charCodeAt(l) !== g;) {
                    }

                }

                if (0 === k) break;
                l++;
              }

              k = e.substring(t, l);
              0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

              switch (q) {
                case 64:
                  0 < r && (f = f.replace(N, ''));
                  g = f.charCodeAt(1);

                  switch (g) {
                    case 100:
                    case 109:
                    case 115:
                    case 45:
                      r = c;
                      break;

                    default:
                      r = O;
                  }

                  k = M(c, r, k, g, a + 1);
                  t = k.length;
                  0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                  if (0 < t) switch (g) {
                    case 115:
                      f = f.replace(da, ea);

                    case 100:
                    case 109:
                    case 45:
                      k = f + '{' + k + '}';
                      break;

                    case 107:
                      f = f.replace(fa, '$1 $2');
                      k = f + '{' + k + '}';
                      k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                      break;

                    default:
                      k = f + k, 112 === h && (k = (p += k, ''));
                  } else k = '';
                  break;

                default:
                  k = M(c, X(c, f, I), k, h, a + 1);
              }

              F += k;
              k = I = r = u = q = 0;
              f = '';
              g = e.charCodeAt(++l);
              break;

            case 125:
            case 59:
              f = (0 < r ? f.replace(N, '') : f).trim();
              if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
                case 0:
                  break;

                case 64:
                  if (105 === g || 99 === g) {
                    G += f + e.charAt(l);
                    break;
                  }

                default:
                  58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
              }
              I = r = u = q = 0;
              f = '';
              g = e.charCodeAt(++l);
          }
        }

        switch (g) {
          case 13:
          case 10:
            47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
            0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
            z = 1;
            D++;
            break;

          case 59:
          case 125:
            if (0 === b + n + v + m) {
              z++;
              break;
            }

          default:
            z++;
            y = e.charAt(l);

            switch (g) {
              case 9:
              case 32:
                if (0 === n + m + b) switch (x) {
                  case 44:
                  case 58:
                  case 9:
                  case 32:
                    y = '';
                    break;

                  default:
                    32 !== g && (y = ' ');
                }
                break;

              case 0:
                y = '\\0';
                break;

              case 12:
                y = '\\f';
                break;

              case 11:
                y = '\\v';
                break;

              case 38:
                0 === n + b + m && (r = I = 1, y = '\f' + y);
                break;

              case 108:
                if (0 === n + b + m + E && 0 < u) switch (l - u) {
                  case 2:
                    112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                  case 8:
                    111 === K && (E = K);
                }
                break;

              case 58:
                0 === n + b + m && (u = l);
                break;

              case 44:
                0 === b + v + n + m && (r = 1, y += '\r');
                break;

              case 34:
              case 39:
                0 === b && (n = n === g ? 0 : 0 === n ? g : n);
                break;

              case 91:
                0 === n + b + v && m++;
                break;

              case 93:
                0 === n + b + v && m--;
                break;

              case 41:
                0 === n + b + m && v--;
                break;

              case 40:
                if (0 === n + b + m) {
                  if (0 === q) switch (2 * x + 3 * K) {
                    case 533:
                      break;

                    default:
                      q = 1;
                  }
                  v++;
                }

                break;

              case 64:
                0 === b + v + n + m + u + k && (k = 1);
                break;

              case 42:
              case 47:
                if (!(0 < n + m + v)) switch (b) {
                  case 0:
                    switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                      case 235:
                        b = 47;
                        break;

                      case 220:
                        t = l, b = 42;
                    }

                    break;

                  case 42:
                    47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
                }
            }

            0 === b && (f += y);
        }

        K = x;
        x = g;
        l++;
      }

      t = p.length;

      if (0 < t) {
        r = c;
        if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
        p = r.join(',') + '{' + p + '}';

        if (0 !== w * E) {
          2 !== w || L(p, 2) || (E = 0);

          switch (E) {
            case 111:
              p = p.replace(ha, ':-moz-$1') + p;
              break;

            case 112:
              p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
          }

          E = 0;
        }
      }

      return G + p + F;
    }

    function X(d, c, e) {
      var h = c.trim().split(ia);
      c = h;
      var a = h.length,
          m = d.length;

      switch (m) {
        case 0:
        case 1:
          var b = 0;

          for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
            c[b] = Z(d, c[b], e).trim();
          }

          break;

        default:
          var v = b = 0;

          for (c = []; b < a; ++b) {
            for (var n = 0; n < m; ++n) {
              c[v++] = Z(d[n] + ' ', h[b], e).trim();
            }
          }

      }

      return c;
    }

    function Z(d, c, e) {
      var h = c.charCodeAt(0);
      33 > h && (h = (c = c.trim()).charCodeAt(0));

      switch (h) {
        case 38:
          return c.replace(F, '$1' + d.trim());

        case 58:
          return d.trim() + c.replace(F, '$1' + d.trim());

        default:
          if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
      }

      return d + c;
    }

    function P(d, c, e, h) {
      var a = d + ';',
          m = 2 * c + 3 * e + 4 * h;

      if (944 === m) {
        d = a.indexOf(':', 9) + 1;
        var b = a.substring(d, a.length - 1).trim();
        b = a.substring(0, d).trim() + b + ';';
        return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
      }

      if (0 === w || 2 === w && !L(a, 1)) return a;

      switch (m) {
        case 1015:
          return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

        case 951:
          return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

        case 963:
          return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

        case 1009:
          if (100 !== a.charCodeAt(4)) break;

        case 969:
        case 942:
          return '-webkit-' + a + a;

        case 978:
          return '-webkit-' + a + '-moz-' + a + a;

        case 1019:
        case 983:
          return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

        case 883:
          if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
          if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
          break;

        case 932:
          if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
            case 103:
              return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

            case 115:
              return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

            case 98:
              return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
          }
          return '-webkit-' + a + '-ms-' + a + a;

        case 964:
          return '-webkit-' + a + '-ms-flex-' + a + a;

        case 1023:
          if (99 !== a.charCodeAt(8)) break;
          b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
          return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

        case 1005:
          return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

        case 1e3:
          b = a.substring(13).trim();
          c = b.indexOf('-') + 1;

          switch (b.charCodeAt(0) + b.charCodeAt(c)) {
            case 226:
              b = a.replace(G, 'tb');
              break;

            case 232:
              b = a.replace(G, 'tb-rl');
              break;

            case 220:
              b = a.replace(G, 'lr');
              break;

            default:
              return a;
          }

          return '-webkit-' + a + '-ms-' + b + a;

        case 1017:
          if (-1 === a.indexOf('sticky', 9)) break;

        case 975:
          c = (a = d).length - 10;
          b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

          switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
            case 203:
              if (111 > b.charCodeAt(8)) break;

            case 115:
              a = a.replace(b, '-webkit-' + b) + ';' + a;
              break;

            case 207:
            case 102:
              a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
          }

          return a + ';';

        case 938:
          if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
            case 105:
              return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

            case 115:
              return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

            default:
              return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
          }
          break;

        case 973:
        case 989:
          if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

        case 931:
        case 953:
          if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
          break;

        case 962:
          if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
      }

      return a;
    }

    function L(d, c) {
      var e = d.indexOf(1 === c ? ':' : '{'),
          h = d.substring(0, 3 !== c ? e : 10);
      e = d.substring(e + 1, d.length - 1);
      return R(2 !== c ? h : h.replace(na, '$1'), e, c);
    }

    function ea(d, c) {
      var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
      return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
    }

    function H(d, c, e, h, a, m, b, v, n, q) {
      for (var g = 0, x = c, w; g < A; ++g) {
        switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
          case void 0:
          case !1:
          case !0:
          case null:
            break;

          default:
            x = w;
        }
      }

      if (x !== c) return x;
    }

    function T(d) {
      switch (d) {
        case void 0:
        case null:
          A = S.length = 0;
          break;

        default:
          if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
            T(d[c]);
          } else Y = !!d | 0;
      }

      return T;
    }

    function U(d) {
      d = d.prefix;
      void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
      return U;
    }

    function B(d, c) {
      var e = d;
      33 > e.charCodeAt(0) && (e = e.trim());
      V = e;
      e = [V];

      if (0 < A) {
        var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
        void 0 !== h && 'string' === typeof h && (c = h);
      }

      var a = M(O, e, c, 0, 0);
      0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
      V = '';
      E = 0;
      z = D = 1;
      return a;
    }

    var ca = /^\0+/g,
        N = /[\0\r\f]/g,
        aa = /: */g,
        ka = /zoo|gra/,
        ma = /([,: ])(transform)/g,
        ia = /,\r+?/g,
        F = /([\t\r\n ])*\f?&/g,
        fa = /@(k\w+)\s*(\S*)\s*/,
        Q = /::(place)/g,
        ha = /:(read-only)/g,
        G = /[svh]\w+-[tblr]{2}/,
        da = /\(\s*(.*)\s*\)/g,
        oa = /([\s\S]*?);/g,
        ba = /-self|flex-/g,
        na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
        la = /stretch|:\s*\w+\-(?:conte|avail)/,
        ja = /([^-])(image-set\()/,
        z = 1,
        D = 1,
        E = 0,
        w = 1,
        O = [],
        S = [],
        A = 0,
        R = null,
        Y = 0,
        V = '';
    B.use = T;
    B.set = U;
    void 0 !== W && U(W);
    return B;
  }

  // https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
  // inlined to avoid umd wrapper and peerDep warnings/installing stylis
  // since we use stylis after closure compiler
  var delimiter = '/*|*/';
  var needle = delimiter + '}';

  function toSheet(block) {
    if (block) {
      Sheet.current.insert(block + '}');
    }
  }

  var Sheet = {
    current: null
  };
  var ruleSheet = function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
    switch (context) {
      // property
      case 1:
        {
          switch (content.charCodeAt(0)) {
            case 64:
              {
                // @import
                Sheet.current.insert(content + ';');
                return '';
              }
            // charcode for l

            case 108:
              {
                // charcode for b
                // this ignores label
                if (content.charCodeAt(2) === 98) {
                  return '';
                }
              }
          }

          break;
        }
      // selector

      case 2:
        {
          if (ns === 0) return content + delimiter;
          break;
        }
      // at-rule

      case 3:
        {
          switch (ns) {
            // @font-face, @page
            case 102:
            case 112:
              {
                Sheet.current.insert(selectors[0] + content);
                return '';
              }

            default:
              {
                return content + (at === 0 ? delimiter : '');
              }
          }
        }

      case -2:
        {
          content.split(needle).forEach(toSheet);
        }
    }
  };

  var createCache = function createCache(options) {
    if (options === undefined) options = {};
    var key = options.key || 'css';
    var stylisOptions;

    if (options.prefix !== undefined) {
      stylisOptions = {
        prefix: options.prefix
      };
    }

    var stylis = new stylis_min(stylisOptions);

    if (process.env.NODE_ENV !== 'production') {
      // $FlowFixMe
      if (/[^a-z-]/.test(key)) {
        throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
      }
    }

    var inserted = {}; // $FlowFixMe

    var container;

    {
      container = options.container || document.head;
      var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
      Array.prototype.forEach.call(nodes, function (node) {
        var attrib = node.getAttribute("data-emotion-" + key); // $FlowFixMe

        attrib.split(' ').forEach(function (id) {
          inserted[id] = true;
        });

        if (node.parentNode !== container) {
          container.appendChild(node);
        }
      });
    }

    var _insert;

    {
      stylis.use(options.stylisPlugins)(ruleSheet);

      _insert = function insert(selector, serialized, sheet, shouldCache) {
        var name = serialized.name;
        Sheet.current = sheet;

        if (process.env.NODE_ENV !== 'production' && serialized.map !== undefined) {
          var map = serialized.map;
          Sheet.current = {
            insert: function insert(rule) {
              sheet.insert(rule + map);
            }
          };
        }

        stylis(selector, serialized.styles);

        if (shouldCache) {
          cache.inserted[name] = true;
        }
      };
    }

    if (process.env.NODE_ENV !== 'production') {
      // https://esbench.com/bench/5bf7371a4cd7e6009ef61d0a
      var commentStart = /\/\*/g;
      var commentEnd = /\*\//g;
      stylis.use(function (context, content) {
        switch (context) {
          case -1:
            {
              while (commentStart.test(content)) {
                commentEnd.lastIndex = commentStart.lastIndex;

                if (commentEnd.test(content)) {
                  commentStart.lastIndex = commentEnd.lastIndex;
                  continue;
                }

                throw new Error('Your styles have an unterminated comment ("/*" without corresponding "*/").');
              }

              commentStart.lastIndex = 0;
              break;
            }
        }
      });
      stylis.use(function (context, content, selectors) {
        switch (context) {
          case -1:
            {
              var flag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';
              var unsafePseudoClasses = content.match(/(:first|:nth|:nth-last)-child/g);

              if (unsafePseudoClasses && cache.compat !== true) {
                unsafePseudoClasses.forEach(function (unsafePseudoClass) {
                  var ignoreRegExp = new RegExp(unsafePseudoClass + ".*\\/\\* " + flag + " \\*\\/");
                  var ignore = ignoreRegExp.test(content);

                  if (unsafePseudoClass && !ignore) {
                    console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
                  }
                });
              }

              break;
            }
        }
      });
    }

    var cache = {
      key: key,
      sheet: new StyleSheet({
        key: key,
        container: container,
        nonce: options.nonce,
        speedy: options.speedy
      }),
      nonce: options.nonce,
      inserted: inserted,
      registered: {},
      insert: _insert
    };
    return cache;
  };

  var isBrowser = "object" !== 'undefined';
  function getRegisteredStyles(registered, registeredStyles, classNames) {
    var rawClassName = '';
    classNames.split(' ').forEach(function (className) {
      if (registered[className] !== undefined) {
        registeredStyles.push(registered[className]);
      } else {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }
  var insertStyles = function insertStyles(cache, serialized, isStringTag) {
    var className = cache.key + "-" + serialized.name;

    if ( // we only need to add the styles to the registered cache if the
    // class name could be used further down
    // the tree but if it's a string tag, we know it won't
    // so we don't have to add it to registered cache.
    // this improves memory usage since we can avoid storing the whole style string
    (isStringTag === false || // we need to always store it if we're in compat mode and
    // in node since emotion-server relies on whether a style is in
    // the registered cache to know whether a style is global or not
    // also, note that this check will be dead code eliminated in the browser
    isBrowser === false) && cache.registered[className] === undefined) {
      cache.registered[className] = serialized.styles;
    }

    if (cache.inserted[serialized.name] === undefined) {
      var current = serialized;

      do {
        var maybeStyles = cache.insert("." + className, current, cache.sheet, true);

        current = current.next;
      } while (current !== undefined);
    }
  };

  /* eslint-disable */
  // Inspired by https://github.com/garycourt/murmurhash-js
  // Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
  function murmur2(str) {
    // 'm' and 'r' are mixing constants generated offline.
    // They're not really 'magic', they just happen to work well.
    // const m = 0x5bd1e995;
    // const r = 24;
    // Initialize the hash
    var h = 0; // Mix 4 bytes at a time into the hash

    var k,
        i = 0,
        len = str.length;

    for (; len >= 4; ++i, len -= 4) {
      k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
      k =
      /* Math.imul(k, m): */
      (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
      k ^=
      /* k >>> r: */
      k >>> 24;
      h =
      /* Math.imul(k, m): */
      (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    } // Handle the last few bytes of the input array


    switch (len) {
      case 3:
        h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

      case 2:
        h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

      case 1:
        h ^= str.charCodeAt(i) & 0xff;
        h =
        /* Math.imul(h, m): */
        (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    } // Do a few final mixes of the hash to ensure the last few
    // bytes are well-incorporated.


    h ^= h >>> 13;
    h =
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
  }

  var unitlessKeys = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  };

  var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
  var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
  var hyphenateRegex = /[A-Z]|^ms/g;
  var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

  var isCustomProperty = function isCustomProperty(property) {
    return property.charCodeAt(1) === 45;
  };

  var isProcessableValue = function isProcessableValue(value) {
    return value != null && typeof value !== 'boolean';
  };

  var processStyleName = memoize(function (styleName) {
    return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
  });

  var processStyleValue = function processStyleValue(key, value) {
    switch (key) {
      case 'animation':
      case 'animationName':
        {
          if (typeof value === 'string') {
            return value.replace(animationRegex, function (match, p1, p2) {
              cursor = {
                name: p1,
                styles: p2,
                next: cursor
              };
              return p1;
            });
          }
        }
    }

    if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
      return value + 'px';
    }

    return value;
  };

  if (process.env.NODE_ENV !== 'production') {
    var contentValuePattern = /(attr|calc|counters?|url)\(/;
    var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
    var oldProcessStyleValue = processStyleValue;
    var msPattern = /^-ms-/;
    var hyphenPattern = /-(.)/g;
    var hyphenatedCache = {};

    processStyleValue = function processStyleValue(key, value) {
      if (key === 'content') {
        if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
          console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
        }
      }

      var processed = oldProcessStyleValue(key, value);

      if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
        hyphenatedCache[key] = true;
        console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
          return _char.toUpperCase();
        }) + "?");
      }

      return processed;
    };
  }

  var shouldWarnAboutInterpolatingClassNameFromCss = true;

  function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
    if (interpolation == null) {
      return '';
    }

    if (interpolation.__emotion_styles !== undefined) {
      if (process.env.NODE_ENV !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
        throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
      }

      return interpolation;
    }

    switch (typeof interpolation) {
      case 'boolean':
        {
          return '';
        }

      case 'object':
        {
          if (interpolation.anim === 1) {
            cursor = {
              name: interpolation.name,
              styles: interpolation.styles,
              next: cursor
            };
            return interpolation.name;
          }

          if (interpolation.styles !== undefined) {
            var next = interpolation.next;

            if (next !== undefined) {
              // not the most efficient thing ever but this is a pretty rare case
              // and there will be very few iterations of this generally
              while (next !== undefined) {
                cursor = {
                  name: next.name,
                  styles: next.styles,
                  next: cursor
                };
                next = next.next;
              }
            }

            var styles = interpolation.styles + ";";

            if (process.env.NODE_ENV !== 'production' && interpolation.map !== undefined) {
              styles += interpolation.map;
            }

            return styles;
          }

          return createStringFromObject(mergedProps, registered, interpolation);
        }

      case 'function':
        {
          if (mergedProps !== undefined) {
            var previousCursor = cursor;
            var result = interpolation(mergedProps);
            cursor = previousCursor;
            return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
          } else if (process.env.NODE_ENV !== 'production') {
            console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
          }

          break;
        }

      case 'string':
        if (process.env.NODE_ENV !== 'production') {
          var matched = [];
          var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
            var fakeVarName = "animation" + matched.length;
            matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
            return "${" + fakeVarName + "}";
          });

          if (matched.length) {
            console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
          }
        }

        break;
    } // finalize string values (regular strings and functions interpolated into css calls)


    if (registered == null) {
      return interpolation;
    }

    var cached = registered[interpolation];

    if (process.env.NODE_ENV !== 'production' && couldBeSelectorInterpolation && shouldWarnAboutInterpolatingClassNameFromCss && cached !== undefined) {
      console.error('Interpolating a className from css`` is not recommended and will cause problems with composition.\n' + 'Interpolating a className from css`` will be completely unsupported in a future major version of Emotion');
      shouldWarnAboutInterpolatingClassNameFromCss = false;
    }

    return cached !== undefined && !couldBeSelectorInterpolation ? cached : interpolation;
  }

  function createStringFromObject(mergedProps, registered, obj) {
    var string = '';

    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        string += handleInterpolation(mergedProps, registered, obj[i], false);
      }
    } else {
      for (var _key in obj) {
        var value = obj[_key];

        if (typeof value !== 'object') {
          if (registered != null && registered[value] !== undefined) {
            string += _key + "{" + registered[value] + "}";
          } else if (isProcessableValue(value)) {
            string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
          }
        } else {
          if (_key === 'NO_COMPONENT_SELECTOR' && process.env.NODE_ENV !== 'production') {
            throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
          }

          if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue(value[_i])) {
                string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation(mergedProps, registered, value, false);

            switch (_key) {
              case 'animation':
              case 'animationName':
                {
                  string += processStyleName(_key) + ":" + interpolated + ";";
                  break;
                }

              default:
                {
                  if (process.env.NODE_ENV !== 'production' && _key === 'undefined') {
                    console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                  }

                  string += _key + "{" + interpolated + "}";
                }
            }
          }
        }
      }
    }

    return string;
  }

  var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
  var sourceMapPattern;

  if (process.env.NODE_ENV !== 'production') {
    sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//;
  } // this is the cursor for keyframes
  // keyframes are stored on the SerializedStyles object as a linked list


  var cursor;
  var serializeStyles = function serializeStyles(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
      return args[0];
    }

    var stringMode = true;
    var styles = '';
    cursor = undefined;
    var strings = args[0];

    if (strings == null || strings.raw === undefined) {
      stringMode = false;
      styles += handleInterpolation(mergedProps, registered, strings, false);
    } else {
      if (process.env.NODE_ENV !== 'production' && strings[0] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += strings[0];
    } // we start at 1 since we've already handled the first arg


    for (var i = 1; i < args.length; i++) {
      styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);

      if (stringMode) {
        if (process.env.NODE_ENV !== 'production' && strings[i] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
        }

        styles += strings[i];
      }
    }

    var sourceMap;

    if (process.env.NODE_ENV !== 'production') {
      styles = styles.replace(sourceMapPattern, function (match) {
        sourceMap = match;
        return '';
      });
    } // using a global regex with .exec is stateful so lastIndex has to be reset each time


    labelPattern.lastIndex = 0;
    var identifierName = '';
    var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

    while ((match = labelPattern.exec(styles)) !== null) {
      identifierName += '-' + // $FlowFixMe we know it's not null
      match[1];
    }

    var name = murmur2(styles) + identifierName;

    if (process.env.NODE_ENV !== 'production') {
      // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
      return {
        name: name,
        styles: styles,
        map: sourceMap,
        next: cursor,
        toString: function toString() {
          return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
        }
      };
    }

    return {
      name: name,
      styles: styles,
      next: cursor
    };
  };

  var EmotionCacheContext = React.createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
  // because this module is primarily intended for the browser and node
  // but it's also required in react native and similar environments sometimes
  // and we could have a special build just for that
  // but this is much easier and the native packages
  // might use a different theme context in the future anyway
  typeof HTMLElement !== 'undefined' ? createCache() : null);
  var ThemeContext = React.createContext({});

  var withEmotionCache = function withEmotionCache(func) {
    var render = function render(props, ref) {
      return React.createElement(EmotionCacheContext.Consumer, null, function (cache) {
        return func(props, cache, ref);
      });
    }; // $FlowFixMe


    return React.forwardRef(render);
  };

  var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
  var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var render = function render(cache, props, theme, ref) {
    var cssProp = theme === null ? props.css : props.css(theme); // so that using `css` from `emotion` and passing the result to the css prop works
    // not passing the registered cache to serializeStyles because it would
    // make certain babel optimisations not possible

    if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
      cssProp = cache.registered[cssProp];
    }

    var type = props[typePropName];
    var registeredStyles = [cssProp];
    var className = '';

    if (typeof props.className === 'string') {
      className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
    } else if (props.className != null) {
      className = props.className + " ";
    }

    var serialized = serializeStyles(registeredStyles);

    if (process.env.NODE_ENV !== 'production' && serialized.name.indexOf('-') === -1) {
      var labelFromStack = props[labelPropName];

      if (labelFromStack) {
        serialized = serializeStyles([serialized, 'label:' + labelFromStack + ';']);
      }
    }

    var rules = insertStyles(cache, serialized, typeof type === 'string');
    className += cache.key + "-" + serialized.name;
    var newProps = {};

    for (var key in props) {
      if (hasOwnProperty.call(props, key) && key !== 'css' && key !== typePropName && (process.env.NODE_ENV === 'production' || key !== labelPropName)) {
        newProps[key] = props[key];
      }
    }

    newProps.ref = ref;
    newProps.className = className;
    var ele = React.createElement(type, newProps);

    return ele;
  };

  var Emotion =
  /* #__PURE__ */
  withEmotionCache(function (props, cache, ref) {
    // use Context.read for the theme when it's stable
    if (typeof props.css === 'function') {
      return React.createElement(ThemeContext.Consumer, null, function (theme) {
        return render(cache, props, theme, ref);
      });
    }

    return render(cache, props, null, ref);
  });

  if (process.env.NODE_ENV !== 'production') {
    Emotion.displayName = 'EmotionCssPropInternal';
  } // $FlowFixMe

  var warnedAboutCssPropForGlobal = false;
  var Global =
  /* #__PURE__ */
  withEmotionCache(function (props, cache) {
    if (process.env.NODE_ENV !== 'production' && !warnedAboutCssPropForGlobal && ( // check for className as well since the user is
    // probably using the custom createElement which
    // means it will be turned into a className prop
    // $FlowFixMe I don't really want to add it to the type since it shouldn't be used
    props.className || props.css)) {
      console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
      warnedAboutCssPropForGlobal = true;
    }

    var styles = props.styles;

    if (typeof styles === 'function') {
      return React.createElement(ThemeContext.Consumer, null, function (theme) {
        var serialized = serializeStyles([styles(theme)]);
        return React.createElement(InnerGlobal, {
          serialized: serialized,
          cache: cache
        });
      });
    }

    var serialized = serializeStyles([styles]);
    return React.createElement(InnerGlobal, {
      serialized: serialized,
      cache: cache
    });
  });

  // maintain place over rerenders.
  // initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
  // initial client-side render from SSR, use place of hydrating tag
  var InnerGlobal =
  /*#__PURE__*/
  function (_React$Component) {
    inheritsLoose(InnerGlobal, _React$Component);

    function InnerGlobal(props, context, updater) {
      return _React$Component.call(this, props, context, updater) || this;
    }

    var _proto = InnerGlobal.prototype;

    _proto.componentDidMount = function componentDidMount() {
      this.sheet = new StyleSheet({
        key: this.props.cache.key + "-global",
        nonce: this.props.cache.sheet.nonce,
        container: this.props.cache.sheet.container
      }); // $FlowFixMe

      var node = document.querySelector("style[data-emotion-" + this.props.cache.key + "=\"" + this.props.serialized.name + "\"]");

      if (node !== null) {
        this.sheet.tags.push(node);
      }

      if (this.props.cache.sheet.tags.length) {
        this.sheet.before = this.props.cache.sheet.tags[0];
      }

      this.insertStyles();
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      if (prevProps.serialized.name !== this.props.serialized.name) {
        this.insertStyles();
      }
    };

    _proto.insertStyles = function insertStyles$1() {
      if (this.props.serialized.next !== undefined) {
        // insert keyframes
        insertStyles(this.props.cache, this.props.serialized.next, true);
      }

      if (this.sheet.tags.length) {
        // if this doesn't exist then it will be null so the style element will be appended
        var element = this.sheet.tags[this.sheet.tags.length - 1].nextElementSibling;
        this.sheet.before = element;
        this.sheet.flush();
      }

      this.props.cache.insert("", this.props.serialized, this.sheet, false);
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      this.sheet.flush();
    };

    _proto.render = function render() {

      return null;
    };

    return InnerGlobal;
  }(React.Component);

  var classnames = function classnames(args) {
    var len = args.length;
    var i = 0;
    var cls = '';

    for (; i < len; i++) {
      var arg = args[i];
      if (arg == null) continue;
      var toAdd = void 0;

      switch (typeof arg) {
        case 'boolean':
          break;

        case 'object':
          {
            if (Array.isArray(arg)) {
              toAdd = classnames(arg);
            } else {
              toAdd = '';

              for (var k in arg) {
                if (arg[k] && k) {
                  toAdd && (toAdd += ' ');
                  toAdd += k;
                }
              }
            }

            break;
          }

        default:
          {
            toAdd = arg;
          }
      }

      if (toAdd) {
        cls && (cls += ' ');
        cls += toAdd;
      }
    }

    return cls;
  };

  function merge(registered, css$$1, className) {
    var registeredStyles = [];
    var rawClassName = getRegisteredStyles(registered, registeredStyles, className);

    if (registeredStyles.length < 2) {
      return className;
    }

    return rawClassName + css$$1(registeredStyles);
  }

  var ClassNames = withEmotionCache(function (props, context) {
    return React.createElement(ThemeContext.Consumer, null, function (theme) {
      var hasRendered = false;

      var css$$1 = function css$$1() {
        if (hasRendered && process.env.NODE_ENV !== 'production') {
          throw new Error('css can only be used during render');
        }

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var serialized = serializeStyles(args, context.registered);

        {
          insertStyles(context, serialized, false);
        }

        return context.key + "-" + serialized.name;
      };

      var cx = function cx() {
        if (hasRendered && process.env.NODE_ENV !== 'production') {
          throw new Error('cx can only be used during render');
        }

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return merge(context.registered, css$$1, classnames(args));
      };

      var content = {
        css: css$$1,
        cx: cx,
        theme: theme
      };
      var ele = props.children(content);
      hasRendered = true;

      return ele;
    });
  });

  var testOmitPropsOnStringTag = index;

  var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
    return key !== 'theme' && key !== 'innerRef';
  };

  var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
    return typeof tag === 'string' && // 96 is one less than the char code
    // for "a" so this is checking that
    // it's a lowercase character
    tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
  };

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var ILLEGAL_ESCAPE_SEQUENCE_ERROR$1 = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";

  var createStyled = function createStyled(tag, options) {
    if (process.env.NODE_ENV !== 'production') {
      if (tag === undefined) {
        throw new Error('You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.');
      }
    }

    var identifierName;
    var shouldForwardProp;
    var targetClassName;

    if (options !== undefined) {
      identifierName = options.label;
      targetClassName = options.target;
      shouldForwardProp = tag.__emotion_forwardProp && options.shouldForwardProp ? function (propName) {
        return tag.__emotion_forwardProp(propName) && // $FlowFixMe
        options.shouldForwardProp(propName);
      } : options.shouldForwardProp;
    }

    var isReal = tag.__emotion_real === tag;
    var baseTag = isReal && tag.__emotion_base || tag;

    if (typeof shouldForwardProp !== 'function' && isReal) {
      shouldForwardProp = tag.__emotion_forwardProp;
    }

    var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
    var shouldUseAs = !defaultShouldForwardProp('as');
    return function () {
      var args = arguments;
      var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

      if (identifierName !== undefined) {
        styles.push("label:" + identifierName + ";");
      }

      if (args[0] == null || args[0].raw === undefined) {
        styles.push.apply(styles, args);
      } else {
        if (process.env.NODE_ENV !== 'production' && args[0][0] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$1);
        }

        styles.push(args[0][0]);
        var len = args.length;
        var i = 1;

        for (; i < len; i++) {
          if (process.env.NODE_ENV !== 'production' && args[0][i] === undefined) {
            console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$1);
          }

          styles.push(args[i], args[0][i]);
        }
      } // $FlowFixMe: we need to cast StatelessFunctionalComponent to our PrivateStyledComponent class


      var Styled = withEmotionCache(function (props, context, ref) {
        return React.createElement(ThemeContext.Consumer, null, function (theme) {
          var finalTag = shouldUseAs && props.as || baseTag;
          var className = '';
          var classInterpolations = [];
          var mergedProps = props;

          if (props.theme == null) {
            mergedProps = {};

            for (var key in props) {
              mergedProps[key] = props[key];
            }

            mergedProps.theme = theme;
          }

          if (typeof props.className === 'string') {
            className = getRegisteredStyles(context.registered, classInterpolations, props.className);
          } else if (props.className != null) {
            className = props.className + " ";
          }

          var serialized = serializeStyles(styles.concat(classInterpolations), context.registered, mergedProps);
          var rules = insertStyles(context, serialized, typeof finalTag === 'string');
          className += context.key + "-" + serialized.name;

          if (targetClassName !== undefined) {
            className += " " + targetClassName;
          }

          var finalShouldForwardProp = shouldUseAs && shouldForwardProp === undefined ? getDefaultShouldForwardProp(finalTag) : defaultShouldForwardProp;
          var newProps = {};

          for (var _key in props) {
            if (shouldUseAs && _key === 'as') continue;

            if ( // $FlowFixMe
            finalShouldForwardProp(_key)) {
              newProps[_key] = props[_key];
            }
          }

          newProps.className = className;
          newProps.ref = ref || props.innerRef;

          if (process.env.NODE_ENV !== 'production' && props.innerRef) {
            console.error('`innerRef` is deprecated and will be removed in a future major version of Emotion, please use the `ref` prop instead' + (identifierName === undefined ? '' : " in the usage of `" + identifierName + "`"));
          }

          var ele = React.createElement(finalTag, newProps);

          return ele;
        });
      });
      Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";
      Styled.defaultProps = tag.defaultProps;
      Styled.__emotion_real = Styled;
      Styled.__emotion_base = baseTag;
      Styled.__emotion_styles = styles;
      Styled.__emotion_forwardProp = shouldForwardProp;
      Object.defineProperty(Styled, 'toString', {
        value: function value() {
          if (targetClassName === undefined && process.env.NODE_ENV !== 'production') {
            return 'NO_COMPONENT_SELECTOR';
          } // $FlowFixMe: coerce undefined to string


          return "." + targetClassName;
        }
      });

      Styled.withComponent = function (nextTag, nextOptions) {
        return createStyled(nextTag, nextOptions !== undefined ? _objectSpread({}, options || {}, {}, nextOptions) : options).apply(void 0, styles);
      };

      return Styled;
    };
  };

  var tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
  'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];

  var newStyled = createStyled.bind();
  tags.forEach(function (tagName) {
    newStyled[tagName] = newStyled(tagName);
  });

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

  var getElements = function (container, tag) { return Array.from(container.querySelectorAll(tag)); };

  var getNodeName = function (el) { return el.nodeName === 'A' ? 'a' : el.nodeName === 'BUTTON' ? 'button' : ((el.nodeName.toLowerCase()) + "[role=\"button\"]"); };

  var getTapHighlightWarnings = function (container) {
    var buttons = getElements(container, 'button').concat(getElements(container, '[role="button"]'));
    var links = getElements(container, 'a');

    var filterActiveStyles = function (el) {
      var tapHighlight = getComputedStyle(el)['-webkit-tap-highlight-color'];
      if (tapHighlight === 'rgba(0, 0, 0, 0)') { return true; }
    };

    return buttons.concat(links).filter(filterActiveStyles).map(function (el) { return ({
      type: getNodeName(el),
      text: el.innerText,
      html: el.innerHTML,
      path: getDomPath(el)
    }); });
  };
  var maxWidth = 500;
  var getSrcsetWarnings = function (container) {
    var images = getElements(container, 'img');
    var warnings = images.filter(function (img) {
      var src = img.getAttribute('src');
      var srcSet = img.getAttribute('srcset');
      if (srcSet) { return false; }
      var isSVG = Boolean(src.match(/svg$/));
      if (isSVG) { return false; }
      var isLarge = parseInt(getComputedStyle(img).width, 10) > maxWidth || img.naturalWidth > maxWidth;
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

      if (input.labels && input.labels[0]) {
        labelText = input.labels[0].innerText;
      } else if (input.parentElement.nodeName === 'LABEL') { labelText = input.parentElement.innerText; }else if (input.id) {
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
  var getInputTypeNumberWarnings = function (container) {
    var inputs = getElements(container, 'input[type="number"]');
    return attachLabels(inputs);
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
    var inputs = getElements(container, 'input[type="text"]').concat(getElements(container, 'input:not([type])')).filter(function (input) { return !input.getAttribute('inputmode'); });
    return attachLabels(inputs, container);
  };

  var makePoints = function (ref) {
    var top = ref.top;
    var right = ref.right;
    var bottom = ref.bottom;
    var left = ref.left;

    return [[top, right], [top, left], [bottom, right], [bottom, left]];
  };

  var findDistance = function (point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
  };

  var getTouchTargetSizeWarning = function (ref) {
    var container = ref.container;
    var minSize = ref.minSize;
    var recommendedSize = ref.recommendedSize;
    var recommendedDistance = ref.recommendedDistance;

    var els = getElements(container, 'button').concat(getElements(container, '[role="button"]')).concat(getElements(container, 'a')).map(function (el) { return [el, el.getBoundingClientRect()]; });
    var elsWithClose = els.map(function (ref, i1) {
      var el1 = ref[0];
      var bounding1 = ref[1];

      var close = els.filter(function (ref, i2) {
        var bounding2 = ref[1];

        if (i2 === i1) { return; }
        var points1 = makePoints(bounding1);
        var points2 = makePoints(bounding2);
        var isTooClose = false;
        points1.forEach(function (point1) {
          points2.forEach(function (point2) {
            var distance = findDistance(point1, point2);

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
    var underMinSize = elsWithClose.filter(function (ref) {
      var ref_boundingBox = ref.boundingBox;
      var width = ref_boundingBox.width;
      var height = ref_boundingBox.height;

      return width < minSize || height < minSize;
    });
    var tooClose = elsWithClose.filter(function (ref) {
      var ref_boundingBox = ref.boundingBox;
      var width = ref_boundingBox.width;
      var height = ref_boundingBox.height;
      var close = ref.close;

      return close.length && (width < recommendedSize || height < recommendedSize);
    });

    var present = function (ref) {
      var el = ref.el;
      var ref_boundingBox = ref.boundingBox;
      var width = ref_boundingBox.width;
      var height = ref_boundingBox.height;
      var close = ref.close;

      return {
        type: el.nodeName === 'A' ? 'a' : el.nodeName === 'BUTTON' ? 'button' : ((el.nodeName.toLowerCase()) + "[role=\"button\"]"),
        path: getDomPath(el),
        text: el.innerText,
        html: el.innerHTML,
        width: Math.floor(width),
        height: Math.floor(height),
        close: close
      };
    };

    return {
      underMinSize: underMinSize.map(present),
      tooClose: tooClose.map(present)
    };
  };

  var templateObject$7 = Object.freeze(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));\n\n  font-size: ", "px;\n\n  p {\n    line-height: 1.4;\n  }\n\n  h3 {\n    font-size: ", "px;\n    font-weight: bold;\n    margin-bottom: 0.5rem;\n    margin-top: 0;\n  }\n\n  code {\n    background: hsla(0, 0%, 50%, 0.1);\n    border-radius: 3px;\n  }\n\n  summary {\n    cursor: pointer;\n    display: inline-block;\n    padding: 0.2rem 0.3rem;\n    border-radius: 5px;\n    color: ", ";\n    &:focus {\n      outline: none;\n      box-shadow: 0 0 0 3px ", ";\n    }\n  }\n\n  ul {\n    padding-left: 1.25rem;\n  }\n  a {\n    text-decoration: none;\n    color: ", ";\n    &:hover {\n      border-bottom: 1px solid ", ";\n    }\n  }\n  > div {\n    border-bottom: 1px solid ", ";\n    border-right: 1px solid ", ";\n  }\n"]);
  var templateObject$6 = Object.freeze(["\n  margin-bottom: 0.5rem;\n"]);
  var templateObject$5 = Object.freeze(["\n  height: 4rem;\n  width: auto;\n  max-width: 100%;\n  background-color: hsla(0, 0%, 0%, 0.2);\n"]);
  var templateObject$4 = Object.freeze(["\n  display: inline-block;\n  padding-top: 0.25rem;\n  height: 2rem;\n  width: auto;\n  img {\n    height: 2rem !important;\n    width: auto !important;\n  }\n"]);
  var templateObject$3 = Object.freeze(["\n  padding: 1rem;\n"]);
  var templateObject$2 = Object.freeze(["\n  padding: 1rem;\n  font-weight: bold;\n"]);
  var templateObject$1 = Object.freeze(["\n  ", "\n color: ", ";\n background-color: hsla(214, 92%, 45%, 0.1);\n"]);
  var templateObject = Object.freeze(["\n  color: ", ";\n  background-color: hsl(41, 100%, 92%);\n  ", "\n"]);
  var recommendedSize = 44;
  var minSize = 30;
  var recommendedDistance = 8;
  var accessibleBlue = '#0965df';
  var warning = '#bd4700';
  var tagStyles = "\n  padding: .25rem .5rem;\n  font-weight: bold;\n  display:inline-block;\n  border-radius: 10px;\n  margin-bottom: .5rem;\n  svg {\n    margin-right: .25rem;\n    display: inline-block;\n    height: .7rem;\n    line-height: 1;\n    position: relative;\n    top: .03rem;\n    letter-spacing: .01rem;\n  }\n";
  var StyledWarningTag = styled__default.div(templateObject, warning, tagStyles);

  var Warning = function () {
    return React__default.createElement( StyledWarningTag, null,
        React__default.createElement( 'svg', { 'aria-hidden': "true", focusable: "false", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 576 512" },
          React__default.createElement( 'path', { fill: "currentColor", d: "M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" })
        ), "warning" );
  };

  var StyledInfoTag = styled__default.div(templateObject$1, tagStyles, accessibleBlue);

  var Info = function () {
    return React__default.createElement( StyledInfoTag, null,
        React__default.createElement( 'svg', { 'aria-hidden': "true", focusable: "false", 'data-prefix': "fas", 'data-icon': "magic", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", class: "svg-inline--fa fa-magic fa-w-16 fa-5x" },
          React__default.createElement( 'path', { fill: "currentColor", d: "M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z", class: "" })
        ), "hint" );
  };

  var NoWarning = styled__default.div(templateObject$2);
  var Spacer = styled__default.div(templateObject$3);
  var StyledTappableContents = styled__default.div(templateObject$4);
  var DemoImg = styled__default.img(templateObject$5);
  var ListEntry = styled__default.li(templateObject$6);
  var Container = styled__default.div(templateObject$7, function (props) { return props.theme.typography.size.s2; }, function (props) { return props.theme.typography.size.s2; }, accessibleBlue, function (props) { return props.theme.color.mediumlight; }, accessibleBlue, accessibleBlue, function (props) { return props.theme.color.medium; }, function (props) { return props.theme.color.medium; });
  var fixText = 'Learn more';

  var ActiveWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React__default.createElement( Spacer, null,
        React__default.createElement( Info, null ),
        React__default.createElement( 'h3', null, "Tap style removed from tappable element" ),
        React__default.createElement( 'p', null, "These elements have an invisible", ' ',
          React__default.createElement( 'code', null, "-webkit-tap-highlight-color" ), ". While this might be intentional, please verify that they have appropriate tap indication styles added through other means." ),
        React__default.createElement( 'ul', null,
          warnings.map(function (w, i) {
          return React__default.createElement( ListEntry, { key: i },
                React__default.createElement( 'code', null, w.type ), " with content", ' ',
                w.text ? React__default.createElement( 'b', null, w.text ) : w.html ? React__default.createElement( StyledTappableContents, { dangerouslySetInnerHTML: {
              __html: w.html
            } }) : '[no text found]'
              );
        })
        ),
        React__default.createElement( 'details', null,
          React__default.createElement( 'summary', null, fixText ),
          React__default.createElement( 'p', null, "Some stylesheets remove the tap indication highlight shown on iOS and Android browsers by adding the code", ' ',
            React__default.createElement( 'code', null, "-webkit-tap-highlight-color: transparent" ), ". In order to maintain a good mobile experience, tap styles should be added via appropriate ", React__default.createElement( 'code', null, ":active" ), " CSS styles (though, note", ' ',
            React__default.createElement( 'code', null, ":active" ), " styles work inconsistently in iOS), or via JavaScript on the ", React__default.createElement( 'code', null, "touchstart" ), " event." )
        )
      );
  };

  var AutocompleteWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React__default.createElement( Spacer, null,
        React__default.createElement( Warning, null ),
        React__default.createElement( 'h3', null, "Input with no ", React__default.createElement( 'code', null, "autocomplete" ), " prop" ),
        React__default.createElement( 'p', null, "Most textual inputs should have an explicit ", React__default.createElement( 'code', null, "autocomplete" ), ' ', "prop (even if it's just ", React__default.createElement( 'code', null, "autocomplete=\"off\"" ), ")." ),
        React__default.createElement( 'ul', null,
          warnings.map(function (w, i) {
          return React__default.createElement( ListEntry, { key: i },
                React__default.createElement( 'code', null, "input type=\"", w.type, "\"" ), " and label", ' ',
                React__default.createElement( 'b', null, w.labelText || '[no label found]' )
              );
        })
        ),
        React__default.createElement( 'details', null,
          React__default.createElement( 'summary', null, fixText ),
          React__default.createElement( 'p', null,
            React__default.createElement( 'a', { href: "https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill" }, "Google's autocomplete documentation")
          ),
          React__default.createElement( 'p', null,
            React__default.createElement( 'a', { href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete" }, "Mozilla's autocomplete documentation")
          )
        )
      );
  };

  var InputTypeWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React__default.createElement( Spacer, null,
        React__default.createElement( Info, null ),

        React__default.createElement( 'h3', null, "Input type ", React__default.createElement( 'code', null, "text" ), " with no ", React__default.createElement( 'code', null, "inputmode" ), ' '
        ),
        React__default.createElement( 'p', null, "This will render the default text keyboard on mobile (which could very well be what you want!) If you haven't already, take a moment to make sure this is correct. You can use", ' ',
          React__default.createElement( 'a', { href: "https://better-mobile-inputs.netlify.com/" }, "this tool"), " to explore keyboard options." ),
        React__default.createElement( 'ul', null,
          warnings.map(function (w, i) {
          return React__default.createElement( ListEntry, { key: i },
                React__default.createElement( 'code', null, "input type=\"", w.type, "\"" ), " and label", ' ',
                React__default.createElement( 'b', null, w.labelText || '[no label found]' )
              );
        })
        )
      );
  };

  var InputTypeNumberWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React__default.createElement( Spacer, null,
        React__default.createElement( Info, null ),

        React__default.createElement( 'h3', null, "Input type ", React__default.createElement( 'code', null, "number" ), " used" ),
        React__default.createElement( 'p', null, "Often,", ' ',
          React__default.createElement( 'code', null, "<input type=\"text\" inputmode=\"decimal\"/>" ), ' ', "will give you improved usability over", ' ',
          React__default.createElement( 'code', null, "<input type=\"number\" />" ), "." ),
        React__default.createElement( 'ul', null,
          warnings.map(function (w, i) {
          return React__default.createElement( ListEntry, { key: i },
                React__default.createElement( 'code', null, "input type=\"", w.type, "\"" ), " and label", ' ',
                React__default.createElement( 'b', null, w.labelText || '[no label found]' )
              );
        })
        ),
        React__default.createElement( 'details', null,
          React__default.createElement( 'summary', null, fixText ),
          React__default.createElement( 'p', null,
            React__default.createElement( 'a', { href: "https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/" }, "This article has a good overview of the issues with", ' ',
              React__default.createElement( 'code', null, "input type=\"number\"" ), ".")
          )
        )
      );
  };

  var OverflowWarning = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React__default.createElement( Spacer, null,
        React__default.createElement( Warning, null ),
        React__default.createElement( 'h3', null, "Scrollable container without", ' ',
          React__default.createElement( 'code', null, "-webkit-overflow-scrolling:touch" )
        ),
        React__default.createElement( 'p', null, "This element will scroll awkwardly and abruptly on iOS." ),
        React__default.createElement( 'ul', null,
          warnings.map(function (ref, i) {
          var path = ref.path;

          return React__default.createElement( ListEntry, { key: i },
                React__default.createElement( 'code', null, path )
              );
        })
        ),
        React__default.createElement( 'details', null,
          React__default.createElement( 'summary', null, fixText ),
          React__default.createElement( 'p', null, "To ensure your users benefit from momentum scrolling, add this line of CSS: ", React__default.createElement( 'code', null, "-webkit-overflow-scrolling:touch;" ), " to any container with a style of ", React__default.createElement( 'code', null, "overflow: auto" ), " or", ' ',
            React__default.createElement( 'code', null, "overflow: scroll" ), ".", ' ',
            React__default.createElement( 'a', { href: "https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling" }, "Learn more about the property here.")
          )
        )
      );
  };

  var HeightWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React__default.createElement( Spacer, null,
        React__default.createElement( Info, null ),
        React__default.createElement( 'h3', null, "Usage of ", React__default.createElement( 'code', null, "100vh" ), " CSS" ),
        React__default.createElement( 'p', null, "Viewport units are", ' ',
          React__default.createElement( 'a', { href: "https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html" }, "tricky on mobile."), ' ', "On some mobile browers, depending on scroll position and direction,", ' ',
          React__default.createElement( 'code', null, "100vh" ), " might take up more than 100% of screen height." ),
        React__default.createElement( 'ul', null,
          warnings.map(function (ref, i) {
          var path = ref.path;

          return React__default.createElement( ListEntry, { key: i },
                React__default.createElement( 'code', null, path )
              );
        })
        )
      );
  };

  var SrcsetWarnings = function (ref) {
    var warnings = ref.warnings;

    if (!warnings.length) { return null; }
    return React__default.createElement( Spacer, null,
        React__default.createElement( Warning, null ),
        React__default.createElement( 'h3', null, "Large image without ", React__default.createElement( 'code', null, "srscset" )
        ),
        React__default.createElement( 'p', null, "Asking your users on phones to download larger-than-necessary images will slow them down, both in terms of network downloads and image decoding. You can use ", React__default.createElement( 'code', null, "srcset" ), " to customize image sizes for different devices." ),
        React__default.createElement( 'ul', null,
          warnings.map(function (ref, i) {
          var src = ref.src;
          var alt = ref.alt;

          return React__default.createElement( ListEntry, { key: i },
                React__default.createElement( 'div', null,
                  React__default.createElement( DemoImg, { src: src, alt: alt })
                )
              );
        })
        ),
        React__default.createElement( 'details', null,
          React__default.createElement( 'summary', null, fixText ),
          React__default.createElement( 'p', null, "Here's a", ' ',
            React__default.createElement( 'a', { href: "https://cloudfour.com/thinks/responsive-images-the-simple-way" }, "good overview of the problem and how to solve it with", ' ',
              React__default.createElement( 'code', null, "srcset" )
            ), "." )
        )
      );
  };

  var TouchTargetWarnings = function (ref) {
    var ref_warnings = ref.warnings;
    var underMinSize = ref_warnings.underMinSize;
    var tooClose = ref_warnings.tooClose;

    if (!underMinSize.length && !tooClose.length) { return null; }
    return React__default.createElement( Spacer, null,
        React__default.createElement( Warning, null ),

        Boolean(underMinSize.length) && React__default.createElement( 'div', null,
            React__default.createElement( 'h3', null, "Small touch target" ),
            React__default.createElement( 'p', null, "With heights and/or widths of less than ", minSize, "px, these tappable elements could be difficult for users to press:" ),
            React__default.createElement( 'ul', null,
              underMinSize.map(function (w, i) {
            return React__default.createElement( ListEntry, { key: i },
                    React__default.createElement( 'code', null, w.type ), " with content", ' ',
                    w.text ? React__default.createElement( 'b', null, w.text ) : w.html ? React__default.createElement( StyledTappableContents, { dangerouslySetInnerHTML: {
                __html: w.html
              } }) : '[no text found]'
                  );
          })
            )
          ),
        Boolean(tooClose.length) && React__default.createElement( 'div', null,
            React__default.createElement( 'h3', { style: {
          marginTop: Boolean(underMinSize.length) ? '.5rem' : '0'
        } }, "Touch targets close together", ' '
            ),
            React__default.createElement( 'p', null, "These elements have dimensions smaller than ", recommendedSize, "px and are less than ", recommendedDistance, "px from at least one other tappable element:" ),
            React__default.createElement( 'ul', null,
              tooClose.map(function (w, i) {
            return React__default.createElement( ListEntry, { key: i },
                    React__default.createElement( 'code', null, w.type ), " with content", ' ',
                    w.text ? React__default.createElement( 'b', null, w.text ) : w.html ? React__default.createElement( StyledTappableContents, { dangerouslySetInnerHTML: {
                __html: w.html
              } }) : '[no text found]'
                  );
          })
            )
          ),
        React__default.createElement( 'details', null,
          React__default.createElement( 'summary', null, fixText ),
          React__default.createElement( 'ul', null,
            React__default.createElement( 'li', null,
              React__default.createElement( 'a', { href: "https://www.nngroup.com/articles/touch-target-size/" }, "Touch target size article from the Nielsen Normal Group")
            ),
            React__default.createElement( 'li', null,
              React__default.createElement( 'a', { href: "https://developers.google.com/web/fundamentals/accessibility/accessible-styles" }, "Google's tap target size accessibility recommendations")
            )
          ),
          React__default.createElement( 'p', null )
        )
      );
  };

  var Hints = function (ref) {
    var container = ref.container;
    var theme = ref.theme;

    var activeWarnings = getTapHighlightWarnings(container);
    var autocompleteWarnings = getAutocompleteWarnings(container);
    var inputTypeWarnings = getInputTypeWarnings(container);
    var touchTargetWarnings = getTouchTargetSizeWarning({
      container: container,
      minSize: minSize,
      recommendedSize: recommendedSize,
      recommendedDistance: recommendedDistance
    });
    var overflowWarnings = getOverflowAutoWarnings(container);
    var srcsetWarnings = getSrcsetWarnings(container);
    var heightWarnings = get100vhWarning(container);
    var inputTypeNumberWarnings = getInputTypeNumberWarnings(container);
    var warningCount = activeWarnings.length + autocompleteWarnings.length + touchTargetWarnings.underMinSize.length + touchTargetWarnings.tooClose.length + overflowWarnings.length + srcsetWarnings.length + inputTypeWarnings.length + overflowWarnings.length + heightWarnings.length + inputTypeNumberWarnings.length;
    React__default.useEffect(function () {
      var tab = Array.from(document.querySelectorAll('button[role="tab"]')).find(function (el) { return /^Mobile(\s\(\d+\))?$/.test(el.innerText); });

      if (tab) {
        if (warningCount === 0) {
          tab.innerText = 'Mobile';
        } else {
          tab.innerText = "Mobile (" + warningCount + ")";
        }
      }
    });
    if (!warningCount) { return React__default.createElement( NoWarning, null, "Looking good! No mobile hints available." ); }
    return React__default.createElement( styled.ThemeProvider, { theme: theme },
        React__default.createElement( Container, null,
          React__default.createElement( TouchTargetWarnings, { warnings: touchTargetWarnings }),
          React__default.createElement( AutocompleteWarnings, { warnings: autocompleteWarnings }),
          React__default.createElement( SrcsetWarnings, { warnings: srcsetWarnings }),
          React__default.createElement( OverflowWarning, { warnings: overflowWarnings }),
          React__default.createElement( InputTypeWarnings, { warnings: inputTypeWarnings }),
          React__default.createElement( InputTypeNumberWarnings, { warnings: inputTypeNumberWarnings }),
          React__default.createElement( HeightWarnings, { warnings: heightWarnings }),
          React__default.createElement( ActiveWarnings, { warnings: activeWarnings })
        )
      );
  };

  var Hints$1 = emotionTheming.withTheme(Hints);

  var templateObject$8 = Object.freeze(["\n  padding: 1rem;\n  font-weight: bold;\n"]);
  var StyledLoading = newStyled.div(templateObject$8);
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
    var cachedState = React__default.useRef(null);
    React__default.useEffect(function () {
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
    var ref$1 = React__default.useState('');
    var storyId = ref$1[0];
    var setStoryId = ref$1[1];
    api.useChannel(( obj = {}, obj[coreEvents.STORY_CHANGED] = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        setStoryId(args);
      }, obj ));
    return React__default.cloneElement(children, {
      storyId: storyId
    });
  };

  var getContainer = function () {
    var iframe = document.getElementById('storybook-preview-iframe');
    if (!iframe) { return null; }
    return iframe.contentDocument;
  };

  var delay = 2500;

  var MyPanel = function (ref) {
    var storyId = ref.storyId;

    var ref$1 = React__default.useState('');
    var html = ref$1[0];
    var setHTML = ref$1[1];
    React__default.useEffect(function () {
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
    if (!html) { return React__default.createElement( StyledLoading, null, "Running mobile audit..." ); }
    var container = getContainer();
    return React__default.createElement( Hints$1, { container: container });
  };

  addons.addons.register(ADDON_ID, function () {
    var render = function (ref) {
      var active = ref.active;
      var key = ref.key;

      return React__default.createElement( React__default.Fragment, null,
          React__default.createElement( ViewportManager, { active: active }),
          React__default.createElement( components.AddonPanel, { active: active, key: key },
            React__default.createElement( StateWrapper, { active: active },
              React__default.createElement( MyPanel, { key: key, active: active })
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
