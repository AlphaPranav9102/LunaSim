export class Component {
    static name = ["timestep"]
    static id = []
    static editBoxSize = 15

    constructor(){
        this.bounding = {}
    }

    setBounding(id, setup){
        if (this.bounding[id] == undefined){
            this.bounding[id] = [setup]
        }
        else {
            this.bounding[id].push(setup)
        }
    }

    validateBounding(id, event){
        for (const boundingSetup of this.bounding[id]){
            if (boundingSetup.type == "rect"){
                if (this.inRect(boundingSetup.x, boundingSetup.y, boundingSetup.a, boundingSetup.b, event)){
                    return true
                }
            }
            else if (boundingSetup.type = "ellipse"){
                if (this.inEllipse(boundingSetup.x, boundingSetup.y, boundingSetup.a, boundingSetup.b, event)){
                    return true
                }
            }
        }

        return false
    }

    inEllipse(x, y, a, b, event){
        return (event.x-x)^2/a^2 + (event.y-y)^2/b^2 <= 1
    }

    inRect(x, y, a, b, event){
        return (x <= event.x 
            && event.x <= x+a 
            && y <= event.y 
            && event.y <= y+b
        )
    }


    resetBounding(){
        this.bounding = []
    }
}