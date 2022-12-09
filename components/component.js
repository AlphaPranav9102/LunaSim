export class Component {
    static name = ["timestep"]
    static id = []
    static editBoxSize = 15
    static colorset = {
        "black" : ["rgb(117, 117, 117)", "rgb(217, 217, 217)"],
        "green" : ["rgb(25, 143, 81)", "rgb(161, 232, 185)"],
        "blue" : ["rgb(12, 140, 233)", "rgb(168, 215, 250)"],
        "red" : ["rgb(224, 62, 26)", "rgb(251, 188, 182)"],
        "purple" : ["rgb(138, 56, 245)", "rgb(214, 182, 251)"],
        "orange" : ["rgb(247, 151, 34)", "rgb(255, 196, 112)"]
    }

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