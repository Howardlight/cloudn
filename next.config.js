const withPWA = require("next-pwa");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === 'development', //allows testing in local, REMOVE THIS IN PROD
    swSrc: "service-worker.js"
  }
}

module.exports = withPWA(nextConfig);
