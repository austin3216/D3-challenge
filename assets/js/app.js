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
    // Create scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[selXAxis]), d3.max(data, d => d[chosenXAxis])]).range([0, chartWidth]);
    return xLinearScale;
}

// X axis function to update based on what label is clicked
function renderXAxes(newXAxis, xAxis) {
    var bottomAxis = d3.axisBottom(newXAxis);
    xAxis.transition().duration(1000).call(bottomAxis);
    return xAxis;

// Y scale function to update based on what label is clicked
function yScale(data, selYAxis, chartHeight) {
    // Create scales.
    var yLinearScale = d3.scaleLinear().domain([d3.min(data, d => d[selYAxis]), d3.max(data, d => d[selYAxis])]).range([chartHeight, 0]);
    return yLinearScale;
}
// X axis function to update based on what label is clicked
function renderYAxes(newYAxis, yAxis) {
    var leftAxis = d3.axisLeft(newYAxis);
    yAxis.transition().duration(1000).call(leftAxis);
    return yAxis;

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
function updateToolTip(selXAxis, selYAxis, circleGroup, circleGroupText) {
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
    var toolTip = d3.tip().offset([120, -60]).attr("class", "tooltip").html(function(d) {
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

    circleGroupText
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

    var svgWidth = 960;
    var svgHeight = 500;
    
    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
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

    })  

}


// // Import CSV data
//     
    
//     
//     

//     

//     



//     // Create data circles
    
//     // data circles group - create and append to scatterplot
//     let circleGroup = chartGroup.selectAll("g circle")
//         .data(cvsData).enter()
//         .append("g")
    
//     // data circles location - append according to CSV datapoints
//     let circleLoc = circleGroup.append("circle")
//         .attr("cx", d => xLinearScale(d[selXAxis]))
//         .attr("cy", d => yLinearScale(d[selYAxis]))
//         .attr("r", 20)
//         .classed("dataCircle", true);
    
//     // data circles text - create and add to circles
//     let circleTxt = circleGroup.append("text")
//         .text(d => d.abbr)
//         .attr("dx", d => xLinearScale(d[selXAxis]))
//         .attr("dy", d => yLinearScale(d[selYAxis]))
//         .classed("circleText", true);
   
//     // Create x axis labels (poverty, age, income; poverty is initial)

//     const xAxisLabels = chartGroup.append("g")
//         .attr("transform", `translate(${width / 2}, ${height})`);

//     const povertyXAxis = xAxisLabels.append("text")
//         .attr("x", 0)
//         .attr("y", 40)
//         .attr("value", "poverty")
//         .text("Poverty Level (%)")
//         .classed("active", true);

//     const ageXAxis = xAxisLabels.append("text")
//         .attr("x", 0)
//         .attr("y", 60)
//         .attr("value", "age")
//         .text("Median Age")
//         .classed("inactive", true);

//     const incomeXAxis = xAxisLabels.append("text")
//         .attr("x", 0)
//         .attr("y", 80)
//         .attr("value", "income")
//         .text("Median Household Income")
//         .classed("inactive", true);

//     // Create y axis labels (healthcare, smoking, obesity; healthcare is initial)

//     const yAxisLabels = chartGroup.append("g");

//     const healthcareYAxis = yAxisLabels.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("x", -(height / 2))
//       .attr("y", -40)
//       .attr("value", "healthcare")
//       .text("% Without Healthcare")
//       .classed("active", true);
  
//     const smokeYAxis = yAxisLabels.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("x", -(height / 2))
//       .attr("y", -60)
//       .attr("value", "smokes")
//       .text("% Smokers")
//       .classed("inactive", true);
  
//     const obesityYAxis = yAxisLabels.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("x", -(height / 2))
//       .attr("y", -80)
//       .attr("value", "obesity")
//       .text("Obesity Level (%)")
//       .classed("inactive", true);

//     // Create tooltips
//     circleGroup = updateToolTip(circleGroup, selXAxis, selYAxis);

//     // Create event listener for x axis
//     xAxisLabels.selectAll("text").on("click", function() {
//         const selection = d3.select(this).attr("value");
//         // conditionals to change x axis by selection
//         if (selection !== selXAxis) {

//             // puts "value" on x axis (attribute defined in xAxisLabels and yAxisLabels)
//             selXAxis = value;

//             // update the scale of x axis based on data
//             xLinearScale = xScale(csvData, selXAxis);

//             // renders the x axis
//             xAxis = renderXAxis(xLinearScale, xAxis);

//             // updates circles with new x axis data
//             circleLoc = renderXCircles(circleLoc, xLinearScale, selXAxis);

//             // updates circle text with new x axis data
//             circleTxt = renderXText(circleTxt, xLinearScale, selXAxis);

//             // updates tooltip
//             circleGroup = updateToolTip(circleGroup, selXAxis, selYAxis);

//             // updates label appearance based on active/inactive
//             if (selXAxis === "age") {
//                 povertyXAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 ageXAxis
//                     .classed("active", true)
//                     .classed("inactive", false);
//                 incomeXAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//             }
//             else if (selXAxis === "income") {
//                 povertyXAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 ageXAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 incomeXAxis
//                     .classed("active", true)
//                     .classed("inactive", false);
//             }
//             else {
//                 povertyXAxis
//                     .classed("active", true)
//                     .classed("inactive", false);
//                 ageXAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 incomeXAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//             }
//         }
//     });

//     // Create event listener for y axis
//     yAxisLabels.selectAll("text").on("click", function() {
//         const selection = d3.select(this).attr("value");
//         // conditionals to change x axis by selection
//         if (selection !== selYAxis) {

//             // puts "value" on y axis (attribute defined in xAxisLabels and yAxisLabels)
//             selYAxis = value;

//             // update the scale of x axis based on data
//             yLinearScale = yScale(csvData, selYAxis);

//             // renders the x axis
//             yAxis = renderYAxis(yLinearScale, yAxis);

//             // updates circles with new x axis data
//             circleLoc = renderYCircles(circleLoc, yLinearScale, selYAxis);

//             // updates circle text with new x axis data
//             circleTxt = renderYText(circleTxt, yLinearScale, selYAxis);

//             // updates tooltip
//             circleGroup = updateToolTip(circleGroup, selXAxis, selYAxis);

//             // updates label appearance based on active/inactive
//             if (selYAxis === "smokes") {
//                 healthcareYAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 smokeYAxis
//                     .classed("active", true)
//                     .classed("inactive", false);
//                 obesityYAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//             }
//             else if (selYAxis === "obesity") {
//                 healthcareYAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 smokeYAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 obesityYAxis
//                     .classed("active", true)
//                     .classed("inactive", false);
//             }
//             else {
//                 healthcareYAxis
//                     .classed("active", true)
//                     .classed("inactive", false);
//                 smokeYAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 obesityYAxis
//                     .classed("active", false)
//                     .classed("inactive", true);
//             }
//         }
//     });
// })();