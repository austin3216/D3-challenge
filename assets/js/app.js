// @TODO: YOUR CODE HERE!

// NOTE -> working with var vs const vs let https://www.freecodecamp.org/news/var-let-and-const-whats-the-difference/
// Switching back to var until I know more about this...

// Set initial axis parameters
var selXAxis = "poverty";
var selYAxis = "healthcare";

// NOTE -> trying to work with async functions https://www.w3schools.com/JS//js_async.asp per tutor recommendation
// (async function(){
// switching to individual functions -- not sure what I'm missing with async

// X scale function to update based on what label is clicked
function xScale(data, selXAxis, chartWidth) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[selXAxis]) * .8, d3.max(data, d => d[selXAxis]) * 1.1]).range([0, chartWidth]);
    return xLinearScale;
}

// X axis function to update based on what label is clicked
function renderXAxes(newXAxis, xAxis) {
    var bottomAxis = d3.axisBottom(newXAxis);
    xAxis.transition().duration(1000).call(bottomAxis);
    return xAxis;
}

// Y scale function to update based on what label is clicked
function yScale(data, selYAxis, chartHeight) {
    // Create scales.
    var yLinearScale = d3.scaleLinear().domain([d3.min(data, d => d[selYAxis]) * .8, d3.max(data, d => d[selYAxis]) * 1.2]).range([chartHeight, 0]);
    return yLinearScale;
}
// X axis function to update based on what label is clicked
function renderYAxes(newYAxis, yAxis) {
    var leftAxis = d3.axisLeft(newYAxis);
    yAxis.transition().duration(1000).call(leftAxis);
    return yAxis;
}

// Circle Group function to update upon transition
function renderCircles(circleGroup, newXAxis, newYAxis, selXAxis, selYAxis) {
    circleGroup.transition().duration(1000).attr("cx", d => newXAxis(d[selXAxis])).attr("cy", d => newYAxis(d[selYAxis]));
    return circleGroup;
}

// Circle Text function to update upon transition
function renderText(circleGroupText, newXAxis, newYAxis, selXAxis, selYAxis) {
    circleGroupText.transition().duration(1000).attr("x", d => newXAxis(d[selXAxis])).attr("y", d => newYAxis(d[selYAxis]));
    return circleGroupText;
}

// Tooltip update function
function updateToolTip(selXAxis, selYAxis, circleGroup, textGroup) {
    // x axis conditional
    if (selXAxis === "poverty") {
        var xlabel = "Poverty Level (%): ";
    } else if (selXAxis === "income") {
        var xlabel = "Median Income: "
    } else {
        var xlabel = "Median Age: "
    }

    // y axis conditional
    if (selYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare (%): ";
    } else if (selYAxis === "smokes") {
        var ylabel = "Smokers (%): "
    } else {
        var ylabel = "Obesity Level (%): "
    }

    // create tooltip
    var toolTip = d3.tip()
        .offset([120, -60])
        .attr("class", "d3-tip")
        .html(function(d) {
            if (selXAxis === "age") {
                return (`${d.state}<hr>${xlabel} ${d[selXAxis]}<br>${ylabel}${d[selYAxis]}%`);
            } 
            else if (selXAxis !== "poverty" && selXAxis !== "age") {
                return (`${d.state}<hr>${xlabel}$${d[selXAxis]}<br>${ylabel}${d[selYAxis]}%`);
            } 
            else {
                return (`${d.state}<hr>${xlabel}${d[selXAxis]}%<br>${ylabel}${d[selYAxis]}%`);
            }   
        });

    // Call the tooltip with the Circle Group
    circleGroup.call(toolTip);

    // Mouseover event listener for tooltip
    circleGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    textGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    return circleGroup;
};

// Function to create chart and make responsive

