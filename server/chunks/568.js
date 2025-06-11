"use strict";
exports.id = 568;
exports.ids = [568];
exports.modules = {

/***/ 3568:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AU": () => (/* binding */ getPostData),
/* harmony export */   "Jq": () => (/* binding */ getPosts),
/* harmony export */   "SZ": () => (/* binding */ getSortedPostsMetadata),
/* harmony export */   "d1": () => (/* binding */ getRollupPosts),
/* harmony export */   "eB": () => (/* binding */ generateRssFeed),
/* harmony export */   "zQ": () => (/* binding */ getPostBySlug)
/* harmony export */ });
/* unused harmony export getPostMetadata */
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8076);
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(gray_matter__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4390);
/* harmony import */ var remark_parse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6688);
/* harmony import */ var remark_gfm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6809);
/* harmony import */ var remark_rehype__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2509);
/* harmony import */ var rehype_highlight__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4921);
/* harmony import */ var rehype_stringify__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5390);
/* harmony import */ var rehype_slug__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7752);
/* harmony import */ var feed__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(4582);
/* harmony import */ var feed__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(feed__WEBPACK_IMPORTED_MODULE_10__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unified__WEBPACK_IMPORTED_MODULE_3__, remark_parse__WEBPACK_IMPORTED_MODULE_4__, remark_gfm__WEBPACK_IMPORTED_MODULE_5__, remark_rehype__WEBPACK_IMPORTED_MODULE_6__, rehype_highlight__WEBPACK_IMPORTED_MODULE_7__, rehype_stringify__WEBPACK_IMPORTED_MODULE_8__, rehype_slug__WEBPACK_IMPORTED_MODULE_9__]);
([unified__WEBPACK_IMPORTED_MODULE_3__, remark_parse__WEBPACK_IMPORTED_MODULE_4__, remark_gfm__WEBPACK_IMPORTED_MODULE_5__, remark_rehype__WEBPACK_IMPORTED_MODULE_6__, rehype_highlight__WEBPACK_IMPORTED_MODULE_7__, rehype_stringify__WEBPACK_IMPORTED_MODULE_8__, rehype_slug__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);











const postsDirectory = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), "posts");
const publicDirectory = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), "public");
function getPosts() {
    const fileNames = fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(postsDirectory);
    return fileNames.map((fileName)=>{
        return {
            slug: getSlug(fileName),
            fileName
        };
    });
}
function getPostBySlug(slug) {
    return getPosts().find((post)=>post.slug === slug);
}
function getSortedPostsMetadata() {
    const posts = getPosts().map((post)=>{
        const metadata = getPostMetadata(post);
        return {
            ...post,
            ...metadata
        };
    });
    // Sort posts by date
    return posts.sort((a, b)=>{
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}
function getRollupPosts(count) {
    const posts = getPosts().map((post)=>{
        const metadata = getPostMetadata(post);
        return {
            slug: post.slug,
            ...metadata
        };
    }).filter((post)=>post.rollup == true).sort((a, b)=>{
        // Sort posts by datec
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    }).slice(0, count);
    return posts;
}
function getPostMetadata(post) {
    // Read markdown file as string
    const fullPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(postsDirectory, post.fileName);
    const fileContents = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fullPath, "utf8");
    // Use gray-matter to parse the post metadata section
    const matterResult = gray_matter__WEBPACK_IMPORTED_MODULE_2___default()(fileContents);
    return matterResult.data;
}
async function getPostData(post) {
    const fullPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(postsDirectory, post.fileName);
    const fileContents = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fullPath, "utf8");
    // Use gray-matter to parse the post metadata section
    const matterResult = gray_matter__WEBPACK_IMPORTED_MODULE_2___default()(fileContents);
    // Use remark to convert markdown into HTML string
    const processedContent = await (0,unified__WEBPACK_IMPORTED_MODULE_3__.unified)().use(remark_parse__WEBPACK_IMPORTED_MODULE_4__["default"]).use(remark_gfm__WEBPACK_IMPORTED_MODULE_5__["default"]).use(remark_rehype__WEBPACK_IMPORTED_MODULE_6__["default"], {
        allowDangerousHtml: true
    }).use(rehype_highlight__WEBPACK_IMPORTED_MODULE_7__["default"]).use(rehype_stringify__WEBPACK_IMPORTED_MODULE_8__["default"], {
        allowDangerousHtml: true
    }).use(rehype_slug__WEBPACK_IMPORTED_MODULE_9__["default"]).process(matterResult.content);
    const contentHtml = processedContent.toString();
    // Combine the data with the id and contentHtml
    return {
        contentHtml,
        ...matterResult.data
    };
}
async function generateRssFeed() {
    const posts = getSortedPostsMetadata();
    const siteURL = "https://actuated.com";
    const feed = new feed__WEBPACK_IMPORTED_MODULE_10__.Feed({
        title: "Actuated - blog",
        description: "Keep your team productive &amp; focused with blazing fast CI",
        id: siteURL,
        link: siteURL,
        image: `${siteURL}/images/actuated.png`,
        updated: new Date()
    });
    for (const post of posts){
        const url = `${siteURL}/blog/${post.slug}`;
        const content = (await getPostData(post)).contentHtml;
        feed.addItem({
            title: post.title,
            id: url,
            link: url,
            description: post.description,
            content,
            author: post.author,
            date: new Date(post.date)
        });
    }
    fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(path__WEBPACK_IMPORTED_MODULE_1___default().join(publicDirectory, "rss.xml"), feed.rss2());
}
function getSlug(fileName) {
    return fileName.replace(/\.md$/, "").split("-").slice(3).join("-");
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;