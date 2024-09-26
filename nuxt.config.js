// eslint-disable-next-line nuxt/no-cjs-in-config
import bodyParser from 'body-parser';

// eslint-disable-next-line nuxt/no-cjs-in-config
const webpack = require('webpack');

export default {
  head: {
    title: process.env.IS_DEV && process.env.IS_DEV === 'true' ? 'sp_dev_net' : '헤레디움',
    htmlAttrs: {
      lang: 'ko'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        integrity: 'sha384-eKjgHJ9+vwU/FCSUG3nV1RKFolUXLsc6nLQ2R1tD0t4YFPCvRmkcF8saIfOZNWf/',
        src: 'https://t1.kakaocdn.net/kakao_js_sdk/2.0.1/kakao.min.js',
        defer: true,
        crossOrigin: 'anonymous'
      },
      {
        src: `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_API_KEY}`
      },
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-GZHCBRCHVV'
      },
      {
        type: 'text/javascript',
        innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "G-GZHCBRCHVV");`
      }
    ],
    __dangerouslyDisableSanitizers: ['script', 'innerHTML']
  },
  /**
   * stage port: 8006
   * dev port: 8000
   */
  server: {
    port: process.env.PORT,
    host: '0.0.0.0'
  },
  serverMiddleware: [
    bodyParser.json({ limit: '50mb', extended: true }),
    bodyParser.urlencoded({ limit: '50mb', extended: true })
  ],
  env: {
    API_URL: process.env.API_URL,
    KAKAO_API_KEY: process.env.KAKAO_API_KEY,
    TOSSPAYMENTS_CLIENT_KEY: process.env.TOSSPAYMENTS_CLIENT_KEY,
    TOSSPAYMENTS_ANDROID_CLIENT_KEY: process.env.TOSSPAYMENTS_ANDROID_CLIENT_KEY,
    TOSSPAYMENTS_IOS_CLIENT_KEY: process.env.TOSSPAYMENTS_IOS_CLIENT_KEY,
    EN_EXHIBITION_ID: process.env.EN_EXHIBITION_ID
  },
  css: ['~/assets/style/style.scss'],
  plugins: [
    { src: '~/plugins/axios.js', ssr: true },
    { src: '~/plugins/persisted-state.js', ssr: true },
    { src: '~/plugins/v-calendar.js', ssr: false },
    { src: '~/plugins/summernote.client.js', ssr: false },
    { src: '~/plugins/scroll_spy.client.js', ssr: false },
    { src: '~/plugins/chart.client.js', ssr: false },
    { src: '~/plugins/month_picker.js', ssr: false },
    { src: '~/plugins/vue-awesome-swiper.js', ssr: false }
  ],
  router: {
    middleware: ['auth']
  },
  components: true,
  modules: ['@nuxtjs/dayjs', '@nuxtjs/axios', '@nuxtjs/proxy', 'cookie-universal-nuxt'],
  axios: { baseURL: '/' },
  proxy: {
    '/api': {
      target: process.env.API_URL,
      pathRewrite: {
        '^/api': '/'
      }
    },
    '/heredium': {
      target: 'https://kr.object.ncloudstorage.com',
      changeOrigin: true,
      pathRewrite: {
        '^/heredium': '/'
      }
    }
  },
  dayjs: {
    locales: ['ko'],
    defaultLocale: 'ko',
    plugins: ['isBetween', 'customParseFormat', 'isoWeek', 'isSameOrAfter', 'isSameOrBefore']
  },
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/stylelint-module', '@nuxt/postcss8'],
  build: {
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    },
    babel: {
      compact: true
    },
    transpile: ['ufo'],
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        _: 'lodash'
      })
    ]
  }
};
