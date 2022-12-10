export class Background {
    constructor(name, hyperCanvas){
        this.name = name
        this.type = "background"
        this.hyperCanvas = hyperCanvas
        this.state = {
            x : 0,
            y : 0,
            prevInteraction : {
                x : null,
                y : null,
            },
            selected : false
        }
    }

    validate(event){
        var validated = false

        if (event.type == "mousedown"){
            this.state.selected = true
            validated = true
            this.cache(event)
        }
        else if (event.type == "mousemove"){
            if (this.state.selected == true) {
                validated = true
            }
        }
        else if (event.type == "click"){
            this.state.selected = false
            validated = false
            console.log(this.state)
        }

        return validated
    }

    cache(event) {
        this.state.prevInteraction = {
            x: event.rawX,
            y: event.rawY
        }
    }

    input(event) {
        //console.log(this.state)
        if (this.state.selected) {
            this.state.x += event.rawX - this.state.prevInteraction.x
            this.state.y += event.rawY - this.state.prevInteraction.y
            this.remap(event)
            this.cache(event)
            console.log()
            //console.log(this.state.x, this.state.y)
        }
    }

    draw(context) {
        context.fillStyle = "rgb(125, 125, 125)"
        console.log(context.xOffset, context.yOffset)
        //console.log(15*Math.ceil(-this.hyperCanvas.context.xOffset/15), 15*Math.ceil(-this.hyperCanvas.context.xOffset/15) + this.hyperCanvas.canvas.width)

        for (var x =  15*Math.ceil(-context.xOffset/15); x < 15*Math.ceil(-context.xOffset/15) + this.hyperCanvas.canvas.width; x += 15){
            for (var y =  15*Math.ceil(-context.yOffset/15); y < 15*Math.ceil(-context.yOffset/15) + this.hyperCanvas.canvas.height; y += 15){
                context.strokeStyle = "rgb(200, 200, 200)"
                context.beginPath()
                context.arc(x, y, 0.5, 0, 2 * Math.PI, false)
                context.stroke()
            }
        }
    }

    remap(event){
        //console.log(this.state)
        this.hyperCanvas.context.xOffset = this.state.x
        this.hyperCanvas.context.yOffset = this.state.y
    }
}