class Modal {
    constructor (mainID, closeID, formIDX, formIDY){
        this.mainID = mainID
        this.closeID = closeID
        this.formIDX = formIDX
        this.formIDY = formIDY
        this.callBackOpen = function () {}
        this.callBackClose = function () {}
        this.formHTMLX = ""
        this.formHTMLY = ""

    }

    setCallBackOpen(method){
        document.getElementById(this.openID).removeEventListener("click", this.callBackOpen)
        this.callBackOpen = method()
        document.getElementById(this.openID).addEventListener("click", this.callBackOpen)
    }

    setCallBackClose(method){
        document.getElementById(this.closeID).removeEventListener("click", this.callBackClose)
        self = this
        this.callBackClose = function () {
            console.log(self.mainID)
            document.getElementById(self.mainID).classList.add("hidden")
            method()
        }
        document.getElementById(this.closeID).addEventListener("click", this.callBackClose)
        console.log("set")
    }

    set formHTMLX(HTMLX){
        document.getElementById(this.formIDX).innerHTML = HTMLX
    }

    set formHTMLY(HTMLY){
        document.getElementById(this.formIDY).innerHTML = HTMLY
    }
}

export { Modal }