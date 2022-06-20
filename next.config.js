const withSass = require("@zeit/next-sass");
const withImages = require("next-images");
const withCSS = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");

nextConfig = {
  async redirects() {
    return [
      // {
      //   source: '/:lang/panel',
      //   destination: '/:lang/panel/profile',
      //   permanent: true,
      // },
      {
        source: '/',
        destination: '/bhd-en',
        permanent: true
      },
    ]
  },
}


module.exports = withPlugins([
  [withSass],
  [withImages, { inlineImageLimit: 500 }],
  [withCSS]
], nextConfig);

// const SvgLoad = (data) => {
//   console.log(data);
//   withReactSvg({
//     include: path.resolve(__dirname, "assets/icons"),
//     webpack(config, options) {
//       return config;
//     },
//   });
// };

// console.log(SvgLoad);

// module.exports = SvgLoad(
//   withSass(
//     withCSS(
//       withImages({
//         inlineImageLimit: 200,
//         webpack(config, options) {
//           return config;
//         },
//       })
//     )
//   )
// );
