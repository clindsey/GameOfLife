module.exports = class Environment
  length: 0

  constructor: (@width, @height) ->
    @cellLookup = {}

  addCell: (cell, silent = false) ->
    if @cellLookup["#{cell.x}_#{cell.y}"] is undefined
      @cellLookup["#{cell.x}_#{cell.y}"] = cell

      @length += 1

      unless silent
        jQuery(window).trigger "!cellAdded", [cell]

  getCellAt: (x, y) ->
    @cellLookup["#{@clamp(x, @width)}_#{@clamp(y, @height)}"]

  clamp: (val, limit) ->
    (val + limit) % limit
