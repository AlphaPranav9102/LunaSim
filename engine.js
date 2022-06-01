class Simulation {
    constructor(structData) {
        this.data = structData;

        this.dt = parseFloat(this.data.dt);
        this.endTime = parseFloat(this.data.endTime);

        this.stockCache = { "time": [] }; // add time also as a "stock" in cache
        this.initStocks(); // set initial values for stocks

        for (var name in this.data.stocks) {
            this.stockCache[name] = [parseFloat(this.data.stocks[name]["value"])]; // add stock to cache
        }
    }

    /* 
    Replaces names in flowEq with values.
    Example: 'converter1*converter2+stock1' --> '1*2+3'
    */
    parseFlow(flowEq) {
        // Looks for converter names in expressions and replaces with their respective values
        let availableConverters = Object.keys(this.data.converters).sort((a, b) => a.length - b.length).reverse() // sort by length (descending) to prevent substring errors
        if (availableConverters != []) {
            for (var converter of availableConverters) {
                console.log(converter)
                if (flowEq.includes(converter)) {
                    flowEq = flowEq.replace(converter, this.parseFlow(this.data.converters[converter])); // RECURSIVE
                }
            }
        }

        // Looks for stock names in expressions and replaces with their respective values
        let availableStocks = Object.keys(this.data.stocks).sort((a, b) => a.length - b.length).reverse()
        if (availableStocks != []) {
            for (var stock of availableStocks) {
                if (flowEq.includes(stock)) {
                    flowEq = flowEq.replace(this.data.stocks[stock]["name"], this.data.stocks[stock]["value"]);
                }
            }
        }

        return eval(flowEq); // TODO: Figure out what to do with this
    }

    /*
    Applies parseFlow initially to the stock values to work out the "static converters"
    */
    initStocks() {
        for (var stockName in this.data.stocks) {
            let stock = this.data.stocks[stockName];
            stock["value"] = this.parseFlow(stock["value"]);
        }
    }

    /* 
    Uses stock name to return sum of inflows and outflows.
    */
    dydt(stock) {
        // Locally define the inflow and outflows in stock
        let inflows = stock["inflows"];
        let outflows = stock["outflows"];

        // Use eval to get value of flows
        let sumInflow = 0;
        for (var i in inflows) {
            let flow = inflows[i];
            if (flow.includes("$")) { // check if flow is a uniflow
                flow = flow.replace('$', '');
                sumInflow += Math.max(0, eval(this.parseFlow(flow)));
            } else {
                sumInflow += eval(this.parseFlow(inflows[i]));
            }
        }

        let sumOutflow = 0;
        for (var i in outflows) {
            let flow = outflows[i];
            if (flow.includes("$")) { // check if flow is a uniflow
                flow = flow.replace('$', '');
                sumOutflow += Math.max(0, eval(this.parseFlow(flow)));
            } else {
                sumOutflow += eval(this.parseFlow(outflows[i]));
            }
        }

        return sumInflow - sumOutflow;
    }

    /*
    Runs model using Euler's method.
    */
    euler() {
        for (var t = 0; t <= this.endTime; t += this.dt) { // iterate over time
            this.stockCache["time"].push(t); // add new time to cache
            for (var stockName in this.data.stocks) { // iterate over stocks
                let stock = this.data.stocks[stockName];

                if (stock["isNN"] == "true") { // check if stock is non-negative
                    stock["value"] = Math.max(0,(parseFloat(stock["value"]) + this.dydt(stock) * this.dt)).toString();
                } else {
                    stock["value"] = (parseFloat(stock["value"]) + this.dydt(stock) * this.dt).toString();
                }

                this.stockCache[stockName].push(parseFloat(stock["value"])) // add new value to cache
            }
        }
    }

    /*
    Runs model using 4th order Runge-Kutta method.
    */
    rk4() {
        for (var t = 0; t <= this.endTime; t += this.dt) { // iterate over time
            this.stockCache["time"].push(t); // add new time to cache
            for (var stockName in this.data.stocks) { // iterate over stocks
                let stock = this.data.stocks[stockName];
                let y_0 = parseFloat(stock["value"]); // current value

                // Calculate constants
                let k1 = this.dydt(stock) * this.dt;
                stock["value"] = (y_0 + k1 / 2).toString(); // add to the stock for the next k's

                let k2 = this.dydt(stock) * this.dt;
                stock["value"] = (y_0 + k2 / 2).toString();

                let k3 = this.dydt(stock) * this.dt;
                stock["value"] = (y_0 + k3).toString();

                let k4 = this.dydt(stock) * this.dt;

                // Update stock value to final result
                if (stock["isNN"] == "true") { // check if stock is non-negative
                    stock["value"] = Math.max(0,(y_0 + (k1 + 2 * k2 + 2 * k3 + k4) / 6)).toString();
                } else {
                    stock["value"] = (y_0 + (k1 + 2 * k2 + 2 * k3 + k4) / 6).toString(); 
                }

                this.stockCache[stockName].push(parseFloat(stock["value"])); // add new value to cache
            }
        }
    }

    /* 
    Runs the model. 
    This is the function called by frontend.
    */
    run() {
        if (this.data["integration_method"] == "euler") {
            this.euler();
        } else if (this.data["integration_method"] == "rk4") {
            this.rk4();
        }

        return this.stockCache;
    }
}