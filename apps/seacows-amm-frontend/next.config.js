/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, './styles/theme.scss')],
    prependData: `@import "./styles/theme.scss";`
  },
  env: {
    SeacowsEther: process.env.SeacowsEther,
    eacowsNFTworlds: process.env.eacowsNFTworlds,
    SeacowsOtherdeedNFT: process.env.SeacowsOtherdeedNFT,
    customKey: 'my-value',
    SUPABASE_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYXNkaXhmeW93amJmdWNoanRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU5Mjk5NzgsImV4cCI6MTk4MTUwNTk3OH0.hCp6UqZtvnLrx0ZQ80DZPP8YzoTqxPZpUJyXSZqq41A'
  }
};

module.exports = nextConfig;
