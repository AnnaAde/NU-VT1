    d3.csv("./data/disney-movies.csv").then(function(data) {
    console.log(data);

    const width = 1400;
    const height = 845;
    const margin = {top: 50, left: 100, right: 50, bottom: 100};


    // Canvas

    const viz = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    // FILTER DATA
    const filtered_data1 = data.filter(function(d) {
        return d.typeGross == 1;
    });

    const filtered_data2 = data.filter(function(d) {
        return d.typeGross == 2;
    });
    
    const totalGross = {
        min2: d3.min(filtered_data2, function(d) { return +d.totalGross; }),
        max2: d3.max(filtered_data2, function(d) { return +d.totalGross; }),
        min1: d3.min(filtered_data1, function(d) { return +d.totalGross; }),
        max1: d3.max(filtered_data1, function(d) { return +d.totalGross; })

    };

    const year = {
        min2: d3.min(filtered_data2, function(d) { return +d.year; }),
        max2: d3.max(filtered_data2, function(d) { return +d.year; }),
        min1: d3.min(filtered_data1, function(d) { return +d.year; }),
        max1: d3.max(filtered_data1, function(d) { return +d.year; })
    };

    const genre = {
        min2: d3.min(filtered_data2, function(d) { return +d.genre; }),
        max2: d3.max(filtered_data2, function(d) { return +d.genre; }),
        min1: d3.min(filtered_data1, function(d) { return +d.genre; }),
        max1: d3.max(filtered_data1, function(d) { return +d.genre; })
    };


        // Scales
    const xScale = d3.scaleLinear()
        .domain([year.min2, year.max2])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([totalGross.min2, totalGross.max2])
        .range([height-margin.bottom, margin.top]);

    const fillScale = d3.scaleOrdinal()
        .domain(["Action", "Adventure", "Black Comedy", "Comedy", "Concert and Performance", "Drama", "Documentary", "Horror", "Musical", "Romantic Comedy", "Thriller and Suspense", "Western"])
        .range(["green", "yellow", "red", "blue", "purple", "black", "orange", "gray", "magenta", "cyan", "silver", "chartreuse"]);


    // Axes
    const xAxis = viz.append("g")
        .attr("transform",`translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("d")));

    const yAxis = viz.append("g")
        .attr("transform",`translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale).tickFormat(d3.format("$,")));


    // Labels
    const xAxisLabel = viz.append("text")
        .attr("class","axisLabel")
        .attr("x", margin.left + (width-margin.left-margin.right)/2)
        .attr("y", height-50)
        .attr("text-anchor","middle")
        .text("Year");

    const yAxisLabel = viz.append("text")
        .attr("class","axisLabel")
        .attr("x", -(height-margin.bottom)/2)
        .attr("y", 20)
        .attr("text-anchor","middle")
        .attr("transform","rotate(-90)")
        .text("Gross (in USD)");


    // Marks
    let points = viz.selectAll("circle")
        .data(filtered_data2, function(d) { return d.movieTitle; })
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.totalGross); })
            .attr("fill", function(d) { return fillScale(d.genre); })
            .attr("r", 5)
            .attr("height", function(d) {return height - margin.bottom - yScale(d.totalGross); })

    // Tooltip

    let tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    viz.selectAll("circle").on("mouseover", function(e, d) {

        let cx = +d3.select(this).attr("cx");
        let cy = +d3.select(this).attr("cy");

        tooltip.style("visibility","visible") 
            .style("left", `${cx}px`)
            .style("top", `${cy+200}px`)
            .html(`<b>Movie Title</b>: ${d.movieTitle}<br><b>Gross: $</b> ${Math.round(d.totalGross)}<br><b>Year</b>: ${d.year}<br><b>Genre</b>: ${d.genre}`);

        d3.select(this)
            .attr("stroke","#b8d6e9")
            .attr("stroke-width",2);

    }).on("mouseout", function() {

        tooltip.style("visibility","hidden");

        d3.select(this)
            .attr("stroke","none")
            .attr("stroke-width",0);
            
    });

    // Update
    d3.select("#unadjusted").on("click", function() {
        xScale.domain([year.min1, year.max1]);

        yScale.domain([totalGross.min1, totalGross.max1]);
    
        let enterPoints = viz.selectAll("circle")
            .data(filtered_data1, function(d) { return d.movieTitle; });
    
        enterPoints.enter()
            .append("circle")
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.totalGross); })
            .attr("r", 5)
            .attr("fill", function(d) { return fillScale(d.genre); })
        .merge(enterPoints)
            .transition()
            .duration(1000)
            .delay(200)
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.totalGross); })
            .attr("r", 5)
            .attr("fill", function(d) { return fillScale(d.genre); });
    
        xAxis.transition()
            .duration(1000)
            .delay(200)
            .call(d3.axisBottom().scale(xScale));
        
        yAxis.transition()
            .duration(1000)
            .delay(200)
            .call(d3.axisLeft().scale(yScale));
    
        enterPoints.exit()
            .transition()
            .duration(1000)
            .delay(200)
            .attr("r",0)
            .remove();
    });

    // Transition
    d3.select("#adjusted").on("click", function() {

        xScale.domain([year.min2, year.max2]);

        yScale.domain([totalGross.min2, totalGross.max2]);
    
        let enterPoints = viz.selectAll("circle")
            .data(filtered_data2, function(d) { return d.movieTitle; });

        enterPoints.enter()
            .append("circle")
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.totalGross); })
            .attr("r", 5)
            .attr("fill", function(d) { return fillScale(d.genre); })
        .merge(enterPoints)
            .transition()
            .duration(2000)
            .delay(250)
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.totalGross); })
            .attr("r", 5)
            .attr("fill", function(d) { return fillScale(d.genre); });
    
        xAxis.transition()
            .duration(1000)
            .delay(200)
            .call(d3.axisBottom().scale(xScale));
        
        yAxis.transition()
            .duration(1000)
            .delay(200)
            .call(d3.axisLeft().scale(yScale));
    
        enterPoints.exit()
            .transition()
            .duration(1000)
            .delay(200)
            .attr("r",0)
            .remove();
    });
    
});