/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  trailingSlash: true,
//   output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH
};

module.exports = nextConfig
