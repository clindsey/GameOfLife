module.exports = class Cell
  constructor: (@x, @y) ->

  canSurviveIn: (environment) ->
    neighborCount = @numberOfNeighborsIn environment
    neighborCount is 2 || neighborCount is 3 ? true : false

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
