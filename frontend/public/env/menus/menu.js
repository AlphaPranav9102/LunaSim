import { Component } from "../components/component.js"

export class Menu {

    static writeToDom(dom, message){
        if (dom != ""){
            try {document.getElementById(dom).innerText = message} catch {}
        }
    }

    static validation(variable, type, dom = "", message = "", hypercanvas = "") {
        if (type == "blank"){
            if (variable.trim() == ""){
                Menu.writeToDom(dom, message)
                return false
            }
            else if (variable.includes(" ")){
                Menu.writeToDom(dom, "No Spaces")
                return false
            }
            else {
                Menu.writeToDom(dom, "")
                return true
            }
        }
        else if (type == "names"){
            console.log(Component.name, variable)
            if (Component.name.includes(variable)){
                Menu.writeToDom(dom, message)
                return false
            }
            else {
                Menu.writeToDom(dom, "")
                return true
            }
        }
        else if (type == "ghost"){
            if (Component.name.includes(variable)){
                if (hypercanvas.getFeature(variable) != null && hypercanvas.getFeature(variable).type == "converter"){
                    Menu.writeToDom(dom, "")
                    return true
                }
            }
            Menu.writeToDom(dom, message)
            return false
        }
        return true
    }
}