const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === 'development', //allows testing in local, REMOVE THIS IN PROD
  },

}

module.exports = withPWA(nextConfig);
