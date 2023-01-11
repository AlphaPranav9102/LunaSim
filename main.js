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
import { Component } from './components/component.js'


var canvas = document.getElementById("modelCanvas")
console.log(canvas)
var hyperCanvas = new HyperCanvas(canvas, 1000)
hyperCanvas.initialize()
var sim = new Simulation(hyperCanvas.getData())
var results

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
    hyperCanvas.addFeature(feature, true, 2)
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
        stockSubmit : document.getElementById("stockSubmit"),
        stockColor : document.getElementById("stockColor")
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
        converterSubmit : document.getElementById("converterSubmit"),
        converterColor : document.getElementById("converterColor")
    },
    hyperCanvas
)

hyperCanvas.menu["converter"] = converterMenu

document.getElementById("runSelector").addEventListener("click", () => {
    console.log(hyperCanvas.getData())
    sim.setData(hyperCanvas.getData())
    sim.run()

    while (document.getElementById("graphContainer").firstChild) {
        document.getElementById("graphContainer").removeChild(document.getElementById("graphContainer").firstChild);
    }

    var lines = new LineGraph(
        "graphContainer",
        "Graph",
        {},
        {
            formula: function(xName, yName) {
                return [sim.getValues(xName), sim.getValues(yName)]
            },
            selectedOptionsX: "timesteps",
            selectedOptionsY: sim.getAllNames(true),
            allOptions: sim.getAllNames()
        },
        modal
    )
})

var modal = new Modal("modalGraphOutside", "typeSubmit","editableFormXContainer", "editableFormYContainer")

document.getElementById("drawerGraph").onclick = function (e) {
    console.log(e.target)
    if (e.target == this){
        document.getElementById("drawerGraph").classList.toggle("hidden")
    }
}



var getEnv = false

var processEnv = function () {
    if (getEnv){
        document.getElementById("envName").value = hyperCanvas.state.env_name
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
        console.log(document.getElementById("envName").value)
        hyperCanvas.state.env_name = document.getElementById("envName").value
        document.getElementById("setupSelector").innerText = document.getElementById("envName").value
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

document.getElementById("envSubmit").addEventListener("click", processEnv)
document.getElementById("setupSelector").onclick = processEnv


document.getElementById("fileDownload").onclick = function () {
    var dataStr = ""
    sim.setData(hyperCanvas.getData())
    try {
        results = sim.run()
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results))
    } catch {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hyperCanvas.getData()))
    }
    var dlAnchorElem = document.getElementById('downloadAnchorElem')
    dlAnchorElem.setAttribute("href",     dataStr     )
    dlAnchorElem.setAttribute("download", `${hyperCanvas.state.env_name}.luna`)
    dlAnchorElem.click();
}

document.getElementById("fileUpload").onclick = function (){
    uploadMech.click()
}

uploadMech.addEventListener("change", uploadProcess)

function uploadProcess(event){
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* Do nothing */ }
}

function onReaderLoad(event) {
    var data = JSON.parse(event.target.result);
    console.log(data.state)
    var featuresAdd = []


    for (const feature of Object.values(hyperCanvas.features)){
        feature.feature.state.deleted = true
    }

    for (const stock of data.state.stock){
        featuresAdd.push(new Stock(Date.now(), hyperCanvas))
        featuresAdd[featuresAdd.length-1].state = stock
        featuresAdd[featuresAdd.length-1].setBounds()
        hyperCanvas.addFeature(featuresAdd[featuresAdd.length-1], true, 3, true)
        console.log(stock)
        Component.name.push(stock.metadata.name)
        sleepFor(10)
    }
    for (const flow of data.state.flow){
        featuresAdd.push(new Flow(Date.now(), hyperCanvas))
        featuresAdd[featuresAdd.length-1].state = flow
        featuresAdd[featuresAdd.length-1].setBounds()
        hyperCanvas.addFeature(featuresAdd[featuresAdd.length-1], true, 3, true)
        console.log(flow)
        Component.name.push(flow.metadata.name)
        sleepFor(10)
    }
    for (const converter of data.state.converter){
        featuresAdd.push(new Converter(Date.now(), hyperCanvas))
        featuresAdd[featuresAdd.length-1].state = converter
        hyperCanvas.addFeature(featuresAdd[featuresAdd.length-1], true, 3, true)
        console.log(converter)
        Component.name.push(converter.metadata.name)
        sleepFor(10)
    }
    for (const connector of data.state.connector){
        featuresAdd.push(new Connector(Date.now(), hyperCanvas))
        featuresAdd[featuresAdd.length-1].state = connector
        hyperCanvas.addFeature(featuresAdd[featuresAdd.length-1], true, 2, true)
        console.log(connector)
        sleepFor(10)
    }

    hyperCanvas.context.xOffset = 0
    hyperCanvas.context.yOffset = 0

    document.getElementById("envName").value = data.env_name
    document.getElementById("envDT").value = data.dt
    document.getElementById("envTime").value = data.end_time
    if (data.integration_method == "euler"){
        document.getElementById("envType1").checked = true
    }
    if (data.integration_method == "rk4"){
        document.getElementById("envType2").checked = true
    }

    Component.name = data.names
}
