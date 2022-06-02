

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
            else if (this.boundingBox(this.state.x1 - 10, this.state.y1 - 10, 20, 20, [event.x, event.y]) && this.state.selected){
                this.state.resize = true
                this.state.resizeInteraction.corner = "left"
                isValidated = true
            }
            else if (this.boundingBox(this.state.x2 - 10, this.state.y2 - 10, 20, 20, [event.x, event.y]) && this.state.selected){
                this.state.resize = true
                this.state.resizeInteraction.corner = "right"
                isValidated = true
            }
            else if (this.boundingBox(this.state.x1, this.state.y1-10, Math.abs(this.state.x1 - this.state.x2 + 15)/2, 20, [event.x, event.y])){
                if (this.state.selected){
                    this.state.move = true
                    this.cache(event)
                }
                this.state.selected = true
                isValidated = true
            }
            else if (this.boundingBox((this.state.x1 + this.state.x2 - 15)/2-10, this.state.y1-10, 20, this.state.y2 + 10, [event.x, event.y])){
                if (this.state.selected){
                    this.state.move = true
                    this.cache(event)
                }
                this.state.selected = true
                isValidated = true
            }
            else if (this.boundingBox((this.state.x1 + this.state.x2 - 15)/2-10, this.state.y2-10, Math.abs(this.state.x1 - this.state.x2 + 15)/2+10, 20, [event.x, event.y])){
                if (this.state.selected){
                    this.state.move = true
                    this.cache(event)
                }
                this.state.selected = true
                isValidated = true
            }
            else {
                this.state.selected = false
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
        if (this.state.move == true) {
            var changeX = event.x - this.state.prevInteraction.x
            var changeY = event.y - this.state.prevInteraction.y
            this.state.x1 += changeX
            this.state.x2 += changeX
            this.state.y1 += changeY
            this.state.y2 += changeY
        }

        this.cache(event)
    }
    cache(event) {
        this.state.prevInteraction.x = event.x
        this.state.prevInteraction.y = event.y
    }
    draw(context) {
        if (this.state.creation == false){
            var arrowWidth = 15
            var arrowY = null
            if (Math.abs(this.state.y2 - this.state.y1) > 15){
                var flowWidth = 10
                var direction = flowWidth * Math.abs(this.state.y1 - this.state.y2) / (this.state.y1 - this.state.y2)

                context.beginPath()
                context.moveTo(this.state.x1, this.state.y1 - direction)
                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth, this.state.y1 - direction)
                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth, this.state.y2 - direction)
                context.lineTo(this.state.x2-arrowWidth, this.state.y2 - direction)
                context.moveTo(this.state.x2-arrowWidth, this.state.y2 + direction)
                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2+flowWidth, this.state.y2 + direction)
                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2+flowWidth, this.state.y1 + direction)
                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2+flowWidth, this.state.y1 + direction)
                context.lineTo(this.state.x1, this.state.y1 + direction)
                context.lineTo(this.state.x1, this.state.y1 - direction)
                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth, this.state.y1 - direction)
                context.lineWidth = 5;
                context.stroke();

                arrowY = this.state.y2

            }
            else {
                var flowWidth = 10
                var direction = 10

                context.beginPath()
                context.moveTo(this.state.x1, this.state.y1 - direction)
                context.lineTo(this.state.x2-arrowWidth, this.state.y1 - direction)
                context.lineTo(this.state.x2-arrowWidth, this.state.y1 + direction)
                context.lineTo(this.state.x1, this.state.y1 + direction)
                context.lineTo(this.state.x1, this.state.y1 - direction)
                context.lineTo(this.state.x2-arrowWidth, this.state.y1 - direction)
                context.lineWidth = 5;
                context.stroke();

                arrowY = this.state.y1
            }

            context.moveTo(this.state.x2-arrowWidth, arrowY - 20)
            context.lineTo(this.state.x2, arrowY)
            context.lineTo(this.state.x2-arrowWidth, arrowY + 20)
            context.lineTo(this.state.x2-arrowWidth, arrowY - 20)
            context.lineTo(this.state.x2, arrowY)
            context.lineWidth = 3;
            context.stroke();

            if (this.state.selected){
                context.beginPath()
                context.strokeStyle = "rgb(0, 0, 125)"
                context.fillStyle = "rgb(0, 0, 125)"
                context.fillRect(this.state.x1-10, this.state.y1-10, 20, 20)
                context.fillRect(this.state.x2-10, this.state.y2-10, 20, 20)
                context.stroke()
                context.strokeStyle = "rgb(0, 0, 0)"
            }
        }
    }
    boundingBox(x, y, a, b, point){
        console.log(x, y, a, b, point)
        if (x + a < x){
            x = x + a
            a = Math.abs(a)
        }
        if (y + b < y){
            y = y + b
            b = Math.abs(b)
        }
        if ((x <= point[0] && point[0] <= x+a)&&
            (y <= point[1] && point[1] <= y+b)){
                return true
        }
        else false
    }
}

export { Flow };