"use strict";
(() => {
var exports = {};
exports.id = 492;
exports.ids = [492];
exports.modules = {

/***/ 1915:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ date_Date)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: external "date-fns"
const external_date_fns_namespaceObject = require("date-fns");
;// CONCATENATED MODULE: ./components/date.js


function date_Date({ dateString , ...props }) {
    const date = (0,external_date_fns_namespaceObject.parseISO)(dateString);
    return /*#__PURE__*/ jsx_runtime_.jsx("time", {
        dateTime: dateString,
        ...props,
        children: (0,external_date_fns_namespaceObject.format)(date, "LLLL d, yyyy")
    });
}


/***/ }),

/***/ 4238:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Post),
/* harmony export */   "getStaticPaths": () => (/* binding */ getStaticPaths),
/* harmony export */   "getStaticProps": () => (/* binding */ getStaticProps)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_posts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3568);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_date__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1915);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_posts__WEBPACK_IMPORTED_MODULE_1__]);
_lib_posts__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




const siteURL = "https://actuated.com";
function Post({ post  }) {
    let imageURL = post.image ? new URL(post.image, siteURL).toString() : "";
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                        children: post.title
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "description",
                        content: post.description
                    }, "description"),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "twitter:title",
                        content: post.title
                    }, "tw_title"),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "twitter:description",
                        content: post.description
                    }, "tw_description"),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:title",
                        content: post.title
                    }, "og_title"),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        property: "og:description",
                        content: post.description
                    }, "og_description"),
                    post.image && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                                name: "twitter:image:src",
                                content: imageURL
                            }, "tw_image"),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                                property: "og:image",
                                content: imageURL
                            }, "og_image")
                        ]
                    }),
                    post.canonical && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                        rel: "canonical",
                        href: post.canonical
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "container mx-auto max-w-4xl bg-white mt-4 px-4 sm:px-6",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                    id: "post_title",
                    className: "text-3xl mb-3 leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 text-center",
                    children: post.title
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "border-b border-gray-200 py-4 flex items-center text-gray-500 mx-auto",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                    className: "h-10 w-10 rounded-full",
                                    src: `/images/${post.author_img}.jpg`,
                                    alt: ""
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "ml-3",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                        id: "post_author",
                                        className: "text-sm leading-5 font-medium text-gray-900",
                                        children: post.author
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "flex text-sm leading-5 text-gray-500",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_date__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {
                                                id: "post_date",
                                                dateString: post.date
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                className: "mx-1"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "mt-6 prose sm:prose-lg max-w-none",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            id: "post_description",
                            className: "mb-4",
                            children: post.description
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        id: "post_content",
                        className: "mt-6 prose sm:prose-lg max-w-none",
                        dangerouslySetInnerHTML: {
                            __html: post.contentHtml
                        }
                    })
                ]
            })
        ]
    });
}
async function getStaticPaths() {
    const paths = (0,_lib_posts__WEBPACK_IMPORTED_MODULE_1__/* .getPosts */ .Jq)().map((post)=>{
        return {
            params: {
                slug: post.slug
            }
        };
    });
    return {
        paths,
        fallback: false
    };
}
async function getStaticProps({ params  }) {
    const post = (0,_lib_posts__WEBPACK_IMPORTED_MODULE_1__/* .getPostBySlug */ .zQ)(params.slug);
    const postData = await (0,_lib_posts__WEBPACK_IMPORTED_MODULE_1__/* .getPostData */ .AU)(post);
    return {
        props: {
            post: {
                ...post,
                ...postData
            }
        }
    };
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4582:
/***/ ((module) => {

module.exports = require("feed");

/***/ }),

/***/ 8076:
/***/ ((module) => {

module.exports = require("gray-matter");

/***/ }),

/***/ 968:
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 4921:
/***/ ((module) => {

module.exports = import("rehype-highlight");;

/***/ }),

/***/ 7752:
/***/ ((module) => {

module.exports = import("rehype-slug");;

/***/ }),

/***/ 5390:
/***/ ((module) => {

module.exports = import("rehype-stringify");;

/***/ }),

/***/ 6809:
/***/ ((module) => {

module.exports = import("remark-gfm");;

/***/ }),

/***/ 6688:
/***/ ((module) => {

module.exports = import("remark-parse");;

/***/ }),

/***/ 2509:
/***/ ((module) => {

module.exports = import("remark-rehype");;

/***/ }),

/***/ 4390:
/***/ ((module) => {

module.exports = import("unified");;

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [568], () => (__webpack_exec__(4238)));
module.exports = __webpack_exports__;

})();