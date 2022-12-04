import { HyperCanvas } from './components/hyperCanvas.js'
import { Stock } from './components/stock.js'
import { Flow } from './components/flow.js'
import { Connector } from './components/connector.js'
import { Converter } from './components/converter.js'
import { StockMenu } from './menus/stockMenu.js'
import { FlowMenu } from './menus/flowMenu.js'
import { ConverterMenu } from './menus/converterMenu.js'
import { LineGraph } from './components/vis/LineGraph.js'
import { Modal } from './components/vis/Modal.js';
import { Simulation } from './engine.js'


var canvas = document.getElementById("modelCanvas")
console.log(canvas)
var hyperCanvas = new HyperCanvas(canvas, 100)
hyperCanvas.initialize()

var features = {
    "stock" : Stock,
    "flow" : Flow,
    "converter" : Converter,
    "connector" : Connector
}

// var stockCreator = new CreatorWidget(features.stock, hyperCanvas)
document.getElementById("stockSelector").onclick = function() {
    let feature = new Stock(Date.now(), hyperCanvas)
    hyperCanvas.addFeature(feature, true)
}

document.getElementById("flowSelector").onclick = function() {
    let feature = new Flow(Date.now(), hyperCanvas)
    hyperCanvas.addFeature(feature, true)
}

document.getElementById("converterSelector").onclick = function() {
    let feature = new Converter(Date.now(), hyperCanvas)
    hyperCanvas.addFeature(feature, true)
}

document.getElementById("connectorSelector").onclick = function() {
    let feature = new Connector(Date.now(), hyperCanvas)
    hyperCanvas.addFeature(feature, true, 1)
}

window.addEventListener('resize', function() {
    hyperCanvas.size = [
        window.innerWidth,
        window.innerHeight
    ]
});

var stockMenu = new StockMenu(
    {
        modalStockOutside : document.getElementById("modalStockOutside"),
        stockName : document.getElementById("stockName"),
        stockEquation : document.getElementById("stockEquation"),
        stockType : document.getElementById("stockType"),
        stockSubmit : document.getElementById("stockSubmit")
    },
    hyperCanvas
)

hyperCanvas.menu["stock"] = stockMenu

var flowMenu = new FlowMenu(
    {
        modalFlowOutside : document.getElementById("modalFlowOutside"),
        flowName : document.getElementById("flowName"),
        flowEquation : document.getElementById("flowEquation"),
        flowType : document.getElementById("flowType"),
        flowSubmit : document.getElementById("flowSubmit")
    },
    hyperCanvas
)

hyperCanvas.menu["flow"] = flowMenu

var converterMenu = new ConverterMenu(
    {
        modalConverterOutside : document.getElementById("modalConverterOutside"),
        converterName : document.getElementById("converterName"),
        converterEquation : document.getElementById("converterEquation"),
        converterType : document.getElementById("converterType"),
        converterSubmit : document.getElementById("converterSubmit")
    },
    hyperCanvas
)

hyperCanvas.menu["converter"] = converterMenu

document.getElementById("runSelector").addEventListener("click", () => {
    console.log(hyperCanvas.getData())
    var sim = new Simulation(hyperCanvas.getData())
    console.log(sim.run())
})

var modal = new Modal("modalGraphOutside", "typeSubmit","editableFormContainer")

document.getElementById("drawerGraph").onclick = function (e) {
    console.log(e.target)
    if (e.target == this){
        document.getElementById("drawerGraph").classList.toggle("hidden")
    }
}

var lines = new LineGraph(
    "graphContainer",
    "",
    {},
    {
      formula: function(team) {return [[1,2,3,4,5,6,7,8,9,10], [1,2,3,4,5,6,7,8,9,10]]},
      selectedOptions: [1],
      allOptions: [1,2,3]
    },
    modal
)

var getEnv = false

var processEnv = function () {
    if (getEnv){
        document.getElementById("envName").value = hyperCanvas.state.file_name
        document.getElementById("envDT").value = hyperCanvas.state.dt
        document.getElementById("envTime").value = hyperCanvas.state.end_time
        if (hyperCanvas.state.integration_method == "euler"){
            document.getElementById("envType1").checked = true
        }
        if (hyperCanvas.state.integration_method == "rk4"){
            document.getElementById("envType2").checked = true
        }
    }
    else {
        hyperCanvas.state.file_name = document.getElementById("envName").value
        hyperCanvas.state.dt = document.getElementById("envDT").value
        hyperCanvas.state.end_time = document.getElementById("envTime").value
        if (document.getElementById("envType1").checked){
            hyperCanvas.state.integration_method = "euler"
        }
        if (document.getElementById("envType2").checked){
            hyperCanvas.state.integration_method = "rk4"
        }
    }
    document.getElementById("modalEnvOutside").classList.toggle("hidden")
}

document.getElementById("envSubmit").onclick = processEnv
document.getElementById("setupSelector").onclick = processEnv
