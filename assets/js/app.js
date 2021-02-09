var svgWidth = 750;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  


// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {
  // Parse Data/Cast as numbers
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.poverty)-1, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([18, d3.max(healthData, d => d.obesity)+2])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll(".stateCircle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 10)
    .attr("class", "stateCircle");

    // Put state abbreviations on the dots.
    chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.obesity) + 4)
    .text(d => d.abbr)
    .attr("font-size", "10px")
    .attr("class", "stateText");

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
        // Remove highlight
        d3.select(this).style("stroke", "#e3e3e3");
        //d3.select("." + d.abbr).style("stroke", "#323232")
      });

    // Tool tip
    var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // Grab the state name.
      var theState = "<div>" + d.state + "</div>";
      // Snatch the y value's key and value.
      var theY = "<div>" + "Obesity: " + d.obesity + "%</div>";
      // Grab the x key and a version of the value formatted to show percentage
      theX = "<div>" + "Poverty: " + d.poverty + "%</div>";
      // Display what we capture.
      return theState + theX + theY;
    });

    

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
