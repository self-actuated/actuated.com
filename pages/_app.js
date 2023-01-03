import '../styles/globals.css'

// See: https://nextjs.org/docs/advanced-features/measuring-performance#web-vitals
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // console.log(metric) // The metric object ({ id, name, startTime, value, label }) is logged to the console
  }
}

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
