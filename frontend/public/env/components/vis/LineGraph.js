import { Graph } from "./Graph.js"

class LineGraph {
    constructor(parent_id, title, plotOptions, dataOptions, modal, editable = true) {
        this.uuid = Math.random().toString(36).substr(2, 9)

        this.modal = modal

        this.companionDiv = document.createElement("div")
        this.companionDiv.classList.add("p-4",  "rounded-lg")
        this.companionDiv.style.width = "500px"
        this.companionDiv.id = this.uuid

        document.getElementById(parent_id).appendChild(this.companionDiv)

        this.companionDiv = document.getElementById(this.uuid)
        this.companionDiv.setAttribute("type", "button")
        this.companionDiv.setAttribute("data-modal-toggle", this.uuid)

        this.mainID = this.modal.mainID

        var self = this
        if (editable) {
            console.log("setup")
            document.getElementById(this.uuid).addEventListener("click", function () {
                console.log("clicked")
                self.setupEdit()
                document.getElementById(self.mainID).classList.remove("hidden")
            })
        }


        this.formula = dataOptions.formula

        this.selectedOptionsX = dataOptions.selectedOptionsX
        this.selectedOptionsY = dataOptions.selectedOptionsY
        this.allColumnOptions = dataOptions.allOptions

        this.generateData()

        this.graph = new Graph(
            this.uuid,
            {
                chart: {
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    animations: {
                        enabled: true
                    }
                },
                plotOptions: plotOptions,
                series: this.generatedData,
                xaxis: {
                    type: "numeric",
                },
                title: {
                    text: title,
                    align: 'left'
                }
            }
        )

    }

    generateData() {
        this.generatedData = []
        for (const names of this.selectedOptionsY){
            [this.xAxis, this.yAxis] = this.formula(this.selectedOptionsX, names)
            console.log(this.formula(this.selectedOptionsX, names))
            this.generatedData.push({
                name: names.toString(),
                data: this.xAxis.reduce((acc, current, index) => {
                    return [...acc, {x: current, y: this.yAxis[index]}]
                  }, [])
            })
        }
    }

    setupEdit() {
        var formStringX = ``
        var formStringY = ``

        var self = this
        this.modal.setCallBackClose(function (event) {
            event.preventDefault();
            self.pushEdit()
        })

        for (const i of this.allColumnOptions) {
            if (this.selectedOptionsY.includes(i)) {
                formStringY += `
                <div class="flex items-center">
                    <input checked id="${i}${this.uuid}Y" type="checkbox" value="" style="transform: scale(1.3);" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label id="for="${i}${this.uuid}" class="ml-3 text-md font-medium">${i}</label>
                </div>
                `
            }
            else {
                formStringY += `
                <div class="flex items-center">
                    <input id="${i}${this.uuid}Y" type="checkbox" value="" style="transform: scale(1.3);" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label for="${i}${this.uuid}" class="ml-3 text-md font-medium">${i}</label>
                </div>
                `
            }
            if (this.selectedOptionsX == i) {
                formStringX += `
                <div class="flex items-center">
                    <input checked id="${i}${this.uuid}X" name="options" type="radio" value="" style="transform: scale(1.3);" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label id="for="${i}${this.uuid}" class="ml-3 text-md font-medium">${i}</label>
                </div>
                `
            }
            else {
                formStringX += `
                <div class="flex items-center">
                    <input id="${i}${this.uuid}X" type="radio" name="options" value="" style="transform: scale(1.3);" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label for="${i}${this.uuid}" class="ml-3 text-md font-medium">${i}</label>
                </div>
                `
            }
        }

        this.modal.formHTMLX = formStringX
        this.modal.formHTMLY = formStringY
    }

    pushEdit(modal = true, x = []) {
        if (modal){
            this.selectedOptionsY = []
            for (const i of this.allColumnOptions) {
                if (document.getElementById(i.toString() + this.uuid.toString() + "Y").checked) {
                    this.selectedOptionsY.push(i)
                }
            }
            this.selectedOptionsX = ""
            for (const i of this.allColumnOptions) {
                if (document.getElementById(i.toString() + this.uuid.toString() + "X").checked) {
                    this.selectedOptionsX = i
                    break
                }
            }
        }
        else {
            this.selectedColumnOptions = x
        }

        this.generateData()

        this.graph.state.series = this.generatedData

        this.graph.update()

        this.companionDiv.innerHTML = `<h1 class="w-full text-xl font-semibold h-8">Graph</h1>` + this.companionDiv.innerHTML
    }
}


export { LineGraph }