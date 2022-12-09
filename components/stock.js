import { Component } from "./component.js"

class Stock{
    constructor(name, hyperCanvas){
        this.name = name
        this.type = "stock"
        this.hyperCanvas = hyperCanvas
        this.state = {
            x : 0,
            y : 0,
            a : 50,
            b : 30,
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
            flows : {
                top : null,
                left : null,
                bottom : null,
                right : null
            },
            metadata : {
                name : "",
                equation : "",
                stockType : false,
                color: "black",
                stroke: "rgb(117, 117, 117)",
                fill: "rgb(217, 217, 217)"
            },
            center : {
                x: null,
                y: null
            },
            deleted: false
        }

        this.component = new Component()
        this.setBounds()
    }

    validate(event, hitbox=false){
        this.state.center.x = this.state.x + this.state.a/2
        this.state.center.y = this.state.y + this.state.b/2

        var validated = false
        
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
                try{this.hyperCanvas.getFeature(this.state.flows.left).state.stock.in = null} catch{}
                try{this.hyperCanvas.getFeature(this.state.flows.right).state.stock.out = null} catch{}
            }
        }
        else if (event.type == "mousedown"){
            if (this.state.creation){
                validated = true;
            }
            if (this.component.validateBounding("left", event) && this.state.selected){
                if (!hitbox){
                    this.state.resize = true
                    this.state.resizeInteraction.corner = "top"
                }
                validated = true
            } 
            else if (this.component.validateBounding("right", event) && this.state.selected){
                if (!hitbox){
                    this.state.resize = true
                    this.state.resizeInteraction.corner = "bottom"
                }
                validated = true
            }
            else if (this.component.validateBounding("main", event)){
                if (!hitbox){
                    this.state.move = true
                    this.cache(event)
                    this.state.selected = true
                }
                validated = true
            }
            else {
                this.state.selected = false
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
            if (this.state.created){
                this.state.created = false
                this.hyperCanvas.getMenuText(this)
            }
        }
        if (validated){
            return true
        }
    }

    input(event){
        var change = true
        if (this.state.creation){
            this.state.x = event.x
            this.state.y = event.y
            this.state.creation = false
            this.state.resize = true
            this.state.resizeInteraction.corner = "bottom"
            this.state.created = true
        }

        else if (this.state.resize){
            if (this.state.resizeInteraction.corner == "top"){
                if (this.state.a + (this.state.x - event.x) > 50){
                    this.state.a += (this.state.x - event.x)
                    this.state.x = event.x
                }
                if (this.state.b + (this.state.y - event.y) > 30){
                    this.state.b += (this.state.y - event.y)
                    this.state.y = event.y
                }
                
            }
            else if (this.state.resizeInteraction.corner == "bottom"){
                this.state.a = Math.max(event.x - this.state.x, 50)
                this.state.b = Math.max(event.y - this.state.y, 30)
            }
            this.remap(event)
        }
        else if (this.state.move){
            if (this.state.flows.right != null && this.hyperCanvas.getFeature(this.state.flows.right).state.x2 - (this.state.x + this.state.a + event.x - this.state.prevInteraction.x) < 100){
                change = false
            }
            if(this.state.flows.left != null && (this.state.x + event.x - this.state.prevInteraction.x) - this.hyperCanvas.getFeature(this.state.flows.left).state.x1 < 100) {
                change = false
            }
            if (change){
                this.state.x += event.x - this.state.prevInteraction.x
                this.state.y += event.y - this.state.prevInteraction.y
                this.remap(event)
            }
        }

        if (change){
            this.cache(event)
        }
        this.setBounds()
    }

    cache(event) {
        this.state.prevInteraction.x = event.x
        this.state.prevInteraction.y = event.y
    }

    setBounds() {
        this.component.resetBounding()
        this.component.setBounding("main", {
            type: "rect",
            x: this.state.x,
            y: this.state.y,
            a: this.state.a,
            b: this.state.b
        })
        this.component.setBounding("left", {
            type: "rect",
            x: this.state.x - Component.editBoxSize/2,
            y: this.state.y - Component.editBoxSize/2,
            a: Component.editBoxSize,
            b: Component.editBoxSize
        })
        this.component.setBounding("right", {
            type: "rect",
            x: this.state.x + this.state.a - Component.editBoxSize/2,
            y: this.state.y + this.state.b - Component.editBoxSize/2,
            a: Component.editBoxSize,
            b: Component.editBoxSize
        })
    }

    draw(context){
        if (this.state.creation || this.state.deleted){
            return -1
        }
        for (var i = 0; i < 10; i++){
            context.strokeStyle = this.state.metadata.stroke
            context.fillStyle = this.state.metadata.fill
            context.beginPath()
            context.lineWidth = 2.5
            if (this.state.selected) {context.lineWidth = 3}
            context.roundRect(this.state.x, this.state.y, this.state.a, this.state.b, 7)
            context.fill()
            context.stroke()

            if (this.state.selected){
                context.beginPath()
                context.strokeStyle = this.state.metadata.stroke
                context.fillStyle = "white"
                context.roundRect(this.state.x-Component.editBoxSize/2, this.state.y-Component.editBoxSize/2, Component.editBoxSize, Component.editBoxSize, 2)
                context.fill()
                context.roundRect(this.state.x+this.state.a-Component.editBoxSize/2, this.state.y+this.state.b-Component.editBoxSize/2, Component.editBoxSize, Component.editBoxSize, 2)
                context.fill()
                context.stroke()
            }
            context.fillStyle = "rgb(0, 0, 0)"
            context.strokeStyle = "rgb(0, 0, 0)"
        }

        context.beginPath()
        context.fillStyle = "rgb(0, 0, 0)"
        context.font = '500 16px sans-serif';
        context.fillText(this.state.metadata.name, (this.state.x+this.state.a/2) - this.state.metadata.name.length*5, this.state.y+this.state.b+35);
        context.stroke()
    }

    remap(event){
        if (this.state.flows.left != null){
            if (this.hyperCanvas.getFeature(this.state.flows.left).state.stock.out == null){
                this.hyperCanvas.getFeature(this.state.flows.left).state.x1 = (this.state.x - 
                    (this.hyperCanvas.getFeature(this.state.flows.left).state.x2 
                    - this.hyperCanvas.getFeature(this.state.flows.left).state.x1))
            }
            this.hyperCanvas.getFeature(this.state.flows.left).state.x2 = this.state.x
            this.hyperCanvas.getFeature(this.state.flows.left).state.y2 = this.state.y + this.state.b/2
            
        }
        if (this.state.flows.right != null){
            if (this.hyperCanvas.getFeature(this.state.flows.right).state.stock.in == null){
                this.hyperCanvas.getFeature(this.state.flows.right).state.x2 = (this.state.x + this.state.a + 
                    (this.hyperCanvas.getFeature(this.state.flows.right).state.x2 
                    - this.hyperCanvas.getFeature(this.state.flows.right).state.x1))
            }
            this.hyperCanvas.getFeature(this.state.flows.right).state.x1 = this.state.x + this.state.a
            this.hyperCanvas.getFeature(this.state.flows.right).state.y1 = this.state.y + this.state.b/2
        }

    }
}

export { Stock };