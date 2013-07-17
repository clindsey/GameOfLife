CellView = require "views/Cell"

module.exports = gamecore.DualPooled.extend 'BoardView',
  {
    create: (model) ->
      board = @_super()

      board.model = model
      board.cells = {}
      board.el = new createjs.Container
      _.bindAll board, "onCellAdded", "onCellRemoved"

      EventBus.addEventListener "!cellAdded", board.onCellAdded, board
      EventBus.addEventListener "!cellRemoved", board.onCellRemoved, board

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
      EventBus.removeEventListener "!cellAdded", @onCellAdded, @
      EventBus.removeEventListener "!cellRemoved", @onCellRemoved, @

      for key, cell of @cells
        if cell
          cell.dispose()

      @release()
  }
