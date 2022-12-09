import { Component } from "../components/component.js"
import { Menu } from "./menu.js"

class ConverterMenu {
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
        this.menu.converterName.value = this.feature.state.metadata.name
        Component.name = Component.name.filter(name => {
            return name != this.feature.state.metadata.name;
          });
        this.menu.converterEquation.value = this.feature.state.metadata.equation
        this.menu.converterColor.value = this.feature.state.metadata.color
        this.menu.modalConverterOutside.style.display = "block"

        this.eventMethod = function(){
            self.sendInfo(self)
        }

        this.menu.converterSubmit.addEventListener("click", this.eventMethod)
        this.state.using = true
    }

    validation(self) {
        return (
            Menu.validation(self.menu.converterName.name, "names", "converterError", "Name taken by component") 
            && Menu.validation(self.menu.converterName.value, "blank", "converterError", "Name is blank")
            && Menu.validation(self.menu.converterEquation.value, "blank", "converterError", "Equation is blank")
        )
    }

    sendInfo(self){
        if (self.validation(self) == false){
            return false
        }
        Component.name.push(self.menu.converterName.value)
        self.state.using = false
        
        self.menu.modalConverterOutside.style.display = "none"
        this.menu.converterSubmit.removeEventListener("click", this.eventMethod)

        for (const feature of Object.values(self.hyperCanvas.getType("connector"))){
            if (feature.feature.state.connection.in == self.feature.state.metadata.name){
                feature.feature.state.connection.in = self.menu.converterName.value
            }
            else if (feature.feature.state.connection.out == self.feature.state.metadata.name){
                feature.feature.state.connection.out = self.menu.converterName.value
            }
        }

        self.feature.state.metadata = {
            name : self.menu.converterName.value,
            equation : self.menu.converterEquation.value,
            stroke : Component.colorset[self.menu.converterColor.value][0],
            fill : Component.colorset[self.menu.converterColor.value][1]
        }
    }

}

export { ConverterMenu };