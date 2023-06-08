import { Component } from "../components/component.js"
import { Menu } from "./menu.js"

class FlowMenu {
    constructor(menu, hyperCanvas) {
        this.hyperCanvas = hyperCanvas
        this.menu = menu
        this.state = {
            using : false
        }
    }

    getInfo(feature){
        self = this
        this.feature = feature
        this.menu.flowName.value = this.feature.state.metadata.name
        Component.name = Component.name.filter(name => {
            return name != this.feature.state.metadata.name;
          });
        this.menu.flowEquation.value = this.feature.state.metadata.equation
        this.menu.flowType.checked = this.feature.state.metadata.flowType
        this.menu.modalFlowOutside.style.display = "block"
        this.eventMethod = function(){
            self.sendInfo(self)
        }

        this.menu.flowSubmit.addEventListener("click", this.eventMethod)
        this.state.using = true
    }

    validation() {
        return (
            Menu.validation(self.menu.flowName.name, "names", "flowError", "Name taken by component") 
            && Menu.validation(self.menu.flowName.value, "blank", "flowError", "Name is blank")
            && Menu.validation(self.menu.flowEquation.value, "blank", "flowError", "Equation is blank")
        )
    }

    sendInfo(self){
        if (self.validation(self) == false){
            return false
        }

        Component.name.push(self.menu.flowName.value)
        self.state.using = false
        self.menu.modalFlowOutside.style.display = "none"
        this.menu.flowSubmit.removeEventListener("click", this.eventMethod)

        try{self.hyperCanvas.getFeature(self.feature.state.stock.out).state.flows.right = self.menu.flowName.value} catch {}
        try{self.hyperCanvas.getFeature(self.feature.state.stock.in).state.flows.left = self.menu.flowName.value} catch {}

        for (const feature of Object.values(self.hyperCanvas.getType("connector"))){
            if (feature.feature.state.connection.in == self.feature.state.metadata.name){
                feature.feature.state.connection.in = self.menu.flowName.value
            }
            else if (feature.feature.state.connection.out == self.feature.state.metadata.name){
                feature.feature.state.connection.out = self.menu.flowName.value
            }
        }

        self.feature.state.metadata = {
            name : self.menu.flowName.value,
            equation : self.menu.flowEquation.value,
            flowType : self.menu.flowType.checked
        }

    }

}

export { FlowMenu };