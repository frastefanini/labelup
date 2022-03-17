const path = require('path')

const devEnv = process.env.NODE_ENV !== 'production'

module.exports = {
  publicPath: '/app',
  outputDir: './webapp/dist',
  productionSourceMap: false,

  pages: {
    labelup: {
      entry: './webapp/src/main.js',
      template: './webapp/public/index.html',
      filename: 'index.html',
      title: 'Label UP!',
      ac: {
        clientLib: `https://connect-cdn.atl-paas.net/all${devEnv ? '-debug' : ''}.js`
      },
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  },

  configureWebpack: (config) => {
    const vueAtlaskitComponentsPath = path.resolve(
      __dirname,
      'node_modules',
      '@spartez/vue-atlaskit',
      'dist/lib/src/components'
    )

    config.resolve.alias = {
      ...config.resolve.alias,
      '@vue-atlaskit/Tag': path.resolve(vueAtlaskitComponentsPath, 'Select/Tag.vue.js')
    }

    if (devEnv) {
      config.devtool = 'eval-source-map'

      config.output.devtoolModuleFilenameTemplate = (info) => {
        const resPath = path.normalize(info.resourcePath)

        if (resPath.match(/\.vue$/) && info.allLoaders) {
          return `webpack-generated:///${resPath}?${info.hash}`
        } else {
          return `labelup:///${resPath}`
        }
      }

      config.output.devtoolFallbackModuleFilenameTemplate =
        'webpack:///[resource-path]?[hash]'
    }
  }
}
