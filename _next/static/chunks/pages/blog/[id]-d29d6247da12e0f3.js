(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[610],{516:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog/[id]",function(){return r(2272)}])},2419:function(e,t,r){"use strict";r.d(t,{Z:function(){return c}});var n=r(1799),i=r(9396),a=r(9534),o=r(5893),s=r(8420),l=r(6159);function c(e){var t=e.dateString,r=(0,a.Z)(e,["dateString"]),c=(0,s.Z)(t);return(0,o.jsx)("time",(0,i.Z)((0,n.Z)({dateTime:t},r),{children:(0,l.Z)(c,"LLLL d, yyyy")}))}},2272:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return s},default:function(){return l}});var n=r(5893);r(1864);var i=r(9008),a=r.n(i),o=r(2419),s=!0;function l(e){var t=e.post,r=t.image?new URL(t.image,"https://actuated.dev").toString():"";return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(a(),{children:[(0,n.jsx)("title",{children:t.title}),(0,n.jsx)("meta",{name:"description",content:t.description},"description"),(0,n.jsx)("meta",{property:"twitter:title",content:t.title},"tw_title"),(0,n.jsx)("meta",{property:"twitter:description",content:t.description},"tw_description"),(0,n.jsx)("meta",{property:"og:title",content:t.title},"og_title"),(0,n.jsx)("meta",{property:"og:description",content:t.description},"og_description"),t.image&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("meta",{name:"twitter:image:src",content:r},"tw_image"),(0,n.jsx)("meta",{property:"og:image",content:r},"og_image")]}),t.canonical&&(0,n.jsx)("link",{rel:"canonical",href:t.canonical})]}),(0,n.jsx)("div",{className:"container mx-auto max-w-4xl bg-white mt-4 px-4 sm:px-6",children:(0,n.jsx)("h1",{id:"post_title",className:"text-3xl mb-3 leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 text-center",children:t.title})}),(0,n.jsxs)("div",{className:"container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl",children:[(0,n.jsxs)("div",{className:"border-b border-gray-200 py-4 flex items-center text-gray-500 mx-auto",children:[(0,n.jsx)("div",{children:(0,n.jsx)("img",{className:"h-10 w-10 rounded-full",src:"/images/".concat(t.author_img,".jpg"),alt:""})}),(0,n.jsxs)("div",{className:"ml-3",children:[(0,n.jsx)("p",{id:"post_author",className:"text-sm leading-5 font-medium text-gray-900",children:t.author}),(0,n.jsxs)("div",{className:"flex text-sm leading-5 text-gray-500",children:[(0,n.jsx)(o.Z,{id:"post_date",dateString:t.date}),(0,n.jsx)("span",{className:"mx-1"})]})]})]}),(0,n.jsx)("div",{className:"mt-6 prose sm:prose-lg max-w-none",children:(0,n.jsx)("p",{id:"post_description",className:"mb-4",children:t.description})}),(0,n.jsx)("div",{id:"post_content",className:"mt-6 prose sm:prose-lg max-w-none",dangerouslySetInnerHTML:{__html:t.contentHtml}})]})]})}},1864:function(e){!function(){"use strict";var t={114:function(e){function t(e){if("string"!=typeof e)throw TypeError("Path must be a string. Received "+JSON.stringify(e))}function r(e,t){for(var r,n="",i=0,a=-1,o=0,s=0;s<=e.length;++s){if(s<e.length)r=e.charCodeAt(s);else if(47===r)break;else r=47;if(47===r){if(a===s-1||1===o);else if(a!==s-1&&2===o){if(n.length<2||2!==i||46!==n.charCodeAt(n.length-1)||46!==n.charCodeAt(n.length-2)){if(n.length>2){var l=n.lastIndexOf("/");if(l!==n.length-1){-1===l?(n="",i=0):i=(n=n.slice(0,l)).length-1-n.lastIndexOf("/"),a=s,o=0;continue}}else if(2===n.length||1===n.length){n="",i=0,a=s,o=0;continue}}t&&(n.length>0?n+="/..":n="..",i=2)}else n.length>0?n+="/"+e.slice(a+1,s):n=e.slice(a+1,s),i=s-a-1;a=s,o=0}else 46===r&&-1!==o?++o:o=-1}return n}var n={resolve:function(){for(var e,n,i="",a=!1,o=arguments.length-1;o>=-1&&!a;o--)o>=0?n=arguments[o]:(void 0===e&&(e=""),n=e),t(n),0!==n.length&&(i=n+"/"+i,a=47===n.charCodeAt(0));return(i=r(i,!a),a)?i.length>0?"/"+i:"/":i.length>0?i:"."},normalize:function(e){if(t(e),0===e.length)return".";var n=47===e.charCodeAt(0),i=47===e.charCodeAt(e.length-1);return(0!==(e=r(e,!n)).length||n||(e="."),e.length>0&&i&&(e+="/"),n)?"/"+e:e},isAbsolute:function(e){return t(e),e.length>0&&47===e.charCodeAt(0)},join:function(){if(0==arguments.length)return".";for(var e,r=0;r<arguments.length;++r){var i=arguments[r];t(i),i.length>0&&(void 0===e?e=i:e+="/"+i)}return void 0===e?".":n.normalize(e)},relative:function(e,r){if(t(e),t(r),e===r||(e=n.resolve(e))===(r=n.resolve(r)))return"";for(var i=1;i<e.length&&47===e.charCodeAt(i);++i);for(var a=e.length,o=a-i,s=1;s<r.length&&47===r.charCodeAt(s);++s);for(var l=r.length-s,c=o<l?o:l,d=-1,h=0;h<=c;++h){if(h===c){if(l>c){if(47===r.charCodeAt(s+h))return r.slice(s+h+1);if(0===h)return r.slice(s+h)}else o>c&&(47===e.charCodeAt(i+h)?d=h:0===h&&(d=0));break}var f=e.charCodeAt(i+h);if(f!==r.charCodeAt(s+h))break;47===f&&(d=h)}var g="";for(h=i+d+1;h<=a;++h)(h===a||47===e.charCodeAt(h))&&(0===g.length?g+="..":g+="/..");return g.length>0?g+r.slice(s+d):(s+=d,47===r.charCodeAt(s)&&++s,r.slice(s))},_makeLong:function(e){return e},dirname:function(e){if(t(e),0===e.length)return".";for(var r=e.charCodeAt(0),n=47===r,i=-1,a=!0,o=e.length-1;o>=1;--o)if(47===(r=e.charCodeAt(o))){if(!a){i=o;break}}else a=!1;return -1===i?n?"/":".":n&&1===i?"//":e.slice(0,i)},basename:function(e,r){if(void 0!==r&&"string"!=typeof r)throw TypeError('"ext" argument must be a string');t(e);var n,i=0,a=-1,o=!0;if(void 0!==r&&r.length>0&&r.length<=e.length){if(r.length===e.length&&r===e)return"";var s=r.length-1,l=-1;for(n=e.length-1;n>=0;--n){var c=e.charCodeAt(n);if(47===c){if(!o){i=n+1;break}}else -1===l&&(o=!1,l=n+1),s>=0&&(c===r.charCodeAt(s)?-1==--s&&(a=n):(s=-1,a=l))}return i===a?a=l:-1===a&&(a=e.length),e.slice(i,a)}for(n=e.length-1;n>=0;--n)if(47===e.charCodeAt(n)){if(!o){i=n+1;break}}else -1===a&&(o=!1,a=n+1);return -1===a?"":e.slice(i,a)},extname:function(e){t(e);for(var r=-1,n=0,i=-1,a=!0,o=0,s=e.length-1;s>=0;--s){var l=e.charCodeAt(s);if(47===l){if(!a){n=s+1;break}continue}-1===i&&(a=!1,i=s+1),46===l?-1===r?r=s:1!==o&&(o=1):-1!==r&&(o=-1)}return -1===r||-1===i||0===o||1===o&&r===i-1&&r===n+1?"":e.slice(r,i)},format:function(e){var t,r;if(null===e||"object"!=typeof e)throw TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return t=e.dir||e.root,r=e.base||(e.name||"")+(e.ext||""),t?t===e.root?t+r:t+"/"+r:r},parse:function(e){t(e);var r,n={root:"",dir:"",base:"",ext:"",name:""};if(0===e.length)return n;var i=e.charCodeAt(0),a=47===i;a?(n.root="/",r=1):r=0;for(var o=-1,s=0,l=-1,c=!0,d=e.length-1,h=0;d>=r;--d){if(47===(i=e.charCodeAt(d))){if(!c){s=d+1;break}continue}-1===l&&(c=!1,l=d+1),46===i?-1===o?o=d:1!==h&&(h=1):-1!==o&&(h=-1)}return -1===o||-1===l||0===h||1===h&&o===l-1&&o===s+1?-1!==l&&(0===s&&a?n.base=n.name=e.slice(1,l):n.base=n.name=e.slice(s,l)):(0===s&&a?(n.name=e.slice(1,o),n.base=e.slice(1,l)):(n.name=e.slice(s,o),n.base=e.slice(s,l)),n.ext=e.slice(o,l)),s>0?n.dir=e.slice(0,s-1):a&&(n.dir="/"),n},sep:"/",delimiter:":",win32:null,posix:null};n.posix=n,e.exports=n}},r={};function n(e){var i=r[e];if(void 0!==i)return i.exports;var a=r[e]={exports:{}},o=!0;try{t[e](a,a.exports,n),o=!1}finally{o&&delete r[e]}return a.exports}n.ab="//";var i=n(114);e.exports=i}()}},function(e){e.O(0,[552,774,888,179],function(){return e(e.s=516)}),_N_E=e.O()}]);