function responsiveChart() {

    var svgArea = d3.select("#scatter").select("svg");

    // Clear svg area - IMPORTANT!
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG parameters based on window size
    var svgWidth = 1000;
    var svgHeight = 750;
    
    var margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 80
    };
    
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    
    // SVG wrapper, append SVG group to hold chart
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("assets/data/data.csv").then(function(csvData, err) {
        if (err) throw err;
        // Parse data to return numbers
        csvData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
            data.income = +data.income;   
        });

        // Create x and y scales 
        var xLinearScale = xScale(csvData, selXAxis, chartWidth);
        var yLinearScale = yScale(csvData, selYAxis, chartHeight);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append axes to chart
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
    
        var yAxis = chartGroup.append("g").call(leftAxis);

        // Create data circles
    
        // data circles group - select data
        var circleGroup = chartGroup.selectAll("circle")
        .data(csvData);

        // bind data to group
        var bindData = circleGroup.enter();

        // data circles location - append according to CSV datapoints
        var circle = bindData.append("circle")
            .attr("cx", d => xLinearScale(d[selXAxis]))
            .attr("cy", d => yLinearScale(d[selYAxis]))
            .attr("r", 15)
            .classed("stateCircle", true);
    
        // data circles text - create and add to circles
        var circleTxt = bindData.append("text")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d[selXAxis]))
            .attr("y", d => yLinearScale(d[selYAxis]))
            .attr("dy", ".30em")
            .classed("stateText", true);
        
        // update tooltip    
        var circleGroup = updateToolTip(selYAxis, selYAxis, circle, circleTxt);

        // Create x axis labels (poverty, age, income; poverty is initial)

        var xAxisLabels = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

        var povertyXAxis = xAxisLabels.append("text")
            .attr("x", 0)
            .attr("y", 20)
            // value for event listener
            .attr("value", "poverty")
            .text("Poverty Level (%)")
            .classed("active", true);

        var ageXAxis = xAxisLabels.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .text("Median Age")
            .classed("inactive", true);

        var incomeXAxis = xAxisLabels.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .text("Median Household Income")
            .classed("inactive", true);

        // Create y axis labels (healthcare, smoking, obesity; healthcare is initial)

        var yAxisLabels = chartGroup.append("g").attr("transform", "rotate(-90)");

        var healthcareYAxis = yAxisLabels.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 40 - margin.left)
            .attr("dy", "1em")
            .attr("value", "healthcare")
            .text("% Without Healthcare")
            .classed("active", true);
    
        var smokeYAxis = yAxisLabels.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 20 - margin.left)
            .attr("dy", "1em")
            .attr("value", "smokes")
            .text("% Smokers")
            .classed("inactive", true);
    
        var obesityYAxis = yAxisLabels.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("value", "obesity")
            .text("Obesity Level (%)")
            .classed("inactive", true);
        
        // Create event listener for x axis
        xAxisLabels.selectAll("text").on("click", function() {
            
            // Get selected label
            selXAxis = d3.select(this).attr("value");
            
            // Update x linear scale
            xLinearScale = xScale(csvData, selXAxis, chartWidth);

            // Render axis
            xAxis = renderXAxes(xLinearScale, xAxis);
            
            // updates label based on active/inactive XAxis
            if (selXAxis === "age") {
                povertyXAxis
                    .classed("active", false)
                    .classed("inactive", true);
                ageXAxis
                    .classed("active", true)
                    .classed("inactive", false);
                incomeXAxis
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (selXAxis === "income") {
                povertyXAxis
                    .classed("active", false)
                    .classed("inactive", true);
                ageXAxis
                    .classed("active", false)
                    .classed("inactive", true);
                incomeXAxis
                    .classed("active", true)
                    .classed("inactive", false);
            }
            else {
                povertyXAxis
                    .classed("active", true)
                    .classed("inactive", false);
                ageXAxis
                    .classed("active", false)
                    .classed("inactive", true);
                incomeXAxis
                    .classed("active", false)
                    .classed("inactive", true);
            }
            
            // Update circles with x values
            circle = renderCircles(circleGroup, xLinearScale, yLinearScale, selXAxis, selYAxis);

            // Update circles text with x values
            circleTxt = renderText(circleTxt, xLinearScale, yLinearScale, selXAxis, selYAxis);

            // Update tooltip
            circleGroup = updateToolTip(selXAxis, selYAxis, circle, circleTxt);
        });
        
        // Create event listener for y axis
        yAxisLabels.selectAll("text").on("click", function() {
            
            // Get selected label
            selYAxis = d3.select(this).attr("value");
            
            // Update y linear scale
            yLinearScale = yScale(csvData, selYAxis, chartHeight);

            // Render axis
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates label based on active/inactive YAxis
            if (selYAxis === "healthcare") {
                healthcareYAxis
                    .classed("active", true)
                    .classed("inactive", false);
                smokeYAxis
                    .classed("active", false)
                    .classed("inactive", true);
                obesityYAxis
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (selYAxis === "smokes") {
                healthcareYAxis
                    .classed("active", false)
                    .classed("inactive", true);
                smokeYAxis
                    .classed("active", true)
                    .classed("inactive", false);
                obesityYAxis
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                healthcareYAxis
                    .classed("active", false)
                    .classed("inactive", true);
                smokeYAxis
                    .classed("active", false)
                    .classed("inactive", true);
                obesityYAxis
                    .classed("active", true)
                    .classed("inactive", false);
            }

            // Update circles with y values
            circle = renderCircles(circleGroup, xLinearScale, yLinearScale, selXAxis, selYAxis);

            // Update circles text with y values
            circleTxt = renderText(circleTxt, xLinearScale, yLinearScale, selXAxis, selYAxis);

            // Update tooltip
            circleGroup = updateToolTip(selXAxis, selYAxis, circle, circleTxt);
        });

    }).catch(function(err) {
        console.log(err);
    });
}

// call function to make chart responsive
responsiveChart();

// call function to make chart responsive upon window size change
d3.select(window).on("resize", responsiveChart);