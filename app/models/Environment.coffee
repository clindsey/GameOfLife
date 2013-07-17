module.exports = gamecore.DualPooled.extend 'EnvironmentModel',
  {
    create: (width, height) ->
      environment = @_super()
      environment.cellLookup = {}
      environment.width = width
      environment.height = height
      environment.length = 0

      environment
  }, {
    dispose: ->
      for id, cell of @cellLookup
        if cell.dispose
          cell.dispose()

      @release()

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
  }
