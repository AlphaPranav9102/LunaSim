class Modal {
    constructor (mainID, closeID, formID){
        this.mainID = mainID
        this.closeID = closeID
        this.formID = formID
        this.callBackOpen = function () {}
        this.callBackClose = function () {}
        this.formHTML = ""

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

    set formHTML(HTML){
        document.getElementById(this.formID).innerHTML = HTML
    }
}

export { Modal }