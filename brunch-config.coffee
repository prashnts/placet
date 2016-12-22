# Placet

module.exports = config:
  paths:
    watched: ['placet']

  plugins:
    autoReload:
      enabled: yes
    coffeelint:
      pattern: /^placet\/.*\.(coffee)$/
      useCoffeelintJson: yes
    jaded:
      staticPatterns: /^placet\/markup\/([\d\w]*)\.jade$/
    postcss:
      processors: [
        require('autoprefixer')(['last 8 versions'])
      ]
    babel:
      presets: ['es2015', 'react', 'stage-2']
      ignore: [
        /^(node_modules)/
      ]
      pattern: /\.jsx?$/

  conventions:
    ignored: [
      /node_modules\/jade/
      /(templates|partials)\/.+\.jade$/
    ]

  npm:
    enabled: yes
    styles:
      'normalize.css': [
        'normalize.css'
      ]

  modules:
    nameCleaner: (path) ->
      path
        .replace /^placet\//, ''
        .replace /\.coffee/, ''
        .replace /\.jsx?/, ''

  files:
    javascripts:
      joinTo: 'js/app.js'
    stylesheets:
      joinTo: 'css/app.css'

  server:
    command: "node_modules/.bin/http-server -c-1 -p #{process.env.PORT or 8080}"
