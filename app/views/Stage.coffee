BoardView = require "views/Board"
BoardModel = require "models/Board"
CellModel = require "models/Cell"

module.exports = class StageView
  constructor: (@canvasEl) ->
    @el = new createjs.Stage @canvasEl

    @el.update()

    _.bindAll @, "onTick"

    createjs.Ticker.setFPS 20
    createjs.Ticker.useRAF = true

    createjs.Ticker.addEventListener "tick", @onTick

    @boardModel = BoardModel.create 48, 32
    boardView = BoardView.create @boardModel

    @populateBoard()

    background = new createjs.Shape()
    background.graphics.beginFill("#b5d1f6").drawRect 0, 0, 480, 320
    @el.addChild background

    @el.addChild boardView.el

  populateBoard: ->
    cells = @boardModel.liveCells
    width = @boardModel.width
    height = @boardModel.height

    for y in [0..height - 1]
      for x in [0..width - 1]
        seed = (Math.random() * 10) > 8

        cells.addCell CellModel.create x, y if seed

  onTick: ->
    @boardModel.spawn()

    @el.update()

  dispose: ->
    createjs.Ticker.removeEventListener "tick", @onTick
