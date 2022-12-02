class Connector {
    constructor(name, hyperCanvas){
        this.name = name
        this.type = "connector"
        this.hyperCanvas = hyperCanvas
        this.state = {
            x1 : 0,
            y1 : 0,
            x2 : 0,
            y2 : 0,
            prevInteraction : {
                x : null,
                y : null,
            },
            creation : true,
            creating : false,
            selected : false,
            connection : {
                in: null,
                out: null
            }
        }
    }

    validate(event){
        var validated = false
        if (event.type == "mousedown"){
            if (this.state.creation == true){
                var isClicked = this.onObject(event.x, event.y, ["stock", "flow", "converter"])
                if (isClicked != null){
                    console.log(isClicked)
                    this.state.connection.in = isClicked
                    console.log(this.state.connection.in)
                    this.state.creating = true
                    validated = true
                }
            }
            else if (this.onProjection(event.x, event.y)){
                this.selected = true
            }
            else {
                this.selected = false
            }
            
        }
        else if (event.type == "mousemove"){
            if (this.state.creating){
                validated = true
            }
        }
        else if (event.type == "click"){
            if (this.state.creation == true){
                var isClicked = this.onObject(event.x, event.y, ["flow", "converter"])
                console.log(isClicked)
                if (isClicked != null){
                    this.state.connection.out = isClicked
                    this.state.creating = false
                    this.state.creation = false
                }
                else {
                    this.state.connection.in = null
                    this.state.connection.out = null
                }
            }
        }
        if (validated){
            return true
        }
    }

    input(event){
        if (this.state.creation){
            this.state.connection.out = {
                x: event.x,
                y: event.y
            }
        }

        this.cache(event)
        
    }

    cache(event) {
        this.state.prevInteraction.x = event.x
        this.state.prevInteraction.y = event.y
    }

    draw(context){
        if (this.state.connection.in == null){
            return false
        }
        context.fillStyle = "rgb(255, 255, 255)"
        context.beginPath()
        if (this.selected){
            context.strokeStyle = "rgb(0, 0, 125)"
        }
        else {
            context.strokeStyle = "rgb(0, 0, 0)"
        }
        context.moveTo(this.state.connection.in.state.center.x, this.state.connection.in.state.center.y)
        try {
            context.lineTo(this.state.connection.out.state.center.x, this.state.connection.out.state.center.y)
        }
        catch (e) {
            console.log(this.state.connection.out.center, this.state.connection.out.x)
            context.lineTo(this.state.connection.out.x, this.state.connection.out.y)
        }
        context.stroke()
        context.strokeStyle = "rgb(0, 0, 0)"
    }

    onObject(x, y, type){
        for (var i = 0; i < type.length; i++){
            this.features = this.hyperCanvas.getType(type[i])
            for (const key of Object.keys(this.features)){
                /*
                if (type[i] == "stock"){
                    if ((features[key].feature.state.x <= x && x <= features[key].feature.state.x + features[key].feature.state.a)
                        && (features[key].feature.state.y <= y && y <= features[key].feature.state.y + features[key].feature.state.b)){
                        return(features[key])
                    }
                }
                if (type[i] == "flow"){
                    if ((features[key].feature.state.x <= x && x <= features[key].feature.state.x + features[key].feature.state.a)
                        && (features[key].feature.state.y <= y && y <= features[key].feature.state.y + features[key].feature.state.b)){
                        return(features[key])
                    }
                }
                if (type[i] == "converter"){
                    if ((features[key].feature.state.x <= x && x <= features[key].feature.state.x + features[key].feature.state.a)
                        && (features[key].feature.state.y <= y && y <= features[key].feature.state.y + features[key].feature.state.b)){
                        return(features[key])
                    }
                }
                */

                if (this.features[key].feature.validate({type: "mousedown", x: x, y: y}, true)){
                    console.log("selected")
                    return(this.features[key].feature)
                }
            }
        }
    }

    onProjection(x, y){
        if (this.state.connection.in.state.center.x <= this.state.connection.out.state.center.x){
            var yRise = (this.state.connection.out.state.center.y-this.state.connection.in.state.center.y)
            var xRun = (this.state.connection.out.state.center.x-this.state.connection.in.state.center.x)
            var xBase = this.state.connection.in.state.center.x
            var yBase = this.state.connection.in.state.center.y
        }
        else {
            var yRise = (this.state.connection.in.state.center.y-this.state.connection.out.state.center.y)
            var xRun = (this.state.connection.in.state.center.x-this.state.connection.out.state.center.x)
            var xBase = this.state.connection.out.state.center.x
            var yBase = this.state.connection.out.state.center.y
        }
        var slope = yRise/xRun
        
        if (Math.min(this.state.connection.in.state.center.x, this.state.connection.out.state.center.x) <= x && x <= Math.max(this.state.connection.in.state.center.x, this.state.connection.out.state.center.x)){
            //console.log(x - Math.min(this.state.connection.in.state.center.x, this.state.connection.out.state.center.x), slope)
            var yPoint = (x - xBase)*slope + yBase
            //console.log(yPoint, y)
            if (Math.abs(yPoint - y) < 10){
                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    }
}

export { Connector };