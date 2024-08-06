const {
  PHASE_DEVELOPMENT_SERVER,
} = require('next/constants')

/** @type {import('next').NextConfig} */
module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER

  const DEV_URL = process.env.DEV_URL || "http://localhost:3000"

  const env = {
    PUBLIC_URL: isDev ? DEV_URL : "https://actuated.com"
  }

  return {
    env,
    reactStrictMode: true,
  }
}
