class Table {
    constructor(id){
        this.uuid = Math.random().toString(36).substr(2, 9)
        this.companionDiv = document.createElement("div")
        this.companionDiv.classList.add("p-4", "relative", "h-[303px]", "container","overflow-scroll", "rounded-lg")
        this.companionDiv.style.width = "500px"
        this.companionDiv.style.height = "340px"
        this.companionDiv.id = this.uuid

        document.getElementById(id).appendChild(this.companionDiv)
    }
    clearTable(){
        this.companionDiv.innerHTML = `<h1 class="w-full text-xl font-semibold h-8">Table</h1>`
    }

    generateTable(formula, step, labels){
        this.clearTable()
        var data = [[]]
        for (const stock of labels){
            [this.xData, this.yData] = formula(step, stock)
            data[0] = this.xData
            data.push(this.yData)
        }

        var tableHeader = "<th>dt</th>"
        var tableBody = ""
        for (const label of labels){
            tableHeader += `<th class="">${label}</th>`
        }
        for (var i = 0; i < data[0].length; i++){
            tableBody += `<tr class="border-b border-gray-800 w-full">`
            for (const stock of data){
                tableBody += `<td class="px-4">${stock[i]}</td>`
            }
            tableBody += "</tr>"
        }
        this.companionDiv.innerHTML += `<table class="w-full h-[280px] overflow-clip"><thead class="border-b-2 w-full border-black"><tr>${tableHeader}<tr><thead><tbody>${tableBody}</tbody></table>`
        console.log(this.companionDiv)
    }
}

export { Table }