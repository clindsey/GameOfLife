module.exports = class Cell
  constructor: (@x, @y) ->

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
