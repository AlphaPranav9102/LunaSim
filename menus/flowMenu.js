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
        this.menu.flowEquation.value = this.feature.state.metadata.equation
        this.menu.flowType.checked = this.feature.state.metadata.flowType
        this.menu.modalFlowOutside.style.display = "block"
        this.menu.flowSubmit.addEventListener("click", function(){
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
            name : self.menu.flowName.value,
            equation : self.menu.flowEquation.value,
            flowType : self.menu.flowType.checked
        }
        self.menu.modalFlowOutside.style.display = "none"
    }

}

export { FlowMenu };