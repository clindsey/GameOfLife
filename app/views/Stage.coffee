BoardView = require "views/Board"
BoardModel = require "models/Board"
CellModel = require "models/Cell"

module.exports = class StageView
  constructor: (@canvasEl) ->
    @el = new createjs.Stage @canvasEl

    @el.update()

    _.bindAll @, "onTick"

    createjs.Ticker.setFPS 4

    createjs.Ticker.addEventListener "tick", @onTick

    @boardModel = new BoardModel 48, 32
    boardView = new BoardView @boardModel

    @populateBoard()

    @el.addChild boardView.el

  populateBoard: ->
    cells = @boardModel.liveCells
    width = @boardModel.width
    height = @boardModel.height

    for y in [0..height - 1]
      for x in [0..width - 1]
        seed = (Math.random() * 10) > 8

        cells.addCell new CellModel x, y if seed

  onTick: ->
    @boardModel.spawn()

    @el.update()

  dispose: ->
    createjs.Ticker.removeEventListener "tick", @onTick
