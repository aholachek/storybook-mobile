import e,{Fragment as t}from"react";import{addons as n,types as l}from"@storybook/addons";import{STORY_RENDERED as r}from"@storybook/core-events";import{useAddonState as o,useChannel as a}from"@storybook/api";import{AddonPanel as c}from"@storybook/components";import{styled as i}from"@storybook/theming";import{createScheduler as s}from"lrt";function m(){return m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var l in n)Object.prototype.hasOwnProperty.call(n,l)&&(e[l]=n[l])}return e},m.apply(this,arguments)}function u(e){for(var t=[];e.parentNode;){let r=0,o=0;for(var n=0;n<e.parentNode.childNodes.length;n++){var l=e.parentNode.childNodes[n];l.nodeName===e.nodeName&&(l===e&&(o=r),r++)}e.hasAttribute("id")&&""!==e.id?t.unshift(e.nodeName.toLowerCase()+"#"+e.id):""!==e.classList.toString()&&"BODY"!==e.tagName?t.unshift(e.nodeName.toLowerCase()+"."+e.classList.toString()):t.unshift(r>1?e.nodeName.toLowerCase()+":eq("+o+")":e.nodeName.toLowerCase()),e=e.parentNode}const r=["html","body","div#root"];return t.filter(e=>!r.includes(e)).join(" > ")}const h=(e,t)=>Array.from(e.querySelectorAll(t)),d=(e,t)=>{let n=[];try{n=Array.from(e[t].rules||e[t].cssRules)}catch(e){}return n},p=e=>"A"===e.nodeName?"a":"BUTTON"===e.nodeName?"button":`${e.nodeName.toLowerCase()}[role="button"]`,g=(e,t)=>e.map(e=>{let n="";if(e.labels&&e.labels[0])n=e.labels[0].innerText;else if("LABEL"===e.parentElement.nodeName)n=e.parentElement.innerText;else if(e.id){const l=t.querySelector(`label[for="${e.id}"]`);l&&(n=l.innerText)}return{labelText:n,path:u(e),type:e.type}}),E={text:!0,search:!0,tel:!0,url:!0,email:!0,number:!0,password:!0},b=e=>{const t=h(e,"input").filter(e=>{const t=e.getAttribute("type"),n=e.getAttribute("autocomplete");return E[t]&&!n});return g(t,e)},f=e=>{const t=h(e,'input[type="number"]');return g(t)},y=e=>{const t=h(e,'input[type="text"]').concat(h(e,"input:not([type])")).filter(e=>!e.getAttribute("inputmode"));return g(t,e)},w=(e,t)=>t.top<=e.bottom&&t.bottom>=e.top&&t.left<=e.right&&t.right>=e.left,v=({el:e,bounding:{width:t,height:n},close:l})=>({type:"A"===e.nodeName?"a":"BUTTON"===e.nodeName?"button":`${e.nodeName.toLowerCase()}[role="button"]`,path:u(e),text:e.innerText,html:e.innerHTML,width:Math.floor(t),height:Math.floor(n),close:l}),k=({height:e,width:t})=>e<32||t<32;function*x(e){const t=h(e,"button").concat(h(e,'[role="button"]')).concat(h(e,"a")),n=Array.from(new Set(t)).map(e=>[e,e.getBoundingClientRect()]),l=t.length,r=[],o=[];for(let e=0;e<l;e++){const l=t[e],a=l.getBoundingClientRect(),c={top:a.top-8,left:a.left-8,right:a.right+8,bottom:a.bottom+8},i=n.filter(([e,t])=>e!==l&&w(c,t)),s=k(a);if(s||i.length>0){const e=v({el:l,bounding:a,close:i});s&&r.push(e),i.length>0&&o.push(e)}yield e}return{tooClose:o,underMinSize:r}}function*T(e){const t=h(e,"button").concat(h(e,'[role="button"]')),n=h(e,"a"),l=t.concat(n),r=l.length,o=[];for(let e=0;e<r;e++){const t=l[e];"rgba(0, 0, 0, 0)"===getComputedStyle(t)["-webkit-tap-highlight-color"]&&o.push({type:p(t),text:t.innerText,html:t.innerHTML,path:u(t)}),yield e}return o}function*S(e){const t=h(e,"img"),n=t.length,l=[];for(let e=0;e<n;e++){const n=t[e],r=n.getAttribute("srcset"),o=n.getAttribute("src");!r&&o&&(Boolean(o.match(/svg$/))||(parseInt(getComputedStyle(n).width,10)>600||n.naturalWidth>600)&&l.push({src:n.src,path:u(n),alt:n.alt})),yield e}return l}function*N(e){const t=/url\(".*?(.png|.jpg|.jpeg)"\)/,n=h(e,"#root *").filter(e=>{const n=getComputedStyle(e);return n["background-image"]&&t.test(n["background-image"])&&e.clientWidth>200});if(!n.length)return[];const l=new Map;Object.keys(e.styleSheets).forEach(t=>{d(e.styleSheets,t).forEach(e=>{if(e)try{n.forEach(t=>{t.matches(e.selectorText)&&l.set(t,(l.get(t)||[]).concat(e))})}catch(e){}})});const r=/-webkit-min-device-pixel-ratio|min-resolution|image-set/,o=[],a=Array.from(l.entries()),c=a.length;for(let e=0;e<c;e++){const[t,n]=a[e];if(n&&n.some(e=>!r.test(e))){const e=getComputedStyle(t).backgroundImage,n=e.match(/url\("(.*)"\)/)?e.match(/url\("(.*)"\)/)[1]:void 0;o.push({path:u(t),src:n})}yield e}return o}const L=function(e,t){const n=e.styleSheets,l=[],r=/:active$/;return Object.keys(n).forEach(e=>{d(n,e).forEach(e=>{if(e&&e.selectorText&&e.selectorText.match(r)){const n=e.selectorText.replace(r,"");try{t.matches(n)&&l.push(e)}catch(e){}}})}),l};function*C(e){const t=h(e,"button").concat(h(e,'[role="button"]')),n=h(e,"a"),l=t.concat(n),r=l.length,o=[];for(let t=0;t<r;t++){const n=l[t];L(e,n).length&&o.push({type:p(n),text:n.innerText,html:n.innerHTML,path:u(n)}),yield t}return o}const A=(e,t)=>{const n=e.styleSheets;let l=[];return Object.keys(n).forEach(e=>{d(n,e).forEach(e=>{if(e)try{t.matches(e.selectorText)&&l.push(e.cssText)}catch(e){}})}),l};function*z(e){const t=h(e,"#root *"),n=t.length,l=[];for(let r=0;r<n;r++){const n=t[r],o=A(e,n).find(e=>/100vh/.test(e));o&&l.push({el:n,css:o,path:u(n)}),yield r}return l}const M=e=>{const t=s({chunkBudget:100}),n=t.runTask(e);return{task:n,abort:()=>t.abortTask(n)}};let _,O,$,I,B,j,H,R,q,U,W=e=>e;const D="\n  padding: .25rem .5rem;\n  font-weight: bold;\n  display:inline-block;\n  border-radius: 10px;\n  margin-bottom: 1rem;\n  svg {\n    margin-right: .25rem;\n    display: inline-block;\n    height: .7rem;\n    line-height: 1;\n    position: relative;\n    top: .03rem;\n    letter-spacing: .01rem;\n  }\n",Y=i.div(_||(_=W`
  color: ${0};
  background-color: hsl(41, 100%, 92%);
  ${0}
`),"#bd4700",D),G=()=>/*#__PURE__*/e.createElement(Y,null,/*#__PURE__*/e.createElement("svg",{"aria-hidden":"true",focusable:"false",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 576 512"},/*#__PURE__*/e.createElement("path",{fill:"currentColor",d:"M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"})),"warning"),J=i.div(O||(O=W`
  ${0}
  color: ${0};
  background-color: hsla(214, 92%, 45%, 0.1);
`),D,"#0965df"),P=()=>/*#__PURE__*/e.createElement(J,null,/*#__PURE__*/e.createElement("svg",{"aria-hidden":"true",focusable:"false","data-prefix":"fas","data-icon":"magic",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512",className:"svg-inline--fa fa-magic fa-w-16 fa-5x"},/*#__PURE__*/e.createElement("path",{fill:"currentColor",d:"M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z",className:""})),"hint"),X=i.div($||($=W`
  padding: 1rem;
`)),F=i.div(I||(I=W`
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
`)),K=i.img(B||(B=W`
  height: 4rem;
  width: auto;
  max-width: 100%;
  background-color: hsla(0, 0%, 0%, 0.2);
`)),V=i.li(j||(j=W`
  margin-bottom: 0.5rem;
  ${0};
`),e=>e.nostyle?"list-style-type: none;":""),Q=i.div(H||(H=W`
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
`),e=>e.theme.typography.size.s2,e=>e.theme.typography.size.s2,"#0965df",e=>e.theme.color.mediumlight,"#0965df","#0965df",e=>e.theme.color.medium,e=>e.theme.color.medium),Z=i.div(R||(R=W`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  grid-column: 1 / -1;
  height: 2.875rem;
`)),ee=i.button(q||(q=W`
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
`)),te=i.div(U||(U=W`
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
`)),ne="Learn more",le=({warnings:t})=>t&&t.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(P,null),/*#__PURE__*/e.createElement("h3",null,/*#__PURE__*/e.createElement("code",null,":active")," styles on iOS"),/*#__PURE__*/e.createElement("p",null,/*#__PURE__*/e.createElement("code",null,":active")," styles will only appear in iOS"," ",/*#__PURE__*/e.createElement("a",{href:"https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari",target:"_blank",rel:"noopener noreferrer"},"if a touch listener is added to the element or one of its ancestors"),". Once activated in this manner, ",/*#__PURE__*/e.createElement("code",null,":active")," styles (along with"," ",/*#__PURE__*/e.createElement("code",null,":hover")," styles) will be applied immediately in iOS when a user taps, possibly creating a confusing UX. (On Android,"," ",/*#__PURE__*/e.createElement("code",null,":active")," styles are applied with a slight delay to allow the user to use gestures like scroll without necessarily activating"," ",/*#__PURE__*/e.createElement("code",null,":active")," styles.)"),/*#__PURE__*/e.createElement("ul",null,t.map((t,n)=>/*#__PURE__*/e.createElement(V,{key:n},/*#__PURE__*/e.createElement("code",null,t.type)," with content  ",t.text?/*#__PURE__*/e.createElement("b",null,t.text):t.html?/*#__PURE__*/e.createElement(F,{dangerouslySetInnerHTML:{__html:t.html}}):"[no text found]"))),/*#__PURE__*/e.createElement("details",null,/*#__PURE__*/e.createElement("summary",null,ne),/*#__PURE__*/e.createElement("p",{style:{marginTop:"1rem"}},/*#__PURE__*/e.createElement("a",{href:"https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari/33681490#33681490",target:"_blank",rel:"noopener noreferrer"},"Relevant Stack Overflow thread")))):null,re=({warnings:t})=>t&&t.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(P,null),/*#__PURE__*/e.createElement("h3",null,"Tap style removed from tappable element"),/*#__PURE__*/e.createElement("p",null,"These elements have an invisible"," ",/*#__PURE__*/e.createElement("code",null,"-webkit-tap-highlight-color"),". While this might be intentional, please verify that they have appropriate tap indication styles added through other means."),/*#__PURE__*/e.createElement("ul",null,t.map((t,n)=>/*#__PURE__*/e.createElement(V,{key:n},/*#__PURE__*/e.createElement("code",null,t.type)," with content  ",t.text?/*#__PURE__*/e.createElement("b",null,t.text):t.html?/*#__PURE__*/e.createElement(F,{dangerouslySetInnerHTML:{__html:t.html}}):"[no text found]"))),/*#__PURE__*/e.createElement("details",null,/*#__PURE__*/e.createElement("summary",null,ne),/*#__PURE__*/e.createElement("p",null,"Some stylesheets remove the tap indication highlight shown on iOS and Android browsers by adding the code"," ",/*#__PURE__*/e.createElement("code",null,"-webkit-tap-highlight-color: transparent"),". In order to maintain a good mobile experience, tap styles should be added via appropriate ",/*#__PURE__*/e.createElement("code",null,":active")," CSS styles (though, note that"," ",/*#__PURE__*/e.createElement("a",{href:"https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari",target:"_blank",rel:"noopener noreferrer"},/*#__PURE__*/e.createElement("code",null,":active")," styles work inconsistently in iOS"),") , or via JavaScript on the ",/*#__PURE__*/e.createElement("code",null,"touchstart")," event."))):null,oe=({warnings:t})=>t&&t.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(G,null),/*#__PURE__*/e.createElement("h3",null,"Input with no ",/*#__PURE__*/e.createElement("code",null,"autocomplete")," attribute"),/*#__PURE__*/e.createElement("p",null,"Most textual inputs should have an explicit ",/*#__PURE__*/e.createElement("code",null,"autocomplete")," ","attribute."),/*#__PURE__*/e.createElement("p",null,"If you truly want to disable autocomplete, try using a"," ",/*#__PURE__*/e.createElement("a",{href:"https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164",target:"_blank",rel:"noopener noreferrer"},"semantically valid but unique value rather than"," ",/*#__PURE__*/e.createElement("code",null,'autocomplete="off"')),", which doesn't work in Chrome."),/*#__PURE__*/e.createElement("p",null,"Note: ",/*#__PURE__*/e.createElement("code",null,"autocomplete")," is styled as ",/*#__PURE__*/e.createElement("code",null,"autoComplete")," ","in JSX."),/*#__PURE__*/e.createElement("ul",null,t.map((t,n)=>/*#__PURE__*/e.createElement(V,{key:n},/*#__PURE__*/e.createElement("code",null,'input type="',t.type,'"')," and label"," ",/*#__PURE__*/e.createElement("b",null,t.labelText||"[no label found]")))),/*#__PURE__*/e.createElement("details",null,/*#__PURE__*/e.createElement("summary",null,ne),/*#__PURE__*/e.createElement("ul",null,/*#__PURE__*/e.createElement("li",null,/*#__PURE__*/e.createElement("a",{href:"https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill",target:"_blank",rel:"noopener noreferrer"},"Autocomplete documentation by Google")),/*#__PURE__*/e.createElement("li",null,/*#__PURE__*/e.createElement("a",{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete",target:"_blank",rel:"noopener noreferrer"},"Autocomplete documentation by Mozilla"))))):null,ae=({warnings:t})=>t&&t.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(P,null),/*#__PURE__*/e.createElement("h3",null,"Plain input type ",/*#__PURE__*/e.createElement("code",null,"text")," detected"),/*#__PURE__*/e.createElement("p",null,"This will render the default text keyboard on mobile (which could very well be what you want!) If you haven't already, take a moment to make sure this is correct. You can use"," ",/*#__PURE__*/e.createElement("a",{href:"https://better-mobile-inputs.netlify.com/",target:"_blank",rel:"noopener noreferrer"},"this tool")," ","to explore keyboard options."),/*#__PURE__*/e.createElement("ul",null,t.map((t,n)=>/*#__PURE__*/e.createElement(V,{key:n},/*#__PURE__*/e.createElement("code",null,'input type="',t.type,'"')," and label"," ",/*#__PURE__*/e.createElement("b",null,t.labelText||"[no label found]")))),/*#__PURE__*/e.createElement("details",null,/*#__PURE__*/e.createElement("summary",null,ne),/*#__PURE__*/e.createElement("p",null,/*#__PURE__*/e.createElement("a",{href:"https://css-tricks.com/better-form-inputs-for-better-mobile-user-experiences/",target:"_blank",rel:"noopener noreferrer"},"Article reviewing the importance of using correct input types on the mobile web from CSS Tricks.")))):null,ce=({warnings:t})=>t&&t.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(P,null),/*#__PURE__*/e.createElement("h3",null,"Input type ",/*#__PURE__*/e.createElement("code",null,"number")," detected"),/*#__PURE__*/e.createElement("p",null,/*#__PURE__*/e.createElement("code",null,'<input type="text" inputmode="decimal"/>')," ","could give you improved usability over"," ",/*#__PURE__*/e.createElement("code",null,'<input type="number" />'),"."),/*#__PURE__*/e.createElement("p",null,"Note: ",/*#__PURE__*/e.createElement("code",null,"inputmode")," is styled as ",/*#__PURE__*/e.createElement("code",null,"inputMode")," in JSX."," "),/*#__PURE__*/e.createElement("ul",null,t.map((t,n)=>/*#__PURE__*/e.createElement(V,{key:n},/*#__PURE__*/e.createElement("code",null,'input type="',t.type,'"')," and label"," ",/*#__PURE__*/e.createElement("b",null,t.labelText||"[no label found]")))),/*#__PURE__*/e.createElement("details",null,/*#__PURE__*/e.createElement("summary",null,ne),/*#__PURE__*/e.createElement("p",null,/*#__PURE__*/e.createElement("a",{href:"https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/",target:"_blank",rel:"noopener noreferrer"},"Overview of the issues with"," ",/*#__PURE__*/e.createElement("code",null,'input type="number"')," from gov.uk.")))):null,ie=({warnings:t})=>t&&t.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(P,null),/*#__PURE__*/e.createElement("h3",null,"Usage of ",/*#__PURE__*/e.createElement("code",null,"100vh")," CSS"),/*#__PURE__*/e.createElement("p",null,/*#__PURE__*/e.createElement("a",{href:"https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html",target:"_blank",rel:"noopener noreferrer"},"Viewport units are tricky on mobile.")," ","On some mobile browers, depending on scroll position, ",/*#__PURE__*/e.createElement("code",null,"100vh")," ","might take up more than 100% of screen height due to browser chrome like the address bar."),/*#__PURE__*/e.createElement("ul",null,t.map(({path:t},n)=>/*#__PURE__*/e.createElement(V,{key:n},/*#__PURE__*/e.createElement("code",null,t))))):null,se=({warnings:t})=>t&&t.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(G,null),/*#__PURE__*/e.createElement("h3",null,"Non-dynamic background image"),/*#__PURE__*/e.createElement("p",null,"Downloading larger-than-necessary images hurts performance for users on mobile. You can use"," ",/*#__PURE__*/e.createElement("a",{href:"https://developer.mozilla.org/en-US/docs/Web/CSS/image-set",target:"_blank",rel:"noopener noreferrer"},/*#__PURE__*/e.createElement("code",null,"image-set"))," ","to serve an appropriate background image based on the user's device resolution."),/*#__PURE__*/e.createElement("ul",null,t.map(({src:t,alt:n},l)=>/*#__PURE__*/e.createElement(V,{key:l,nostyle:!0},/*#__PURE__*/e.createElement("div",null,/*#__PURE__*/e.createElement(K,{src:t,alt:n}))))),/*#__PURE__*/e.createElement("details",null,/*#__PURE__*/e.createElement("summary",null,ne),/*#__PURE__*/e.createElement("ul",null,/*#__PURE__*/e.createElement("li",null,/*#__PURE__*/e.createElement("a",{href:"https://css-tricks.com/responsive-images-css/",target:"_blank",rel:"noopener noreferrer"},"Article discussing responsive background images in greater detail, including the interaction of ",/*#__PURE__*/e.createElement("code",null,"image-set")," with media queries, from CSS Tricks."))))):null,me=({warnings:t})=>t&&t.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(G,null),/*#__PURE__*/e.createElement("h3",null,"Large image without ",/*#__PURE__*/e.createElement("code",null,"srcset")),/*#__PURE__*/e.createElement("p",null,"Downloading larger-than-necessary images hurts performance for users on mobile. You can use ",/*#__PURE__*/e.createElement("code",null,"srcset")," to customize image sizes for different device resolutions and sizes."),/*#__PURE__*/e.createElement("ul",null,t.map(({src:t,alt:n},l)=>/*#__PURE__*/e.createElement(V,{key:l,nostyle:!0},/*#__PURE__*/e.createElement("div",null,/*#__PURE__*/e.createElement(K,{src:t,alt:n}))))),/*#__PURE__*/e.createElement("details",null,/*#__PURE__*/e.createElement("summary",null,ne),/*#__PURE__*/e.createElement("ul",null,/*#__PURE__*/e.createElement("li",null,/*#__PURE__*/e.createElement("a",{href:"https://cloudfour.com/thinks/responsive-images-the-simple-way",target:"_blank",rel:"noopener noreferrer"},"Summary of the why and how of responsive images")),/*#__PURE__*/e.createElement("li",null,/*#__PURE__*/e.createElement("a",{href:"https://www.responsivebreakpoints.com/",target:"_blank",rel:"noopener noreferrer"},"A tool to generate responsive images"))))):null,ue=({warnings:t})=>{if(!t)return null;const{underMinSize:n,tooClose:l}=t;return n.length||l.length?/*#__PURE__*/e.createElement(X,null,/*#__PURE__*/e.createElement(G,null),Boolean(n.length)&&/*#__PURE__*/e.createElement("div",null,/*#__PURE__*/e.createElement("h3",null,"Small touch target"),/*#__PURE__*/e.createElement("p",null,"With heights and/or widths of less than ",32,"px, these tappable elements could be difficult for users to press:"),/*#__PURE__*/e.createElement("ul",null,n.map((t,n)=>/*#__PURE__*/e.createElement(V,{key:n},/*#__PURE__*/e.createElement("code",null,t.type)," with content  ",t.text?/*#__PURE__*/e.createElement("b",null,t.text):t.html?/*#__PURE__*/e.createElement(F,{dangerouslySetInnerHTML:{__html:t.html}}):"[no text found]")))),Boolean(l.length)&&/*#__PURE__*/e.createElement("div",null,/*#__PURE__*/e.createElement("h3",{style:{marginTop:n.length?".5rem":"0"}},"Touch targets close together"," "),/*#__PURE__*/e.createElement("p",null,"These tappable elements are less than ",8,"px from at least one other tappable element:"),/*#__PURE__*/e.createElement("ul",null,l.map((t,n)=>/*#__PURE__*/e.createElement(V,{key:n},/*#__PURE__*/e.createElement("code",null,t.type)," with content  ",t.text?/*#__PURE__*/e.createElement("b",null,t.text):t.html?/*#__PURE__*/e.createElement(F,{dangerouslySetInnerHTML:{__html:t.html}}):"[no text found]")))),/*#__PURE__*/e.createElement("details",null,/*#__PURE__*/e.createElement("summary",null,ne),/*#__PURE__*/e.createElement("ul",null,/*#__PURE__*/e.createElement("li",null,/*#__PURE__*/e.createElement("a",{href:"https://www.nngroup.com/articles/touch-target-size/",target:"_blank",rel:"noopener noreferrer"},"Touch target size article from the Nielsen Norman Group")),/*#__PURE__*/e.createElement("li",null,/*#__PURE__*/e.createElement("a",{href:"https://web.dev/accessible-tap-targets/",target:"_blank",rel:"noopener noreferrer"},"Tap target size recommendations from Google"))))):null},he=e=>e>0?1:0,de=()=>/*#__PURE__*/e.createElement(Z,null,/*#__PURE__*/e.createElement(te,null),/*#__PURE__*/e.createElement("span",null,"Running scan...")),pe=({container:n})=>{const[l,r]=e.useState(void 0),[o,a]=e.useState(!1),[c,i]=e.useState(0);e.useEffect(()=>(a(!1),r((e=>({autocomplete:b(e),inputType:y(e),inputTypeNumber:f(e)}))(n)),((e,t,n)=>{const l={tapHighlight:M(T(e)),srcset:M(S(e)),backgroundImg:M(N(e)),touchTarget:M(x(e)),active:M(C(e)),height:M(z(e))},r=Object.keys(l);let o=r.length;return r.forEach(e=>{l[e].task.then(l=>{t(t=>m({},t,{[e]:l})),0==--o&&n(!0)})}),()=>r.forEach(e=>l[e].abort())})(n,r,a)),[n,c]);const s=e.useMemo(()=>l?Object.keys(l).reduce((e,t)=>{const n=l[t],r=Array.isArray(n)?he(n.length):Object.keys(n).map(e=>n[e]).reduce((e,t)=>e+he(t.length),0);return e+r},0):0,[l]);if(!l)/*#__PURE__*/return e.createElement(de,null);const u=()=>i(e=>e+1);if(0===s&&o)/*#__PURE__*/return e.createElement(Z,null,/*#__PURE__*/e.createElement("span",null,"Scan complete! No issues found."),/*#__PURE__*/e.createElement(ee,{onClick:u,type:"button"},"Rescan"));const h=(e=>`${e} issue${1!==e?"s":""} found`)(s);/*#__PURE__*/return e.createElement(Q,null,/*#__PURE__*/e.createElement(Z,null,o?/*#__PURE__*/e.createElement(t,null,/*#__PURE__*/e.createElement("span",null,"Scan complete! ",h,"."),/*#__PURE__*/e.createElement(ee,{onClick:u,type:"button"},"Rescan")):/*#__PURE__*/e.createElement(t,null,/*#__PURE__*/e.createElement(te,null),/*#__PURE__*/e.createElement("span",null,s>0?`Running scan - ${h} so far`:"Running scan","..."))),/*#__PURE__*/e.createElement(ue,{warnings:l.touchTarget}),/*#__PURE__*/e.createElement(oe,{warnings:l.autocomplete}),/*#__PURE__*/e.createElement(ae,{warnings:l.inputType}),/*#__PURE__*/e.createElement(ce,{warnings:l.inputTypeNumber}),/*#__PURE__*/e.createElement(re,{warnings:l.tapHighlight}),/*#__PURE__*/e.createElement(le,{warnings:l.active}),/*#__PURE__*/e.createElement(me,{warnings:l.srcset}),/*#__PURE__*/e.createElement(se,{warnings:l.backgroundImg}),/*#__PURE__*/e.createElement(ie,{warnings:l.height}))},ge=({active:t})=>{const[n,l]=o("storybook/viewport"),r=e.useRef(null);return e.useEffect(()=>{r.current&&!t?(l({selected:r.current}),r.current=null):!t||n&&"reset"!==n.selected||(r.current="reset",l({selected:"mobile1"}))},[t]),null},Ee=({children:t})=>{const[n,l]=e.useState("");return a({[r]:(...e)=>{l(e)}}),e.cloneElement(t,{storyId:n})},be=()=>{const e=document.getElementById("storybook-preview-iframe");return e?e.contentDocument:null},fe=({active:t,storyId:n})=>{const[l,r]=e.useState(void 0);e.useEffect(()=>{let e;r(void 0);const t=()=>{const n=be();n&&n.body?r(n.body.innerHTML):(clearTimeout(e),e=setTimeout(t,2e3))};return clearTimeout(e),e=setTimeout(t,2e3),()=>clearTimeout(e)},[n]);const o=be();return t?l&&o?/*#__PURE__*/e.createElement(pe,{container:o}):/*#__PURE__*/e.createElement(de,null):null};n.register("mobile-hints",()=>{n.add("mobile-hints/panel",{type:l.PANEL,title:"Mobile",render:({active:t,key:n})=>/*#__PURE__*/e.createElement(e.Fragment,{key:"storybook-mobile"},/*#__PURE__*/e.createElement(ge,{active:t}),/*#__PURE__*/e.createElement(c,{key:n,active:t},/*#__PURE__*/e.createElement(Ee,{active:t},/*#__PURE__*/e.createElement(fe,{key:n,active:t})))),paramKey:"mobile-hints"})});
//# sourceMappingURL=register.modern.mjs.map
