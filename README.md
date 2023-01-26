# Usage

You will need Node.js LTS installed on your machine.

Install npm packages including next.js:

```bash
npm install
```

## Available Scripts

### Work on the site

Work on the site with live-reload:

```bash

npm run dev

echo "http://localhost:3000"
```

Or run in "production mode" with `npm start`

> Note: When accessing the site through an Inlets tunnel during development the baseURL has te be set to the upstream url.
> i.e: `DEV_URL="https://actuated-blog.inlets.example.com" npm run dev`

### Deploy the site:

```bash

npm run build
npm run deploy

```

* `npm run build` - Builds the app for production to the `build` folder using `next build && next export`.
* `npm run deploy` - Deploys to the CDN via `gh-pages -d build`
