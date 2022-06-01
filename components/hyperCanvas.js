class HyperCanvas {
    constructor(canvas, frameRate) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.periodicTasks = {};
        this.features = {};
        this.globalTick = 0;
        this.pageOffsetY = 50;
        this.frameRate = frameRate
    }

    //Idea is to just return the data info for engine.js
    get data(){
        return this.generateData();
    }

    // Changing sizing for the 
    get size(){
        return [this.canvas.width, this.canvas.height];
    }

    set size(sizing){
        this.canvas.width = sizing[0]
        this.canvas.height = sizing[1]
    }

    // get every stock reference and return it to the calling function
    getType(type){
        metadata = {}
        var features = Object.keys(this.features);
        for (const feature in features){
            if (this.features[feature].type == type){
                metadata[feature] = this.features[feature]
            }
        }
        return(type)
    }

    // periodic functions for the calling of added functions to periodic runner
    runPeriodic(){
        this.globalTick++;
        var keys = Object.keys(this.periodicTasks);

        for (const key of keys){
            if (this.globalTick % this.periodicTasks[key].tick == 0) {
                this.periodicTasks[key].callback.apply(null, this.periodicTasks[key].args)
            }
        }
        
    }

    setPeriodic(name, callback, tick, ...args){
        this.periodicTasks[name] = {
            callback : callback,
            tick : tick,
            args : [].slice.call(arguments, 3) //removes the first three arguments of setPeriodic function
        };
    }

    //calling all validation functions to see if input if for feature
    detectedInput(event, listener){
        var eventInfo = {
            x : event.pageX,
            y : event.pageY - this.pageOffsetY,
            type : listener
        }

        for (const key of Object.keys(this.features)){
            if (this.features[key].feature.validate(eventInfo) == true){
                this.features[key].feature.input(eventInfo)
            } 
        }
    }

    //add feature to setPeriodic and detectedInput loop
    addFeature(feature, drawable = true){
        //todo: determine if redundant keys are useful here (Callback functions, Ans: maybe if method name changes in 2.x)
        this.features[feature.name] = {
            feature : feature,
            verifyCallback : feature.validate,
            inputCallback : feature.input,
            drawCallback : feature.draw
        }
        
        if (drawable){
            var self = this
            this.setPeriodic(feature.name + ".draw", function () { self.features[feature.name].feature.draw(self.context)}, 1)
        }
        
    }

    // start periodic and add interval tasks
    initialize(){
        var self = this;
        setInterval(function () { self.runPeriodic() }, 1000/this.frameRate)
        this.setPeriodic("canvas.clear", function () {
            self.context.fillStyle = "rgb(255, 255, 255)"
            self.context.fillRect(0, 0, self.canvas.width, self.canvas.height)
            self.context.stroke()
        }, 1)

        this.size = [
            window.innerWidth,
            window.innerHeight
        ]

        this.canvas.addEventListener("mousedown", function (event) {self.detectedInput(event, "mousedown")})
        this.canvas.addEventListener("mousemove", function (event) {self.detectedInput(event, "mousemove")})
        this.canvas.addEventListener("click", function (event) {self.detectedInput(event, "click")})

    }

    save(){

    }

}

export { HyperCanvas };