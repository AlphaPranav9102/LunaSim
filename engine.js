class Simulation {
    constructor(structData) {
        this.data = structData;

        this.dt = parseFloat(this.data.dt);
        this.startTime = parseFloat(this.data.start_time);
        this.endTime = parseFloat(this.data.end_time);

        this.initStocks(); // set initial values for stocks
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
                if (flowEq.includes(converter)) {
                    flowEq = flowEq.replace(converter, this.parseFlow(this.data.converters[converter]["equation"])); // RECURSIVE
                }
            }
        }

        // Looks for flow names in expressions and replaces with their respective values
        for (var stock in this.data.stocks) {;
            for (var inflow in this.data.stocks[stock]["inflows"]) {
                if (flowEq.includes(inflow)) {
                    flowEq = flowEq.replace(inflow, this.parseFlow(this.data.stocks[stock]["inflows"][inflow]["equation"])); // RECURSIVE
                }
            }
            for (var outflow in this.data.stocks[stock]["outflows"]) {
                if (flowEq.includes(outflow)) {
                    flowEq = flowEq.replace(outflow, this.parseFlow(this.data.stocks[stock]["outflows"][outflow]["equation"])); // RECURSIVE
                }
            }
        }

        // Looks for stock names in expressions and replaces with their respective values (SAFEVAL)
        let availableStocks = Object.keys(this.data.stocks).sort((a, b) => a.length - b.length).reverse()
        if (availableStocks != []) {
            for (var stock of availableStocks) {
                if (flowEq.includes(stock)) {
                    flowEq = flowEq.replace(this.data.stocks[stock]["name"], this.data.stocks[stock]["safeval"]); // not recursive
                }
            }
        }

        return flowEq;
    }

    /*
    Applies parseFlow initially to the stock values to work out the "static converters"
    */
    initStocks() {
        for (var stockName in this.data.stocks) {
            let stock = this.data.stocks[stockName];

            let value = eval(this.parseFlow(stock["equation"]));
            
            stock["safeval"] = value;
            stock["values"].push(value);
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
            let flowEq = inflows[i]["equation"];
            if (flowEq.includes("$")) { // check if flow is a uniflow
                flowEq = flowEq.replace('$', '');
                sumInflow += Math.max(0, eval(this.parseFlow(flowEq)));
            } else {
                sumInflow += eval(this.parseFlow(flowEq));
            }
        }

        let sumOutflow = 0;
        for (var i in outflows) {
            let flowEq = outflows[i]["equation"];
            if (flowEq.includes("$")) { // check if flow is a uniflow
                flowEq = flowEq.replace('$', '');
                sumOutflow += Math.max(0, eval(this.parseFlow(flowEq)));
            } else {
                sumOutflow += eval(this.parseFlow(flowEq));
            }
        }

        return sumInflow - sumOutflow;
    }

    /*
    Runs model using Euler's method.
    */
    euler() {
        for (var t = this.startTime + this.dt; t <= this.endTime; t += this.dt) { // iterate over time (skip start time as that was covered in this.initStocks)
            console.log(t)
            // Calculate new values for all stocks and their flows
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];

                if (stock["isNN"] == "true") { // check if stock is non-negative
                    stock["values"].push(Math.max(0,(stock["safeval"] + this.dydt(stock) * this.dt)));
                } else {
                    stock["values"].push(stock["safeval"] + this.dydt(stock) * this.dt);
                }

                stock["safeval"] = stock["values"][stock["values"].length - 1]; // update safeval
            }

        }
    }

    /*
    Runs model using 4th order Runge-Kutta method.
    */
    rk4() {
        for (var t = 0; t <= this.data.endTime; t += this.data.dt) { // iterate over time
            this.cache["time"].push(t); // add new time to cache
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

                this.cache[stockName].push(parseFloat(stock["value"])); // add new value to cache
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
    }
}