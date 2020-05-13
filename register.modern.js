import React, { createContext, forwardRef, createElement } from 'react';
import { addons, types } from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';
import { useAddonState, useChannel } from '@storybook/api';
import { AddonPanel } from '@storybook/components';
import styled, { ThemeProvider } from 'styled-components';
import { withTheme } from 'emotion-theming';

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
  isBrowser === false ) && cache.registered[className] === undefined) {
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

var EmotionCacheContext = createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? createCache() : null);
var ThemeContext = createContext({});

var withEmotionCache = function withEmotionCache(func) {
  var render = function render(props, ref) {
    return createElement(EmotionCacheContext.Consumer, null, function (cache) {
      return func(props, cache, ref);
    });
  }; // $FlowFixMe


  return forwardRef(render);
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
  var ele = createElement(type, newProps);

  return ele;
};

var Emotion =
/* #__PURE__ */
withEmotionCache(function (props, cache, ref) {
  // use Context.read for the theme when it's stable
  if (typeof props.css === 'function') {
    return createElement(ThemeContext.Consumer, null, function (theme) {
      return render(cache, props, theme, ref);
    });
  }

  return render(cache, props, null, ref);
});

if (process.env.NODE_ENV !== 'production') {
  Emotion.displayName = 'EmotionCssPropInternal';
} // $FlowFixMe

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

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = getRegisteredStyles(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var ClassNames = withEmotionCache(function (props, context) {
  return createElement(ThemeContext.Consumer, null, function (theme) {
    var hasRendered = false;

    var css = function css() {
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

      return merge(context.registered, css, classnames(args));
    };

    var content = {
      css: css,
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
      return createElement(ThemeContext.Consumer, null, function (theme) {
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

        var ele = createElement(finalTag, newProps);

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

const getNodeName = el => el.nodeName === 'A' ? 'a' : el.nodeName === 'BUTTON' ? 'button' : `${el.nodeName.toLowerCase()}[role="button"]`;

const getActiveStyles = function (container, el) {
  const sheets = container.styleSheets;
  const result = [];
  const activeRegex = /:active$/;
  Object.keys(sheets).forEach(k => {
    const rules = sheets[k].rules || sheets[k].cssRules;
    rules.forEach(rule => {
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
    const rules = sheets[k].rules || sheets[k].cssRules;
    rules.forEach(rule => {
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
const getOverflowAutoWarnings = container => {
  return getElements(container, '#root *').filter(el => {
    const style = getComputedStyle(el);
    const scrollStyles = ['scroll', 'auto'];

    if (scrollStyles.includes(style.overflow) || scrollStyles.includes(style.overflowX) || scrollStyles.includes(style.overflowY)) {
      if (style['-webkit-overflow-scrolling'] !== 'touch') {
        return true;
      }
    }

    return false;
  }).map(el => ({
    path: getDomPath(el)
  }));
};
const getOriginalStyles = function (container, el) {
  const sheets = container.styleSheets;
  const result = [];
  Object.keys(sheets).forEach(k => {
    const rules = sheets[k].rules || sheets[k].cssRules;
    rules.forEach(rule => {
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
const getTooWideWarnings = container => {
  const containerWidth = container.body.clientWidth;
  const allElements = getElements(container, '#root *');
  return allElements.filter(el => {
    return el.clientWidth > containerWidth;
  }).map(el => {
    return {
      el,
      path: getDomPath(el)
    };
  });
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
    display: inline-block;
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
    padding-bottom: .5rem;
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

const OverflowWarning = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Scrollable container without", ' ', /*#__PURE__*/React.createElement("code", null, "-webkit-overflow-scrolling:touch")), /*#__PURE__*/React.createElement("p", null, "This element will scroll awkwardly on versions of iOS before iOS 13."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
    path
  }, i) => {
    return /*#__PURE__*/React.createElement(ListEntry, {
      key: i
    }, /*#__PURE__*/React.createElement("code", null, path));
  })), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, fixText), /*#__PURE__*/React.createElement("p", null, "To ensure your users benefit from momentum scrolling, add this line of CSS: ", /*#__PURE__*/React.createElement("code", null, "-webkit-overflow-scrolling:touch;"), " to any container with a style of ", /*#__PURE__*/React.createElement("code", null, "overflow: auto"), " or", ' ', /*#__PURE__*/React.createElement("code", null, "overflow: scroll"), ".", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling"
  }, "Learn more about the property here."))));
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
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Non-dynamic background image"), /*#__PURE__*/React.createElement("p", null, "Downloading larger-than-necessary images hurts performance for users on mobile. You can", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://css-tricks.com/responsive-images-css/"
  }, "use ", /*#__PURE__*/React.createElement("code", null, "image-set"), " or ", /*#__PURE__*/React.createElement("code", null, "min-resolution")), ' ', "to serve an appropriate image based on the user's screen size and resolution."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
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
  })));
};

const SrcsetWarnings = ({
  warnings
}) => {
  if (!warnings.length) return null;
  return /*#__PURE__*/React.createElement(Spacer, null, /*#__PURE__*/React.createElement(Warning, null), /*#__PURE__*/React.createElement("h3", null, "Large image without ", /*#__PURE__*/React.createElement("code", null, "srscset")), /*#__PURE__*/React.createElement("p", null, "Downloading larger-than-necessary images hurts performance for users on mobile. You can use ", /*#__PURE__*/React.createElement("code", null, "srcset"), " to customize image sizes for different device resolutions and sizes."), /*#__PURE__*/React.createElement("ul", null, warnings.map(({
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
    overflow: getOverflowAutoWarnings(container),
    srcset: getSrcsetWarnings(container),
    backgroundImg: getBackgroundImageWarnings(container),
    height: get100vhWarning(container),
    inputTypeNumber: getInputTypeNumberWarnings(container),
    tooWide: getTooWideWarnings(container)
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
  if (!warningCount) return /*#__PURE__*/React.createElement(Wrapper, {
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
  }), /*#__PURE__*/React.createElement(OverflowWarning, {
    warnings: warnings.overflow
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

let _$1 = t => t,
    _t$1;
const StyledLoading = newStyled.div(_t$1 || (_t$1 = _$1`
  padding: 1rem;
  font-weight: bold;
`));
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

const delay = 2500;

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
