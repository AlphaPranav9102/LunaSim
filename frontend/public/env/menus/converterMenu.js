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
        this.menu.converterType.checked = this.feature.state.ghosted
        console.log(this.feature.state)
        if (this.feature.state.inputGenerated){
            this.menu.converterType.disabled = true
            this.menu.converterEquation.disabled = false
            this.menu.converterColor.disabled = false
        }
        else {
            this.menu.converterType.disabled = false
            this.menu.converterEquation.disabled = false
            this.menu.converterColor.disabled = false
        }
        this.menu.modalConverterOutside.style.display = "block"

        this.eventMethod = function(){
            self.sendInfo(self)
        }

        this.menu.converterSubmit.addEventListener("click", this.eventMethod)
        this.state.using = true
    }

    validation(self) {
        console.log(self.menu.converterType.checked == true)
        if (self.menu.converterType.checked == true && self.menu.converterType.disabled == false){
            return (Menu.validation(self.menu.converterName.value, "ghost", "converterError", "Ghost not possible", this.hyperCanvas))
        }

        return (
            Menu.validation(self.menu.converterName.value, "names", "converterError", "Name taken by component") 
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
        console.log(self.feature.state)

        if (!self.menu.converterType.checked){
            for (const feature of Object.values(self.hyperCanvas.getType("connector"))){
                if (feature.feature.state.connection.in == self.feature.state.metadata.name){
                    feature.feature.state.connection.in = self.menu.converterName.value
                }
                else if (feature.feature.state.connection.out == self.feature.state.metadata.name){
                    feature.feature.state.connection.out = self.menu.converterName.value
                }
            }
        }

        if (self.feature.state.inputGenerated == false && self.menu.converterType.checked){
            self.feature.state.inputGenerated = true
            self.feature.state.metadata.ghosted = self.menu.converterType.checked
            self.feature.state.metadata.ghostID = self.menu.converterName.value
            self.feature.state.metadata.name = self.feature.state.id
        }
        else {
            self.feature.state.inputGenerated = true
            if (self.menu.converterName.value != self.feature.state.metadata.name){
                self.feature.state.metadata.prevName = self.feature.state.metadata.name
            }
            self.feature.state.metadata.name = self.menu.converterName.value,
            self.feature.state.metadata.equation = self.menu.converterEquation.value,
            self.feature.state.metadata.color = self.menu.converterColor.value,
            self.feature.state.metadata.stroke = Component.colorset[self.menu.converterColor.value][0],
            self.feature.state.metadata.fill = Component.colorset[self.menu.converterColor.value][1]
            
            self.feature.changeGhostNames()
        }
    }

}

export { ConverterMenu };