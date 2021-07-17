// @TODO: YOUR CODE HERE!

// Create SVG size and attributes

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper, append SVG group to hold chart
var svg = d3.select(".scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import CSV
d3.csv("data.csv").then(function(News) {
    console.log(News);

    // Parse data to return numbers
    News.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;   
    });

    let copyNews = JSON.parse(JSON.stringify(News));

    // Create x and y scale functions  
    var xLinearScale = d3.scaleLinear().domain([5, d3.max(News, d => d.smokes)]).range([0, width]);
    var yLinearScale = d3.scaleLinear().domain([28, d3.max(News, d => d.age)]).range([height, 0]);

    // Create left and bottom axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

     // Append axes to chart
    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(leftAxis);

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






});