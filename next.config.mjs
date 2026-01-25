import nextra from 'nextra'

// Set up Nextra with its configuration
const withNextra = nextra({
  // Serve MDX content under /docs instead of /
  contentDirBasePath: '/docs',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    // Required for static export
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      // Path to your `mdx-components` file with extension
      'next-mdx-import-source-file': './mdx-components.js',
    },
  },
}

export default withNextra(nextConfig)

