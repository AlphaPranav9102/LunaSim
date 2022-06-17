import { HyperCanvas } from './components/hyperCanvas.js'
import { Stock } from './components/stock.js'
import { Flow } from './components/flow.js'
import { Converter } from './components/converter.js'
import { CreatorWidget } from './components/creatorWidget.js'
import { StockMenu } from './menus/stockMenu.js'
import { FlowMenu } from './menus/flowMenu.js'
import { ConverterMenu } from './menus/converterMenu.js'

var canvas = document.getElementById("modelCanvas")
console.log(canvas)
var hyperCanvas = new HyperCanvas(canvas, 1000)
hyperCanvas.initialize()

var features = {
    "stock" : Stock,
    "flow" : Flow,
    "converter" : Converter
}

// var stockCreator = new CreatorWidget(features.stock, hyperCanvas)
document.getElementById("stockSelector").onclick = function() {
    let feature = new Stock(Date.now(), hyperCanvas)
    hyperCanvas.addFeature(feature)
}

document.getElementById("flowSelector").onclick = function() {
    let feature = new Flow(Date.now(), hyperCanvas)
    hyperCanvas.addFeature(feature)
}

document.getElementById("converterSelector").onclick = function() {
    let feature = new Converter(Date.now(), hyperCanvas)
    hyperCanvas.addFeature(feature)
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