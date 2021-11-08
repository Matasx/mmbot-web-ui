module.exports = {
  publicPath: './',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'MMBot'
    }
  },
  pwa: { // https://cli.vuejs.org/core-plugins/pwa.html#configuration
    name: 'MMBot',
    themeColor: '#202020',
    msTileColor: '#202020',
    manifestOptions: {
      background_color: '#202020'
    }
  }
}
