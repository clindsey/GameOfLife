StageView = require "views/Stage"

module.exports = class Application
  initialize: ->
    canvasEl = document.getElementById "main-canvas"

    new StageView canvasEl
