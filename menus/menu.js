import { Component } from "../components/component.js"

export class Menu {

    static writeToDom(dom, message){
        if (dom != ""){
            try {document.getElementById(dom).innerText = message} catch {}
        }
    }

    static validation(variable, type, dom = "", message = "") {
        if (type == "blank"){
            if (variable.trim() == ""){
                Menu.writeToDom(dom, message)
                return false
            }
            else {
                Menu.writeToDom(dom, "")
                return true
            }
        }
        else if (type == "names"){
            console.log(Component.name, variable, Component.name.includes(variable))
            if (Component.name.includes(variable)){
                Menu.writeToDom(dom, message)
                return false
            }
            else {
                Menu.writeToDom(dom, "")
                return true
            }
        }
        return true
    }
}