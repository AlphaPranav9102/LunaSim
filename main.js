import { HyperCanvas } from './components/hyperCanvas.js'
import { Stock } from './components/stock.js'
import { Flow } from './components/flow.js'
import { Converter } from './components/converter.js'
import { CreatorWidget } from './components/creatorWidget.js'

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