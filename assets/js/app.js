// @TODO: YOUR CODE HERE!

// NOTE -> working with var vs const vs let https://www.freecodecamp.org/news/var-let-and-const-whats-the-difference/

// Create SVG size and attributes

const svgWidth = 960;
const svgHeight = 500;

const margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// SVG wrapper, append SVG group to hold chart
const svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial axis parameters
let selXAxis = "poverty";
let selYAxis = "healthcare";

// NOTE -> working with async functions https://www.w3schools.com/JS//js_async.asp per tutor recommendation

(async function(){

// Import CSV data
    const csvData = await d3.csv("assets/data/data.csv");
    
    // Parse data to return numbers
    csvData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.income = +data.income;   
    });

    // Create scale functions  
    let xLinearScale = xScale(csvData, selXAxis);
    let yLinearScale = yScale(csvData, selYAxis);

    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

     // Append axes to chart
    let xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    let yAxis = chartGroup.append("g").call(leftAxis);

    // Create data circles
    
    // data circles group - create and append to scatterplot
    let circleGroup = chartGroup.selectAll("g circle")
        .data(cvsData).enter()
        .append("g")
    
    // data circles location - append according to CSV datapoints
    let circleLoc = circleGroup.append("circle")
        .attr("cx", d => xLinearScale(d[selXAxis]))
        .attr("cy", d => yLinearScale(d[selYAxis]))
        .attr("r", 20)
        .classed("dataCircle", true);
    
    // data circles text - create and add to circles
    let circleTxt = circleGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[selXAxis]))
        .attr("dy", d => yLinearScale(d[selYAxis]))
        .classed("circleText", true);
   
    // Create x axis labels (poverty, age, income; poverty is initial)

    const xAxisLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height})`);

    const povertyXAxis = xAxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .text("Poverty Level (%)")
        .classed("active", true);

    const ageXAxis = xAxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age")
        .text("Median Age")
        .classed("inactive", true);

    const incomeXAxis = xAxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income")
        .text("Median Household Income")
        .classed("inactive", true);

    // Create y axis labels (healthcare, smoking, obesity; healthcare is initial)

    const yAxisLabels = chartGroup.append("g");

    const healthcareYAxis = yAxisLabels.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -40)
      .attr("value", "healthcare")
      .text("% Without Healthcare")
      .classed("active", true);
  
    const smokeYAxis = yAxisLabels.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -60)
      .attr("value", "smokes")
      .text("% Smokers")
      .classed("inactive", true);
  
    const obesityYAxis = yAxisLabels.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -80)
      .attr("value", "obesity")
      .text("Obesity Level (%)")
      .classed("inactive", true);

    






})();