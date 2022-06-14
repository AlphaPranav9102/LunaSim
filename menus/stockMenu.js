class StockMenu {
    constructor(menu, hyperCanvas) {
        this.hyperCanvas = hyperCanvas
        this.menu = menu
    }

    getInfo(feature){
        this.feature = feature
        this.menu.modalStockOutside.style.display = "block"
        this.menu.stockSubmit.onclick = this.sendInfo
    }

    validation() {
        //todo: check the other names in hypercanvas
        //todo: validate the equation using engine (need to talk about)
    }

    sendInfo(){
        this.feature.state.metadata = {
            "name" : this.menu.stockName.value,
            "equation" : this.menu.stockEquation.value,
            "stockType" : this.menu.stockType.checked.toString()
        }
    }

}