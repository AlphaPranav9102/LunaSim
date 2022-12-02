class HyperCanvas {
    constructor(canvas, frameRate) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.periodicTasks = {};
        this.features = {};
        this.globalTick = 0;
        this.pageOffsetY = 50; // adds offset to canvas to account for header
        this.frameRate = frameRate
        this.menu = {}
        this.menuUsage = 0
    }

    // TODO: Get data about hyperCanvas and send to engine.js
    get data() {
        stocks = {}

        for (const key of Object.keys(this.features)){
             
        }
    }

    get size() {
        return [this.canvas.width, this.canvas.height];
    }

    set size(sizing) {
        this.canvas.width = sizing[0]
        this.canvas.height = sizing[1]
    }

    // get every widget reference and return it to the calling function
    getType(type){
        var metadata = {}
        var features = Object.keys(this.features);
        for (const feature of features){
            console.log(feature)
            if (this.features[feature].feature.type == type){
                metadata[feature] = this.features[feature]
            }
        }
        return(metadata)
    }

    // periodic functions for the calling of added functions to periodic runner
    runPeriodic() {
        this.globalTick++;
        var keys = Object.keys(this.periodicTasks);

        for (const priority of [1, 2, 3, 4, 5]){
            for (const key of keys){
                if (this.globalTick % this.periodicTasks[key].tick == 0 && this.periodicTasks[key].priority == priority) {
                    this.periodicTasks[key].callback.apply(null, this.periodicTasks[key].args)
                }
            }
        }
    }

    setPeriodic(name, callback, tick, priority, ...args) {
        this.periodicTasks[name] = {
            callback : callback,
            tick : tick,
            priority: priority,
            args : [].slice.call(arguments, 3) // removes the first three arguments of setPeriodic function
        };
    }

    // calling all validation functions to see if input if for feature
    detectedInput(event, listener) {
        var eventInfo = {
            x : event.pageX,
            y : event.pageY - this.pageOffsetY,
            type : listener
        }

        
        for (const key of Object.keys(this.features)){
            if (this.features[key].feature.creation){
                console.log(this.features[key].feature.type)
                this.features[key].feature.input(eventInfo)
                break
            }
            if (this.features[key].feature.validate(eventInfo)){
                this.features[key].feature.input(eventInfo)
            } 
        }
    }

    //add feature to setPeriodic and detectedInput loop
    addFeature(feature, drawable = true, priority = 3) {
        //todo: determine if redundant keys are useful here (Callback functions, Ans: maybe if method name changes in 2.x)
        //todo: setup id/name system
        this.features[feature.name] = {
            feature : feature,
            verifyCallback : feature.validate,
            inputCallback : feature.input,
            drawCallback : feature.draw,
            createdSignal : feature.created
        }
        
        if (drawable){
            var self = this
            this.setPeriodic(feature.name + ".draw", function () { self.features[feature.name].feature.draw(self.context)}, 1, priority)
        }
        
    }

    // start periodic and add interval tasks
    initialize() {
        var self = this;
        setInterval(function () { self.runPeriodic() }, 1000/this.frameRate)
        this.setPeriodic("canvas.clear", function () {
            self.context.fillStyle = "rgb(255, 255, 255)"
            self.context.fillRect(0, 0, self.canvas.width, self.canvas.height)
            self.context.stroke()
        }, 1, 1)

        this.size = [
            window.innerWidth,
            window.innerHeight
        ]

        this.canvas.addEventListener("mousedown", function (event) {self.detectedInput(event, "mousedown")})
        this.canvas.addEventListener("mousemove", function (event) {self.detectedInput(event, "mousemove")})
        this.canvas.addEventListener("click", function (event) {self.detectedInput(event, "click")})
        this.canvas.addEventListener("keydown", function (event) {
            console.log(self.menuUsage)
            if (event.code == "KeyE" && self.menuUsage == 0){
                self.detectedInput(event, "KeyE")

            }
        })

        this.setPeriodic("menu.used", function () {
            self.menuUsage = 0
            for (const value of Object.values(self.menu)){
                self.menuUsage += value.state.using
            }
        }, 1)

    }

    getMenuText(feature){
        this.menu[feature.type].getInfo(feature)
    }

    save() {

    }

}

export { HyperCanvas };