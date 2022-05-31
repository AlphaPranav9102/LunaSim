import { HyperCanvas } from './components/hyperCanvas.js'
import { Stock } from './components/stock.js'
import { CreatorWidget } from './components/creatorWidget.js'

var canvas = document.getElementById("modelCanvas")
console.log(canvas)
var hyperCanvas = new HyperCanvas(canvas, 1000)
hyperCanvas.initialize()

var features = {
    stock : Stock,
}

// var stockCreator = new CreatorWidget(features.stock, hyperCanvas)
document.getElementById("stockSelector").onclick = function() {
    let feature = new Stock(Date.now())
    hyperCanvas.addFeature(feature)
}

window.addEventListener('resize', function() {
    hyperCanvas.size = [
        window.innerWidth,
        window.innerHeight
    ]
});