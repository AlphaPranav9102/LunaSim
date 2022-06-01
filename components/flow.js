

class Flow {
    constructor(name, hyperCanvas){
        this.name = name
        this.type = "flow"
        this.canvas = hyperCanvas
        this.state = {
            x1 : 100,
            y1 : 100,
            x2 : 300,
            y2 : 40,
            prevInteraction : {
                x : 0,
                y : 0,
            },
            creation : true,
            selected : false,
            resize : false,
            resizeInteraction : {
                corner: ""
            },
            move : false,
            stock : {
                in : null,
                out : null
            }
        }
    }
    validate(event) {
        var isValidated = false
        if (event.type == "mousedown") {
            if (this.state.creation == true){
                isValidated = true
            }

        }
        else if (event.type == "mousemove"){
            if (this.state.resize || this.state.move){
                isValidated = true
            }
        }
        else if (event.type == "click"){
            if (this.state.resize){
                this.state.resize = false
            }
            this.state.move = false
            isValidated = true
        }

        if (isValidated == true){
            return true
        }
        else {
            return false
        }
    }
    input(event) {
        if (this.state.creation == true){
            this.state.creation = false
            this.state.resize = true
            this.state.x1 = event.x
            this.state.y1 = event.y
            this.state.x2 = event.x
            this.state.y2 = event.y
            this.state.resizeInteraction.corner = "right"
        }
        else if (this.state.resize == true) {
            if (this.state.resizeInteraction.corner == "left") {
                this.state.x1 = event.x
                this.state.y1 = event.y
            }

            else if (this.state.resizeInteraction.corner == "right") {
                this.state.x2 = event.x
                this.state.y2 = event.y
            }
        }
    }
    cache(event) {
        this.state.prevInteraction.x = event.x
        this.state.prevInteraction.y = event.y
    }
    draw(context) {
        if (this.state.creation == false){
            if (Math.abs(this.state.y2 - this.state.y1) > 15){
                var flowWidth = 10
                var direction = flowWidth * Math.abs(this.state.y1 - this.state.y2) / (this.state.y1 - this.state.y2)

                context.beginPath()
                context.moveTo(this.state.x1, this.state.y1 - direction)
                context.lineTo((this.state.x1 + this.state.x2)/2-flowWidth, this.state.y1 - direction)
                context.lineTo((this.state.x1 + this.state.x2)/2-flowWidth, this.state.y2 - direction)
                context.lineTo(this.state.x2, this.state.y2 - direction)
                context.lineTo(this.state.x2, this.state.y2 + direction)
                context.lineTo((this.state.x1 + this.state.x2)/2+flowWidth, this.state.y2 + direction)
                context.lineTo((this.state.x1 + this.state.x2)/2+flowWidth, this.state.y1 + direction)
                context.lineTo((this.state.x1 + this.state.x2)/2+flowWidth, this.state.y1 + direction)
                context.lineTo(this.state.x1, this.state.y1 + direction)
                context.lineTo(this.state.x1, this.state.y1 - direction)
                context.lineTo((this.state.x1 + this.state.x2)/2-flowWidth, this.state.y1 - direction)
                context.lineWidth = 5;
                context.stroke();
            }
            else {
                var flowWidth = 10
                var direction = flowWidth * Math.abs(this.state.y1 - this.state.y2) / (this.state.y1 - this.state.y2)

                context.beginPath()
                context.moveTo(this.state.x1, this.state.y1 - direction)
                context.lineTo(this.state.x2, this.state.y1 - direction)
                context.lineTo(this.state.x2, this.state.y1 + direction)
                context.lineTo(this.state.x1, this.state.y1 + direction)
                context.lineTo(this.state.x1, this.state.y1 - direction)
                context.lineTo(this.state.x2, this.state.y1 - direction)
                context.lineWidth = 5;
                context.stroke();
            }
        }
    }
    boundingBox(x, y, a, b, point){
        if ((x <= point[0] && point[0] <= x+a)&&
            (y <= point[1] && point[1] <= y+b)){
                return true
        }
        else false
    }
}

export { Flow };