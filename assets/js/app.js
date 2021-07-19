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

// NOTE -> working with async functions https://www.w3schools.com/JS//js_async.asp

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
    var circle= chartGroup.selectAll("circle")
    .data(News)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", (d, i) => { console.log(i); return yLinearScale(d.age)})
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("stroke", "grey")
    .attr("stroke-width", "3")
    .attr("opacity", ".75");






})();