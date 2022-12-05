export class Simulation {
    constructor(structData) {
        this.data = structData;

        this.dt = parseFloat(this.data.dt);
        this.startTime = parseFloat(this.data.start_time);
        this.endTime = parseFloat(this.data.end_time);

        this.initObjects(); // set initial values for stocks
    }

    /* 
    Replaces names in equation with values.
    Example: 'converter1*converter2+stock1' --> '(1)*(2)+(3)'
    */
    parseObject(equation) {
        let objects = {} // stores all stocks, converters, and flows and their respective equation/safeval

        for (var stock in this.data.stocks) {
            objects[stock] = this.data.stocks[stock]["safeval"];

            // add the inflows and outflows to the available objects
            for (var flow in this.data.stocks[stock]["inflows"]) {
                objects[flow] = this.data.stocks[stock]["inflows"][flow]["equation"];
            }
            for (var flow in this.data.stocks[stock]["outflows"]) {
                objects[flow] = this.data.stocks[stock]["outflows"][flow]["equation"];
            }

        }

        for (var converter in this.data.converters) {
            objects[converter] = this.data.converters[converter]["equation"];
        }

        let sortedObjects = Object.keys(objects).sort((a, b) => a.length - b.length).reverse() // sort by length (descending) to prevent substring errors

        // Call parseObject recursively on all objects to replace the names with their respective values
        for (var object of sortedObjects) {
            if (equation.includes(object)) {
                equation = equation.replace(object, this.parseObject('(' + objects[object] + ')')); // RECURSIVE
            }
        }

        return equation;
    }

    /*
    Applies parseObject initially all values to figure out timestep 0.
    */
    initObjects() {
        for (var stockName in this.data.stocks) {
            let stock = this.data.stocks[stockName];

            let value = eval(this.parseObject(stock["equation"]));
            
            stock["safeval"] = value;
            stock["values"].push(value);
        }

        for (var stockName in this.data.stocks) {
            let stock = this.data.stocks[stockName];

            // initialize flows
            for (var flowName in stock["inflows"]) {
                this.data.stocks[stockName]["inflows"][flowName]["values"].push(eval(this.parseObject(this.data.stocks[stockName]["inflows"][flowName]["equation"])));
            }
            for (var flowName in stock["outflows"]) {
                this.data.stocks[stockName]["outflows"][flowName]["values"].push(eval(this.parseObject(this.data.stocks[stockName]["outflows"][flowName]["equation"])));
            }
        }

        for (var converterName in this.data.converters) {
            this.data.converters[converterName]["values"].push(eval(this.parseObject(this.data.converters[converterName]["equation"])));
        }
    }

    /*
    Resets the model to the initial state.  Deletes all values for all objects and sets safevals to null.
    */
    reset() {
        for (var stockName in this.data.stocks) {
            let stock = this.data.stocks[stockName];

            stock["safeval"] = null;
            stock["values"] = [];

            // initialize flows
            for (var flowName in stock["inflows"]) {
                this.data.stocks[stockName]["inflows"][flowName]["values"] = [];
            }
            for (var flowName in stock["outflows"]) {
                this.data.stocks[stockName]["outflows"][flowName]["values"] = [];
            }
        }

        for (var converterName in this.data.converters) {
            this.data.converters[converterName]["values"] = [];
        }

        this.data.time = []
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
                sumInflow += Math.max(0, eval(this.parseObject(flowEq)));
            } else {
                sumInflow += eval(this.parseObject(flowEq));
            }
        }

        let sumOutflow = 0;
        for (var i in outflows) {
            let flowEq = outflows[i]["equation"];
            if (flowEq.includes("$")) { // check if flow is a uniflow
                flowEq = flowEq.replace('$', '');
                sumOutflow += Math.max(0, eval(this.parseObject(flowEq)));
            } else {
                sumOutflow += eval(this.parseObject(flowEq));
            }
        }

        return sumInflow - sumOutflow;
    }

    /*
    Runs model using Euler's method.
    */
    euler() {
        console.log(this.startTime, this.endTime, this.dt)
        for (var t = this.startTime + this.dt; parseFloat(t.toFixed(5)) <= parseFloat(this.endTime.toFixed(5)); t += this.dt) { // (skip start time as that was covered in this.initObjects())
            this.data.time.push(t)
            // Calculate new values for all stocks
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];

                if (stock["isNN"] == "true") { // check if stock is non-negative
                    stock["values"].push(Math.max(0,(stock["safeval"] + this.dydt(stock) * this.dt)));
                } else {
                    stock["values"].push(stock["safeval"] + this.dydt(stock) * this.dt);
                }
            }

            // Update safeval for next iteration
            for (var stockName in this.data.stocks) { 
                let stock = this.data.stocks[stockName];
                stock["safeval"] = stock["values"][stock["values"].length - 1];
            }

            // Update values for all flows
            for (var stockName in this.data.stocks) {
                for (var inflow in this.data.stocks[stockName]["inflows"]) {
                    this.data.stocks[stockName]["inflows"][inflow]["values"].push(eval(this.parseObject(this.data.stocks[stockName]["inflows"][inflow]["equation"])));
                }
                for (var outflow in this.data.stocks[stockName]["outflows"]) {
                    this.data.stocks[stockName]["outflows"][outflow]["values"].push(eval(this.parseObject(this.data.stocks[stockName]["outflows"][outflow]["equation"])));
                }
            }

            // Update the values of all converters
            for (var converter in this.data.converters) {
                let converterEq = this.data.converters[converter]["equation"];
                this.data.converters[converter]["values"].push(eval(this.parseObject(converterEq)));
            }

        }
    }

    /*
    Runs model using 4th order Runge-Kutta method.
    */
    rk4() {
        for (var t = this.startTime + this.dt; parseFloat(t.toFixed(5)) <= parseFloat(this.endTime.toFixed(5)); t += this.dt) { // use high precision to make sure correct number of iterations
            this.data.time.push(t.toFixed(4))
            let y0_dict = {};
            let k1_dict = {};
            let k2_dict = {};
            let k3_dict = {};
            let k4_dict = {};

            // Set y0 for every stock
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];
                y0_dict[stockName] = stock["safeval"];
            }

            // k1
            for (var stockName in this.data.stocks) { // calculate k1-values for all stocks (perform for all stocks before updating safeval)
                let stock = this.data.stocks[stockName];

                // Calculate constants
                let k1 = this.dydt(stock) * this.dt;
                k1_dict[stockName] = k1;
            }
            for (var stockName in this.data.stocks) { // update safevals with new k1 values
                let stock = this.data.stocks[stockName];
                stock["safeval"] = y0_dict[stockName] + k1_dict[stockName] / 2;
            }

            // k2
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];

                let k2 = this.dydt(stock) * this.dt;
                k2_dict[stockName] = k2;
            }
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];
                stock["safeval"] = y0_dict[stockName] + k2_dict[stockName] / 2;
            }

            // k3
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];

                let k3 = this.dydt(stock) * this.dt;
                k3_dict[stockName] = k3;
            }
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];
                stock["safeval"] = y0_dict[stockName] + k3_dict[stockName];
            }

            // k4 and final value
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];

                let k4 = this.dydt(stock) * this.dt;
                k4_dict[stockName] = k4;
            }
            for (var stockName in this.data.stocks) {
                let stock = this.data.stocks[stockName];

                stock["values"].push(y0_dict[stockName] + (k1_dict[stockName] + 2 * k2_dict[stockName] + 2 * k3_dict[stockName] + k4_dict[stockName]) / 6); 
            }
            

            // Update safeval for next iteration
            for (var stockName in this.data.stocks) { 
                let stock = this.data.stocks[stockName];
                stock["safeval"] = stock["values"][stock["values"].length - 1];
            }

            // Update values for all flows
            for (var stockName in this.data.stocks) {
                for (var inflow in this.data.stocks[stockName]["inflows"]) {
                    this.data.stocks[stockName]["inflows"][inflow]["values"].push(eval(this.parseObject(this.data.stocks[stockName]["inflows"][inflow]["equation"])));
                }
                for (var outflow in this.data.stocks[stockName]["outflows"]) {
                    this.data.stocks[stockName]["outflows"][outflow]["values"].push(eval(this.parseObject(this.data.stocks[stockName]["outflows"][outflow]["equation"])));
                }
            }

            // Update the values of all converters
            for (var converter in this.data.converters) {
                let converterEq = this.data.converters[converter]["equation"];
                this.data.converters[converter]["values"].push(eval(this.parseObject(converterEq)));
            }
        }
    }

    /* 
    Runs the model. 
    This is the function called by frontend.
    */
    run() {
        this.reset();
        if (this.data["integration_method"] == "euler") {
            this.euler();
            console.log(this.data)
        } else if (this.data["integration_method"] == "rk4") {
            this.rk4();
        }
    }
}