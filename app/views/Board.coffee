CellView = require "views/Cell"

module.exports = gamecore.DualPooled.extend 'BoardView',
  {
    create: (model) ->
      board = @_super()

      board.model = model
      board.cells = {}
      board.el = new createjs.Container
      _.bindAll board, "onCellAdded", "onCellRemoved"

      jQuery(window).bind "!cellAdded", board.onCellAdded
      jQuery(window).bind "!cellRemoved", board.onCellRemoved

      board
  }, {
    onCellAdded: (jqEvent, model) ->
      cellView = CellView.create model
      @cells["#{model.x}_#{model.y}"] = cellView

      @el.addChild cellView.el

    onCellRemoved: (jqEvent, model) ->
      cellView = @cells["#{model.x}_#{model.y}"]

      if cellView and cellView.el
        @el.removeChild cellView.el

      cellView.dispose()

      @cells["#{model.x}_#{model.y}"] = undefined

    dispose: ->
      jQuery(window).unbind "!cellAdded", @onCellAdded
      jQuery(window).unbind "!cellRemoved", @onCellRemoved

      for key, cell of @cells
        if cell
          cell.dispose()

      @release()
  }
