Model = require "models/base/Model"

module.exports = Model.extend 'CellModel',
  {
    create: (x, y) ->
      cell = @_super()
      cell.x = x
      cell.y = y

      cell
  }, {
    canSurviveIn: (environment) ->
      neighborCount = @numberOfNeighborsIn environment
      2 <= neighborCount <= 3

    numberOfNeighborsIn: (environment) ->
      result = 0

      if environment.getCellAt @x, @y + 1
        result++

      if environment.getCellAt @x + 1, @y + 1
        result++

      if environment.getCellAt @x + 1, @y
        result++

      if environment.getCellAt @x + 1, @y - 1
        result++

      if environment.getCellAt @x, @y - 1
        result++

      if environment.getCellAt @x - 1, @y - 1
        result++

      if environment.getCellAt @x - 1, @y
        result++

      if environment.getCellAt @x - 1, @y + 1
        result++

      result
  }
