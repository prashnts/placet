# Placet
bourbon = require 'node-bourbon'
fse = require 'fs-extra'
global.DEBUG = '-p' not in global.process.argv
global._COPIED = no

copy_map = [
  ['data', 'public/data']
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
      globals: ['DEBUG']
    sass:
      options:
        mode: 'ruby'
        debug: 'debug'
        allowCache: true
        includePaths: [
          './node_modules/@blueprintjs/core/dist/'
          './node_modules/tachyons-sass/'
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
      unless global._COPIED
        for [src, dest] in copy_map
          fse.copySync src, dest
          console.log 'Copied', src, 'to', dest
        global._COPIED = yes
      end()
