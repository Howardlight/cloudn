const withPWA = require("next-pwa");

//TODO: the service worker requests the api with lon/lat = 0,
// Find a way to get location through other means
// FOR NOW SERVICE WORKERS WILL BE DISABLED
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pwa: {
    dest: "public",
    // disable: true, //allows testing in local, REMOVE THIS IN PROD
    disable: process.env.NODE_ENV === 'development', //allows testing in local, REMOVE THIS IN PROD
  },

}

module.exports = withPWA(nextConfig);
