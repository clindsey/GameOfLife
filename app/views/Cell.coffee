module.exports = gamecore.DualPooled.extend 'CellView',
  {
    create: (model) ->
      cell = @_super()
      cell.el = new createjs.Shape

      cell.model = model

      cell.styles = {
        width: 10
        height: 10
        fill: "##{(Math.random()*0xFFFFFF<<0).toString(16)}"
      }

      cell.drawingInstructions()

      cell.el.x = cell.styles.width * model.x
      cell.el.y = cell.styles.height * model.y

      _.bindAll cell, "onTick"

      cell.el.addEventListener "tick", cell.onTick

      cell
  }, {
    drawingInstructions: ->
      width = @styles.width
      height = @styles.height

      graphics = @el.graphics

      graphics.beginFill @styles.fill
      graphics.drawRect 0, 0, width, height
      graphics.endFill()

    onTick: ->
      fillColor = (100 + ~~((@model.neighborCount / 3) * 155)).toString(16)
      @styles.fill = "##{fillColor}#{fillColor}#{fillColor}"

      @drawingInstructions()

    dispose: ->
      @release()
  }
