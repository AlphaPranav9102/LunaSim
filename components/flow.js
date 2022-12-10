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
            width: 20,
            deleted: false
        }

        this.component = new Component()
        this.setBounds()
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
            else if (this.component.validateBounding("left", event) && this.state.selected){
                if (!hitbox){
                    this.state.resize = true
                    this.state.resizeInteraction.corner = "left"
                }
                isValidated = true
            }
            else if (this.component.validateBounding("right", event) && this.state.selected){
                if (!hitbox){
                    this.state.resize = true
                    this.state.resizeInteraction.corner = "right"
                }
                isValidated = true
            }
            else if (this.component.validateBounding("main", event)){
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
            isValidated = false
            if (this.state.created == true){
                this.state.created = false
                this.hyperCanvas.getMenuText(this)
            }
        }

        return isValidated
    }
    input(event) {
        if (this.state.creation == true){
            this.state.creation = false
            this.state.resize = true
            this.state.x1 = event.x-50
            this.state.y1 = event.y
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
        this.setBounds()
    }

    setBounds(){
        this.component.resetBounding()
        this.component.setBounding("main", {
            type: "rect",
            x: this.state.x1,
            y: this.state.y1-this.state.width/2,
            a: Math.abs(this.state.x1 - this.state.x2 + 15)/2,
            b: this.state.width
        })
        this.component.setBounding("main", {
            type: "rect",
            x: (this.state.x1 + this.state.x2 - 15)/2-this.state.width/2,
            y: Math.min(this.state.y1, this.state.y2)-10,
            a: this.state.width,
            b: Math.max(this.state.y1, this.state.y2) + this.state.width/2
        })
        this.component.setBounding("main", {
            type: "rect",
            x: (this.state.x1 + this.state.x2 - 15)/2 - this.state.width/2,
            y: this.state.y2-this.state.width/2,
            a: Math.abs(this.state.x1 - this.state.x2 + 15)/2 + this.state.width/2,
            b: this.state.width
        })
        this.component.setBounding("left", {
            type: "rect",
            x: this.state.x1 - Component.editBoxSize/2,
            y: this.state.y1 - Component.editBoxSize/2,
            a: Component.editBoxSize,
            b: Component.editBoxSize
        })
        this.component.setBounding("right", {
            type: "rect",
            x: this.state.x2 - Component.editBoxSize/2,
            y: this.state.y2 - Component.editBoxSize/2,
            a: Component.editBoxSize,
            b: Component.editBoxSize
        })
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
            context.strokeStyle = "rgb(70, 70, 70)"
            if (Math.abs(this.state.y2 - this.state.y1) > 15){
                var radiusInner = 10
                var radiusOuter = 15
                var flowWidth = this.state.width/3
                var abs = Math.abs(this.state.y1 - this.state.y2) / (this.state.y1 - this.state.y2)
                var direction = flowWidth * abs

                context.beginPath()
                context.moveTo(this.state.x1, this.state.y1 - direction)

                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth - radiusInner, this.state.y1 - direction)
                context.arc((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth - radiusInner, this.state.y1 - (direction + 1 * abs * radiusInner), radiusInner, (1 + -0.5*abs)*Math.PI, 0, !!(abs+1))

                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth, this.state.y2 - (direction + -1 * abs * radiusOuter))
                context.arc((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth + radiusOuter, this.state.y2 - (direction + -1 * abs * radiusOuter), radiusOuter, 1*Math.PI, (1 + 0.5*abs)*Math.PI, !!(-abs+1))
                //context.stroke();
                //context.beginPath()
                context.lineTo(this.state.x2-arrowWidth, this.state.y2 - direction)
                context.moveTo(this.state.x2-arrowWidth, this.state.y2 + direction)

                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2+flowWidth + radiusInner, this.state.y2 + direction)
                context.arc((this.state.x1 + this.state.x2-arrowWidth)/2+flowWidth + radiusInner,  this.state.y2 + direction + (radiusInner * abs), radiusInner, (1 + 0.5*abs)*Math.PI, 1*Math.PI, !!(abs+1))

                context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2+flowWidth, this.state.y1 + direction + (radiusOuter * -abs))
                context.arc((this.state.x1 + this.state.x2-arrowWidth)/2+flowWidth - radiusOuter, this.state.y1 - direction , radiusOuter, 0, (1 + -0.5*abs)*Math.PI, !!(-abs+1))

                context.lineTo(this.state.x1, this.state.y1 + direction)
                //context.lineTo(this.state.x1, this.state.y1 - direction)
                //context.lineTo((this.state.x1 + this.state.x2-arrowWidth)/2-flowWidth, this.state.y1 - direction)
                context.lineWidth = 5;
                context.stroke();

                arrowY = this.state.y2

            }
            else {
                var flowWidth = this.state.width/3
                var direction = this.state.width/3

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

            context.fillStyle = "#00000000"
            context.lineWidth = 3;
            context.beginPath()
            context.moveTo(this.state.x2-arrowWidth, arrowY - Component.editBoxSize)
            context.lineTo(this.state.x2, arrowY)
            context.lineTo(this.state.x2-arrowWidth, arrowY + Component.editBoxSize)
            context.lineTo(this.state.x2-arrowWidth, arrowY - Component.editBoxSize)
            context.lineTo(this.state.x2, arrowY)
            context.stroke()
            context.beginPath()
            context.font = '500 16px sans-serif';
            context.fillStyle = "rgb(0, 0, 0)"
            context.fillText(this.state.metadata.name, (this.state.x1 + this.state.x2)/2 - this.state.metadata.name.length*5 - 10, Math.max(this.state.y1, this.state.y2)+35)
            
            if (this.state.stock.in != null){
                context.fill()
            }
            context.stroke();

            if (this.state.selected){
                context.beginPath()
                context.strokeStyle = "rgb(70, 70, 70)"
                context.fillStyle = "white"
                context.roundRect(this.state.x1-Component.editBoxSize/2, this.state.y1-Component.editBoxSize/2, Component.editBoxSize, Component.editBoxSize, 2)
                context.fill()
                context.roundRect(this.state.x2-Component.editBoxSize/2, this.state.y2-Component.editBoxSize/2, Component.editBoxSize, Component.editBoxSize, 2)
                context.fill()
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
                console.log(this.state.metadata.name)
                this.state.stock.in = feature.state.metadata.name
                feature.state.flows.left = this.state.metadata.name
                this.state.x2 = feature.state.x
                this.state.y2 = feature.state.y + feature.state.b/2
            }
            else if (feature.state.flows.left == this.state.metadata.name){
                feature.state.flows.left = null
            }
            if (this.boundingBox(feature.state.x + feature.state.a/2, feature.state.y, feature.state.a/2, feature.state.b, [this.state.x1, this.state.y1])){
                this.state.stock.out = feature.state.metadata.name
                feature.state.flows.right = this.state.metadata.name
                this.state.x1 = feature.state.x + feature.state.a
                this.state.y1 = feature.state.y + feature.state.b/2
            }
            else if (feature.state.flows.right == this.state.metadata.name){
                feature.state.flows.right = null
            }
        }
    }
}

export { Flow };