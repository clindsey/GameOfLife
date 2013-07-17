module.exports = gamecore.DualPooled.extend 'CellView',
  {
    create: (model) ->
      cell = @_super()
      cell.el = new createjs.Shape

      cell.model = model

      cell.styles = {
        width: 10
        height: 10
        fill: "#ccc"
        stroke: "#666"
      }

      cell.drawingInstructions()

      cell.el.x = cell.styles.width * model.x
      cell.el.y = cell.styles.height * model.y

      cell
  }, {
    drawingInstructions: ->
      width = @styles.width
      height = @styles.height

      graphics = @el.graphics

      graphics.beginFill @styles.fill
      graphics.setStrokeStyle 0.5
      graphics.beginStroke @styles.stroke
      graphics.drawRect 0, 0, width, height
      graphics.endFill()

    dispose: ->
      @release()
  }
