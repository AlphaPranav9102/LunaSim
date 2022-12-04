import { Component } from "../components/component.js"

class StockMenu {
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
        this.menu.stockName.value = this.feature.state.metadata.name
        Component.name = Component.name.filter(name => {
            return name != this.feature.state.metadata.name;
          });
        this.menu.stockEquation.value = this.feature.state.metadata.equation
        this.menu.stockType.checked = this.feature.state.metadata.stockType
        this.menu.modalStockOutside.style.display = "block"
        this.eventMethod = function(){
            self.sendInfo(self)
        }

        this.menu.stockSubmit.addEventListener("click", this.eventMethod)
        this.state.using = true
    }

    validation() {
        if (Component.name.includes(self.menu.stockName.value)){
            document.getElementById("stockError").innerText = "Name taken by component"
            return false
        }
        if (self.menu.stockName.value == ""){
            document.getElementById("stockError").innerText = "Name can't be blank"
            return false
        }
        document.getElementById("stockError").innerText = ""
        return true
    }

    sendInfo(self){
        if (self.validation(self) == false){
            return false
        }
        Component.name.push(self.menu.stockName.value)
        self.state.using = false
        
        self.menu.modalStockOutside.style.display = "none"
        this.menu.stockSubmit.removeEventListener("click", this.eventMethod)

        try{self.hyperCanvas.getFeature(self.feature.state.flows.left).state.stock.out = self.menu.stockName.value} catch {}
        try{self.hyperCanvas.getFeature(self.feature.state.flows.right).state.stock.in = self.menu.stockName.value} catch {}

        for (const feature of Object.values(self.hyperCanvas.getType("connector"))){
            if (feature.feature.state.connection.in == self.feature.state.metadata.name){
                feature.feature.state.connection.in = self.menu.stockName.value
            }
            else if (feature.feature.state.connection.out == self.feature.state.metadata.name){
                feature.feature.state.connection.out = self.menu.stockName.value
            }
        }

        self.feature.state.metadata = {
            name : self.menu.stockName.value,
            equation : self.menu.stockEquation.value,
            stockType : self.menu.stockType.checked
        }
    }

}

export { StockMenu };