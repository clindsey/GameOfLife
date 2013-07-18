EnvironmentModel = require "models/Environment"
CellModel = require "models/Cell"
Model = require "models/base/Model"

module.exports = Model.extend 'BoardModel',
  {
    create: (width, height) ->
      board = @_super()

      board.liveCells = EnvironmentModel.create width, height
      board.width = width
      board.height = height

      board
  }, {
    dispose: ->
      @liveCells.dispose()

      @_super()

    spawn: ->
      nextGeneration = EnvironmentModel.create @width, @height
      @putNextGenerationOfCellsIn nextGeneration

      @liveCells.dispose()

      @liveCells = nextGeneration

    putNextGenerationOfCellsIn: (nextGeneration) ->
      for y in [0..@height - 1]
        for x in [0..@width - 1]
          @processGridPosition x, y, nextGeneration

    processGridPosition: (x, y, nextGeneration) ->
      cell = CellModel.create x, y
      currentCell = @liveCells.getCellAt x, y

      if currentCell
        if cell.canSurviveIn @liveCells
          nextGeneration.addCell cell, true
        else
          EventBus.dispatch "!cellRemoved", @, currentCell
          cell.dispose()
      else if cell.numberOfNeighborsIn(@liveCells) is 3
        nextGeneration.addCell cell
      else
        cell.dispose()
  }
