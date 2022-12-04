import { Component } from "../components/component.js"

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
        this.menu.modalConverterOutside.style.display = "block"

        this.eventMethod = function(){
            self.sendInfo(self)
        }

        this.menu.converterSubmit.addEventListener("click", this.eventMethod)
        this.state.using = true
    }

    validation(self) {
        if (Component.name.includes(self.menu.converterName.value)){
            document.getElementById("converterError").innerText = "Name taken by component"
            return false
        }
        document.getElementById("converterError").innerText = ""
        return true
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
            equation : self.menu.converterEquation.value
        }
    }

}

export { ConverterMenu };