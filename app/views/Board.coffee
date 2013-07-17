CellView = require "views/Cell"

module.exports = class BoardView
  cells: {}

  constructor: (@model) ->
    @el = new createjs.Container

    _.bindAll @, "onCellAdded", "onCellRemoved"

    jQuery(window).bind "!cellAdded", @onCellAdded
    jQuery(window).bind "!cellRemoved", @onCellRemoved

  onCellAdded: (jqEvent, model) ->
    cellView = new CellView model
    @cells["#{model.x}_#{model.y}"] = cellView

    @el.addChild cellView.el

  onCellRemoved: (jqEvent, model) ->
    cellView = @cells["#{model.x}_#{model.y}"]

    @el.removeChild cellView.el

    @cells["#{model.x}_#{model.y}"] = undefined

  dispose: ->
    jQuery(window).unbind "!cellAdded", @onCellAdded
    jQuery(window).unbind "!cellRemoved", @onCellRemoved
