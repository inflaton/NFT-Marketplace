export default {
  npmClient: 'yarn',
  mfsu: false,
  hash: true,
  define: {
    'process.env.IS_VERCEL': process.env.IS_VERCEL,
    'process.env.MCNFT_BASE_URL': process.env.MCNFT_BASE_URL || 'https://card-nft-api.netlify.app',
  },
  scripts: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-CY76W1E7KD',
      async: true,
    },
  ],
};
