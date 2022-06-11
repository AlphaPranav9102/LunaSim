class Stock {
    constructor(name, hyperCanvas){
        this.name = name
        this.type = "stock"
        this.canvas = hyperCanvas
        this.state = {
            x : 0,
            y : 0,
            a : 0,
            b : 0,
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
            flows : {
                top : null,
                left : null,
                bottom : null,
                right : null
            }
        }
    }

    validate(event){
        var validated = false

        if (event.type == "mousedown"){
            if (this.state.creation){
                validated = true;
            }
            else if ((this.boundingBox(this.state.x - 10, this.state.y - 10, 20, 20, [event.x, event.y]))&&
                (this.state.selected)){

                this.state.resize = true
                this.state.resizeInteraction.corner = "top"
                validated = true

                //console.log(1, this.state.x, event.x, this.state.y, event.y)

            } 
            else if ((this.boundingBox(this.state.x + this.state.a - 10, this.state.y + this.state.b - 10, 20, 20, [event.x, event.y])&& 
                this.state.selected)){

                this.state.resize = true
                this.state.resizeInteraction.corner = "bottom"
                validated = true

                //console.log(2)
            }
            else if ((this.boundingBox(this.state.x, this.state.y, this.state.a, this.state.b, [event.x, event.y]))){
                if (this.state.selected){
                    this.state.move = true
                    this.cache(event)
                    //console.log(this.state)
                }
                this.state.selected = true
                validated = true

                //console.log(4)
            }
            else {
                this.state.selected = false

                //console.log(5)
            }
        }
        else if (event.type == "mousemove"){
            if (this.state.resize || this.state.move){
                validated = true
            }
        }
        else if (event.type == "click"){
            if (this.state.resize){
                this.state.resize = false
            }
            this.state.move = false
            validated = true
        }
        if (validated){
            return true
        }
    }

    input(event){
        if (this.state.creation){
            this.state.x = event.x
            this.state.y = event.y
            this.state.creation = false
            this.state.resize = true
            this.state.resizeInteraction.corner = "bottom"
        }
        else if (this.state.resize){
            if (this.state.resizeInteraction.corner == "top"){
                this.state.a += (this.state.x - event.x)
                this.state.b += (this.state.y - event.y)
                this.state.x = event.x
                this.state.y = event.y
                
            }
            else if (this.state.resizeInteraction.corner == "bottom"){
                this.state.a = event.x - this.state.x
                this.state.b = event.y - this.state.y
            }
            this.remap(event)
        }
        else if (this.state.move){
            this.state.x += event.x - this.state.prevInteraction.x
            this.state.y += event.y - this.state.prevInteraction.y
            this.remap(event)
        }

        this.cache(event)
        
    }

    cache(event) {
        this.state.prevInteraction.x = event.x
        this.state.prevInteraction.y = event.y
    }

    draw(context){
        if (this.state.creation){
            return false
        }
        context.strokeStyle = "rgb(0, 0, 0)"
        context.fillStyle = "rgb(255, 255, 255)"
        context.beginPath()
        context.lineWidth = 5
        context.rect(this.state.x, this.state.y, this.state.a, this.state.b)
        context.fill()
        context.stroke()

        if (this.state.selected){
            context.beginPath()
            context.strokeStyle = "rgb(0, 0, 125)"
            context.fillStyle = "rgb(0, 0, 125)"
            context.fillRect(this.state.x-10, this.state.y-10, 20, 20)
            context.fillRect(this.state.x+this.state.a-10, this.state.y+this.state.b-10, 20, 20)
            context.stroke()
        }
    }

    boundingBox(x, y, a, b, point){
        if ((x <= point[0] && point[0] <= x+a)&&
            (y <= point[1] && point[1] <= y+b)){
                return true
        }
        else false
    }

    remap(event){
        if (this.state.flows.left != null){
            this.state.flows.left.state.x2 = this.state.x
            this.state.flows.left.state.y2 = this.state.y + this.state.b/2
        }
        if (this.state.flows.right != null){
            this.state.flows.right.state.x1 = this.state.x + this.state.a
            this.state.flows.right.state.y1 = this.state.y + this.state.b/2
        }

    }
}

export { Stock };