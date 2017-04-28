// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
width = 500 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;
//
//TODO: add google maps to background of image
//
//
var projection = d3.geo.mercator();

var zoom = d3.behavior.zoom()
    .scaleExtent([0, 100])
    .on("zoom", zoomed);
    
var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var popup = d3.select("body").append("div")
    .attr("class", "popup")
    .style("opacity", 0);

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

var rect = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(drag);

var container = svg.append("g");


// Get the data
d3.csv("data.csv", function(error, data) {
    dot = container.append("g")
        .attr("class", "dot")
        .selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("r", 2.5)
        .attr("cx", function(d) { return (+d["X"] * 50)- 7050; })
        .attr("cy", function(d) { return ((+d["Y"]+ 50) * -50)+ 800; })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9)
                .style("fill", "red")
                .style("stroke", "orangered");
            tooltip.html(d["School_Name"] + "<br/>"
                        + d["School_Type"] + " "
                        + d["Education_Sector"] + " School" + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0)
                .style("fill", "lightsteelblue")
                .style("stroke", "steelblue");
        })
        .on("click", function(d){
            popup.transition()
                .duration(200)
                .style("opacity", 1);
            popup.html("<b>School Title</b>" + "<br/>"
                    + d["School_Name"] + "<br/>" 
                    + d["School_Type"] + " " 
                    + d["Education_Sector"] + " School" + "<br/>"
                    + "<b>Contact Information</b>" + "<br/>"
                    + d["Address_Line_1"] + " " + d["Address_Line_2"] + "<br/>"
                    + d["Address_Town"] + ", " + d["Address_Postcode"] + "<br/>"
                    + d["Full_Phone_No"])
        });

    var node = svg.selectAll("circle");
});

function zoomed(d) {
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    d3.selectAll("circle").attr("r", 2.5/d3.event.scale).style("stroke-width", 1/d3.event.scale);
}

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
}

function dragged(d) {
    d3.select(this).attr("x", d3.mouse(this)[0]).attr("y", d3.mouse(this)[1]);
}

function dragended(d) {
    d3.select(this).classed("dragging", false);
}