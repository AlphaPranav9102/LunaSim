import { Component } from "./component.js"

class Flow {
    constructor(name, hyperCanvas){
        this.name = name
        this.type = "flow"
        this.hyperCanvas = hyperCanvas
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
            created : true,
            selected : false,
            resize : false,
            resizeInteraction : {
                corner: ""
            },
            move : false,
            stock : {
                in : null,
                out : null
            },
            metadata : {
                name : "",
                equation : "",
                flowType : false
            },
            center : {
                x: null,
                y: null
            },
            deleted: false
        }
    }

    validate(event, hitbox=false){
        this.state.center.x = (this.state.x1 + this.state.x2)/2
        this.state.center.y = (this.state.y1 + this.state.y2)/2

        var isValidated = false

        if (this.state.deleted == true){
            return false
        }
        else if (event.type == "KeyE"){
            if (this.state.selected == true){
                this.hyperCanvas.getMenuText(this)
            } 
        }
        else if (event.type == "Backspace"){
            if (this.state.selected == true){
                this.state.deleted = true
                Component.name = Component.name.filter(name => {
                    return name != this.state.metadata.name;
                  });
                try{this.hyperCanvas.getFeature(this.state.stock.in).state.flows.left = null} catch{}
                try{this.hyperCanvas.getFeature(this.state.stock.out).state.flows.right = null} catch{}
            }
        }
        else if (event.type == "mousedown") {
            console.log(this.state)
            if (this.state.creation == true){
                isValidated = true
            }
            else if (this.boundingBox(this.state.x1 - 10, this.state.y1 - 10, 20, 20, [event.x, event.y]) && this.state.selected){
                if (!hitbox){
                    this.state.resize = true
                    this.state.resizeInteraction.corner = "left"
                }
                isValidated = true
            }
            else if (this.boundingBox(this.state.x2 - 10, this.state.y2 - 10, 20, 20, [event.x, event.y]) && this.state.selected){
                if (!hitbox){
                    this.state.resize = true
                    this.state.resizeInteraction.corner = "right"
                }
                isValidated = true
            }
            else if (this.boundingBox(this.state.x1, this.state.y1-10, Math.abs(this.state.x1 - this.state.x2 + 15)/2, 20, [event.x, event.y])){
                if (!hitbox){
                    if (this.state.selected){
                        this.state.move = true
                        this.cache(event)
                    }
                    this.state.selected = true
                }
                isValidated = true
            }
            else if (this.boundingBox((this.state.x1 + this.state.x2 - 15)/2-10, Math.min(this.state.y1, this.state.y2)-10, 20, Math.max(this.state.y1, this.state.y2) + 10, [event.x, event.y])){
                if (!hitbox){
                    if (this.state.selected){
                        this.state.move = true
                        this.cache(event)
                    }
                    this.state.selected = true
                }
                isValidated = true
            }
            else if (this.boundingBox((this.state.x1 + this.state.x2 - 15)/2-10, this.state.y2-10, Math.abs(this.state.x1 - this.state.x2 + 15)/2+10, 20, [event.x, event.y])){
                if (!hitbox){
                    if (this.state.selected){
                        this.state.move = true
                        this.cache(event)
                    }
                    this.state.selected = true
                }
                isValidated = true
            }
            else {
                if (!hitbox){
                    this.state.selected = false
                }
            }

        }
        else if (event.type == "mousemove"){
            if (this.state.resize || this.state.move){
                isValidated = true
            }
        }
        else if (event.type == "click"){
            if (this.state.resize || this.state.move){
                this.state.resize = false
                this.state.move = false
                this.remap(event)
            }
            isValidated = true
            if (this.state.created == true){
                this.state.created = false
                this.hyperCanvas.getMenuText(this)
            }
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
            this.state.x1 = event.x-50
            this.state.y1 = event.y-50
            this.state.x2 = event.x
            this.state.y2 = event.y
            this.state.resizeInteraction.corner = "right"
            this.state.created = true
        }
        else if (this.state.resize == true) {
            if (this.state.resizeInteraction.corner == "left") {
                if (Math.abs(event.x - this.state.x2) > 100  && event.x < this.state.x2){
                    this.state.x1 = event.x
                }
                this.state.y1 = event.y
            }

            else if (this.state.resizeInteraction.corner == "right") {
                this.state.x2 = Math.max(event.x, this.state.x1+100)
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
        if (this.state.deleted){
            return -1
        }
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
                //context.lineTo(this.state.x1, this.state.y1 - direction)
                //context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth, this.state.y1 - direction)
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
                //context.lineTo(this.state.x1, this.state.y1 - direction)
                //context.lineTo(this.state.x2-arrowWidth, this.state.y1 - direction)
                context.lineWidth = 5;
                context.stroke();

                arrowY = this.state.y1
            }

            context.fillStyle = "rgb(0, 125, 0)"
            context.lineWidth = 3;
            context.beginPath()
            context.moveTo(this.state.x2-arrowWidth, arrowY - 20)
            context.lineTo(this.state.x2, arrowY)
            context.lineTo(this.state.x2-arrowWidth, arrowY + 20)
            context.lineTo(this.state.x2-arrowWidth, arrowY - 20)
            context.lineTo(this.state.x2, arrowY)
            context.font = '18px verdana';
            context.fillStyle = "rgb(0, 0, 125)"
            context.fillText(this.state.metadata.name, (this.state.x1 + this.state.x2)/2 - this.state.metadata.name.length*5 - 10, Math.max(this.state.y1, this.state.y2)+35)
            
            if (this.state.stock.in != null){
                context.fill()
            }
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
    }
    remap(event){
        var metadata = this.hyperCanvas.getType("stock")
        for (const features of Object.keys(metadata)){
            var feature = metadata[features].feature
            if (this.boundingBox(feature.state.x, feature.state.y, feature.state.a/2, feature.state.b, [this.state.x2, this.state.y2])){
                console.log(feature.state.metadata.name)
                this.state.stock.in = feature.state.metadata.name
                feature.state.flows.left = this.state.metadata.name
                console.log(feature.state.flows.left)
                this.state.x2 = feature.state.x
                this.state.y2 = feature.state.y + feature.state.b/2
            }
            else if (feature.state.flows.left == this){
                feature.state.flows.left = null
            }
            if (this.boundingBox(feature.state.x + feature.state.a/2, feature.state.y, feature.state.a/2, feature.state.b, [this.state.x1, this.state.y1])){
                this.state.stock.out = feature.state.metadata.name
                feature.state.flows.right = this.state.metadata.name
                this.state.x1 = feature.state.x + feature.state.a
                this.state.y1 = feature.state.y + feature.state.b/2
            }
            else if (feature.state.flows.right == this){
                feature.state.flows.right = null
            }
        }
    }
}

export { Flow };