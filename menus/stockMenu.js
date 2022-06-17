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
        this.menu.stockEquation.value = this.feature.state.metadata.equation
        this.menu.stockType.checked = this.feature.state.metadata.stockType
        this.menu.modalStockOutside.style.display = "block"
        this.menu.stockSubmit.addEventListener("click", function(){
            self.sendInfo(self)
        })
        this.state.using = true
    }

    validation() {
        //todo: check the other names in hypercanvas
        //todo: validate the equation using engine (need to talk about)
    }

    sendInfo(self){
        self.state.using = false
        self.feature.state.metadata = {
            name : self.menu.stockName.value,
            equation : self.menu.stockEquation.value,
            stockType : self.menu.stockType.checked
        }
        self.menu.modalStockOutside.style.display = "none"
    }

}

export { StockMenu };