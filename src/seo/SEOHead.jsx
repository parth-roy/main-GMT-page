import React from "react"
import { Helmet } from "react-helmet-async"

/**
 * SEOHead — Reusable per-page SEO component for GoMyTruck.
 *
 * Usage:
 *   <SEOHead
 *     title="Mini Truck Booking Near Me | GoMyTruck"
 *     description="Book mini truck near you..."
 *     canonical="https://gomytruck.com/truck"
 *     jsonLd={[...]} // optional additional JSON-LD objects
 *     logisticsService={{...}}
 *     offerCatalog={{...}}
 *     faqPage={{...}}
 *   />
 */

const SITE_NAME = "GoMyTruck"
const BASE_URL = "https://gomytruck.com"
const DEFAULT_IMAGE = `${BASE_URL}/og-image.webp`
const DEFAULT_TWITTER = "@gomytruck"

const DEFAULT_GLOBAL_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://gomytruck.com/#organization",
      "name": "GoMyTruck",
      "legalName": "Parther Technologies Private Limited",
      "url": "https://gomytruck.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gomytruck.com/go-my-truck-logo.png",
        "width": 320,
        "height": 214
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+919331488999",
        "contactType": "customer support",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Bengali"]
      },
      "sameAs": [
        "https://www.linkedin.com/company/gomytruck",
        "https://twitter.com/gomytruck"
      ]
    },
    {
      "@type": "TransportationService",
      "@id": "https://gomytruck.com/#transportationservice",
      "name": "GoMyTruck",
      "image": "https://gomytruck.com/og-image.webp",
      "url": "https://gomytruck.com",
      "telephone": "+919331488999",
      "parentOrganization": { "@id": "https://gomytruck.com/#organization" },
      "areaServed": [
        "Barrackpore",
        "Kolkata",
        "Howrah",
        "Salt Lake",
        "New Town",
        "West Bengal"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Chiriyamore",
        "addressLocality": "Barrackpore",
        "addressRegion": "West Bengal",
        "postalCode": "700120",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.7667,
        "longitude": 88.3667
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        "opens": "08:00",
        "closes": "20:00"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://gomytruck.com/#website",
      "url": "https://gomytruck.com",
      "name": "GoMyTruck",
      "publisher": { "@id": "https://gomytruck.com/#organization" },
      "inLanguage": "en-IN"
    }
  ]
};

const toAbsoluteUrl = (value, fallback = BASE_URL) => {
  if (!value) return fallback
  if (/^https?:\/\//i.test(value)) return value
  return `${BASE_URL}${value.startsWith("/") ? value : '/' + value}`
}

const serializeJsonLd = (schema) => JSON.stringify(schema).replace(/</g, "\\u003c")

export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_IMAGE,
  jsonLd = [],
  logisticsService,
  offerCatalog,
  faqPage,
  noIndex = false,
  preloadImage,
  preloadImageSrcSet,
  preloadImageSizes = "100vw",
}) {
  const rawTitle = title || "Online Truck Booking & Goods Transport in Kolkata"
  const fullTitle = rawTitle.toLowerCase().includes(SITE_NAME.toLowerCase())
    ? rawTitle
    : `${rawTitle} | ${SITE_NAME}`
  const fullCanonical = toAbsoluteUrl(canonical)
  const fullOgImage = toAbsoluteUrl(ogImage, DEFAULT_IMAGE)
  const metaDescription = description || "Book trucks and goods transport with GoMyTruck across Kolkata, Barrackpore and West Bengal. Get a route-based estimate online."
  
  // Custom Global Schema for injected props
  const customGlobalSchema = JSON.parse(JSON.stringify(DEFAULT_GLOBAL_SCHEMA))
  const localBusiness = customGlobalSchema["@graph"].find(g => g["@id"].includes("#transportationservice"))
  
  if (offerCatalog && localBusiness) {
    localBusiness.hasOfferCatalog = offerCatalog
  }
  if (logisticsService) {
    customGlobalSchema["@graph"].push(logisticsService)
  }
  if (faqPage) {
    customGlobalSchema["@graph"].push(faqPage)
  }

  const pageSchemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <Helmet>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }
      <link rel="canonical" href={fullCanonical} />
      <link rel="alternate" hrefLang="en-IN" href={fullCanonical} />
      {preloadImage && (
        <link
          rel="preload"
          as="image"
          href={preloadImage}
          imageSrcSet={preloadImageSrcSet}
          imageSizes={preloadImageSizes}
          fetchpriority="high"
        />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="GoMyTruck logistics and goods transport services" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content={DEFAULT_TWITTER} />
      <meta name="theme-color" content="#001f3f" />

      {/* JSON-LD Structured Data (additional, per-page) */}
      {[customGlobalSchema, ...pageSchemas].map((schema, i) => (
        <script key={i} type="application/ld+json">
          {serializeJsonLd(schema)}
        </script>
      ))}
    </Helmet>
  )
}

