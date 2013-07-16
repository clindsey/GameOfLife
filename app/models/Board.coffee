EnvironmentModel = require "models/Environment"
CellModel = require "models/Cell"

module.exports = class Board
  liveCells: undefined

  constructor: (@width, @height) ->
    @liveCells = new EnvironmentModel @width, @height

  spawn: ->
    nextGeneration = new EnvironmentModel @width, @height
    @putNextGenerationOfCellsIn nextGeneration

    @liveCells = nextGeneration

  putNextGenerationOfCellsIn: (nextGeneration) ->
    for y in [0..@height - 1]
      for x in [0..@width - 1]
        @processGridPosition x, y, nextGeneration

  processGridPosition: (x, y, nextGeneration) ->
    cell = new CellModel x, y
    currentCell = @liveCells.getCellAt x, y

    if currentCell
      if cell.canSurviveIn @liveCells
        nextGeneration.addCell cell, true
      else
        jQuery(window).trigger "!cellRemoved", [currentCell]
    else if cell.numberOfNeighborsIn(@liveCells) is 3
      nextGeneration.addCell cell
