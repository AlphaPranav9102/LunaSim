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
        this.menu.converterEquation.value = this.feature.state.metadata.equation
        this.menu.modalConverterOutside.style.display = "block"
        this.menu.converterSubmit.addEventListener("click", function(){
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
            name : self.menu.converterName.value,
            equation : self.menu.converterEquation.value
        }
        self.menu.modalConverterOutside.style.display = "none"
    }

}

export { ConverterMenu };