d3.csv("./data/lawandorder.csv").then(function(data) {
    // console.log(data);

    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 100, right: 50, bottom: 80};
    
    // Canvas
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Filtering Data. Season Viz is in the csv for turning the 
    // categorical "first" and "latest" seasons into numbers 
    // that could be called and filtered here. Find actual 
    // season numbers under "seasons."
    const filtered_data1 = data.filter(function(d) {
        return d.seasonViz == 1;
    });

    const filtered_data2 = data.filter(function(d) {
        return d.seasonViz == 2;
    });

    // Scales
    const xScale = d3.scaleBand()
        .domain(filtered_data1.map(function(d) { return d.franchise; }))
        .range([margin.left, width-margin.right])
        .padding(0.4);

    const yScale = d3.scaleLinear()
        .domain([0, 20])
        .range([height-margin.bottom, margin.top]);
    
    const fillScale = d3.scaleOrdinal()
        .domain(["Law & Order", "Law & Order: SVU", "Law & Order: Criminal Intent", "Law & Order: Organized Crime"])
        .range(["black", "gray", "#20438f", "#a30606"]);


    // Axes and Labels

    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));
    
    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));
    
    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .attr("text-anchor","middle")
        .text("Series (or Spin-Off)");
    
    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", -(height-margin.bottom)/2)
        .attr("y", margin.left/2)
        .attr("text-anchor","middle")
        .attr("transform","rotate(-90)")
        .text("Ratings (in Millions)");

    // Title
    let title = svg.append("text")
        .attr("class","axisLabel") /* I don't mind it having the same properties as the axis labels */
        .attr("x", (width/2))             
        .attr("y", margin.top/2)
        .attr("text-anchor", "middle")  
        .text("First Season's Ratings");

    // Bars
    let bar = svg.selectAll("rect")
        .data(filtered_data1, function(d) { return d.franchise; })
        .enter()
        .append("rect")
            .attr("x", function(d) { return xScale(d.franchise); })
            .attr("y", function(d) { return yScale(d.ratings); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - margin.bottom - yScale(d.ratings); })
            .attr("fill", function(d) { return fillScale(d.franchise); })


    // Data Update

    d3.select("#first").on("click", function() {

    let b = svg.selectAll("rect")
        .data(filtered_data1, function(d) { return d.franchise; });

    b.transition()
        .duration(1500)
        .attr("x", function(d) { return xScale(d.franchise); })
        .attr("y", function(d) { return yScale(d.ratings); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - margin.bottom - yScale(d.ratings); })
        .attr("fill", function(d) { return fillScale(d.franchise); })

    title.transition()
        .duration(1500)
        .delay(200)
        .text("First Season's Ratings");

    });

    d3.select("#latest").on("click", function() {

    let b = svg.selectAll("rect")
        .data(filtered_data2, function(d) { return d.franchise; });

    b.transition()
        .duration(1500)
        .attr("x", function(d) { return xScale(d.franchise); })
        .attr("y", function(d) { return yScale(d.ratings); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - margin.bottom - yScale(d.ratings); })
        .attr("fill", function(d) { return fillScale(d.franchise); })

    title.transition()
        .duration(1500)
        .delay(200)
        .text("Latest Season's Ratings");

    });

    // Tooltip

    const tooltip = d3.select("#chart")
    .append("div")
    .attr("class","tooltip");

    bar.on("mouseover", function(e, d) {

        let x = +d3.select(this).attr("x") + xScale.bandwidth();
        let y = +d3.select(this).attr("y");

    tooltip.style("visibility","visible")
        .style("left", `${x}px`)
        .style("top", `${y}px`)
        // What the tooltip labels
        .html(`<b>Season</b>: ${d.season} <br><b>Episodes</b>: ${d.episodes} <br><b>Year:</b> ${d.year}<br><b>Ratings</b>: ${d.ratings} Million`);

        // All bars to fade when hovered on
        bar.attr("opacity", 0.1);

        // Bar hovered over opaque
        d3.select(this)
        .attr("opacity", 1);

    }).on("mouseout", function() {

        //Remove tooltip
        tooltip.style("visibility","hidden");

        // Restore bar to full opacity
        bar.attr("opacity", 1);
            
    });
});