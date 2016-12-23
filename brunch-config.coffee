# Placet
bourbon = require 'node-bourbon'
fse = require 'fs-extra'

copy_map = [
  ['node_modules/@blueprintjs/core/resources', 'public/resources']
]

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
    sass:
      options:
        mode: 'native'
        includePaths: [
          'node_modules/@blueprintjs/core/src'
          bourbon.includePaths...
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
      '@blueprintjs/core': [
        'dist/blueprint.css'
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

  hooks:
    preCompile: (end) ->
      for [src, dest] in copy_map
        fse.copySync src, dest
      end()
