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
            },
            metadata: {
                name: Date.now()
            },
            deleted: false
        }
    }

    validate(event){
        var validated = false

        if (this.state.deleted){
            return false
        }

        if (event.type == "Backspace"){
            if (this.state.selected == true){
                
                this.state.deleted = true
            }
        }
        else if (event.type == "mousedown"){
            console.log("test mousedown 1")
            if (this.state.creation == true){
                console.log("test mousedown")
                var isClicked = this.onObject(event.x, event.y, ["stock", "flow", "converter"])
                if (isClicked != null){
                    console.log(isClicked)
                    this.state.connection.in = isClicked.state.metadata.name
                    console.log(this.state.connection.in)
                    this.state.creation = false
                    this.state.creating = true
                    validated = true
                }
            }
            else if (this.onProjection(event.x, event.y)){
                this.state.selected = true
            }
            else {
                this.state.selected = false
            }
            
        }
        else if (event.type == "mousemove"){
            if (this.state.creating){
                validated = true
            }
        }
        else if (event.type == "click"){
            if (this.state.creating == true){
                var isClicked = this.onObject(event.x, event.y, ["flow", "converter"])
                console.log(isClicked)
                if (isClicked != null){
                    this.state.connection.out = isClicked.state.metadata.name
                    this.state.creating = false
                    this.state.creation = false
                }
                else {
                    this.state.connection.in = null
                    this.state.connection.out = null
                    this.state.deleted = true
                }
            }
        }
        if (validated){
            return true
        }
    }

    input(event){
        if (this.state.creating){
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
        this.isDeleted()
        if (this.state.deleted){
            return -1
        }
        if (this.state.connection.in == null){
            return false
        }
        context.beginPath()
        context.strokeStyle = "rgb(0, 0, 0)"
        if (this.state.selected){
            context.strokeStyle = "rgb(0, 125, 125)"
        }
        else {
            context.strokeStyle = "rgb(0, 0, 0)"
        }
        context.moveTo(this.hyperCanvas.getFeature(this.state.connection.in).state.center.x, this.hyperCanvas.getFeature(this.state.connection.in).state.center.y)
        try {
            context.lineTo(this.hyperCanvas.getFeature(this.state.connection.out).state.center.x, this.hyperCanvas.getFeature(this.state.connection.out).state.center.y)
        }
        catch (e) {
            context.lineTo(this.state.connection.out.x, this.state.connection.out.y)
        }
        context.stroke()
        context.strokeStyle = "rgb(0, 0, 0)"
    }

    onObject(x, y, type){
        for (var i = 0; i < type.length; i++){
            this.features = this.hyperCanvas.getType(type[i])
            for (const key of Object.keys(this.features)){

                if (this.features[key].feature.validate({type: "mousedown", x: x, y: y}, true)){
                    return(this.features[key].feature)
                }
            }
        }
    }

    isDeleted(){
        try {
            if (this.hyperCanvas.getFeature(this.state.connection.in).state.deleted || this.hyperCanvas.getFeature(this.state.connection.out).state.deleted){
                this.state.deleted = true
            }
        }
        catch {}
    }

    onProjection(x, y){
        if (this.hyperCanvas.getFeature(this.state.connection.in).state.center.x <= this.hyperCanvas.getFeature(this.state.connection.out).state.center.x){
            var yRise = (this.hyperCanvas.getFeature(this.state.connection.out).state.center.y-this.hyperCanvas.getFeature(this.state.connection.in).state.center.y)
            var xRun = (this.hyperCanvas.getFeature(this.state.connection.out).state.center.x-this.hyperCanvas.getFeature(this.state.connection.in).state.center.x)
            var xBase = this.hyperCanvas.getFeature(this.state.connection.in).state.center.x
            var yBase = this.hyperCanvas.getFeature(this.state.connection.in).state.center.y
        }
        else {
            var yRise = (this.hyperCanvas.getFeature(this.state.connection.in).state.center.y-this.hyperCanvas.getFeature(this.state.connection.out).state.center.y)
            var xRun = (this.hyperCanvas.getFeature(this.state.connection.in).state.center.x-this.hyperCanvas.getFeature(this.state.connection.out).state.center.x)
            var xBase = this.hyperCanvas.getFeature(this.state.connection.out).state.center.x
            var yBase = this.hyperCanvas.getFeature(this.state.connection.out).state.center.y
        }
        var slope = yRise/xRun
        
        if (Math.min(this.hyperCanvas.getFeature(this.state.connection.in).state.center.x, this.hyperCanvas.getFeature(this.state.connection.out).state.center.x) <= x && x <= Math.max(this.hyperCanvas.getFeature(this.state.connection.in).state.center.x, this.hyperCanvas.getFeature(this.state.connection.out).state.center.x)){
            //console.log(x - Math.min(this.hyperCanvas.getFeature(this.state.connection.in).state.center.x, this.hyperCanvas.getFeature(this.state.connection.out).state.center.x), slope)
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