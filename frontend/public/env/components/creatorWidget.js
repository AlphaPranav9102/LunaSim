// Not useful right now cause I don't know enough JS to amke passing constructors work. too much abstraction
// is a big problem in the codebase since i have never made a project with this much oop based work.
// Having a wrapper interfacing classes with polymorphism but at the same time making it generalized
// is hard to do without a plan or good idea on how good sytax looks.

class CreatorWidget {
    constructor(feature, hyperCanvas) {
        this.feature = feature
        this.hyperCanvas = hyperCanvas
    }

    new(){
        console.log("created")
        let feature = new this.feature(Date.now())
        this.hyperCanvas.addFeature(feature)
    }
}

export { CreatorWidget };