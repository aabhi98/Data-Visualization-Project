d3.text("data/final_dataset.csv").then(data => {
    const parsedData = d3.csvParse(data);
    createSplineGraph(parsedData);
  });

  function createSplineGraph(data) {
    // Calculate average sentiment for 10-minute intervals
    const sentimentData = aggregateSentimentData(data);

    // Set up chart dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Set up date and sentiment scales
    const x = d3.scaleTime()
      .domain(d3.extent(sentimentData, d => d.date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(sentimentData, d => d.sentiment))
      .range([height, 0]);

    // Create the SVG chart
    const svg = d3.select("#spline_graph_svg")
      .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add the X-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add the Y-axis
    svg.append("g")
      .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal()
      .domain([-1, 0, 1])
      .range(["red", "gray", "green"]);

// Add the circles for each data point
svg.selectAll("circle")
  .data(sentimentData)
  .enter()
  .append("circle")
  .attr("cx", d => x(d.date))
  .attr("cy", d => y(d.sentiment))
  .attr("r", 0)
  .attr("fill", "grey")
  .transition()
  .duration(4000)
  .attr("r", 5);

  svg.append('text')
            .attr('x', 860)
            .attr('y', 440)
            .text('Time')
            .style('font-size', '16px');

  svg.append('text')
            .attr('transform','rotate(-90)')
            .attr('dy','-40')
            .attr('dx','-400')
            .text('Risk calculated with -1 as no risk and 1 as high risk')
            .style('font-size', '16px');    


    // Add the spline graph
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.sentiment))
        .curve(d3.curveCardinal);

    const path = svg.append("path")
        .datum(sentimentData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", "");

    path.transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attrTween("d", function() {
      const l = this.getTotalLength();
        return function(t) {
        return line(sentimentData.slice(0, Math.round(t * (sentimentData.length - 1)) + 1));
        };
    });

  }

  function aggregateSentimentData(data) {
    console.log("spline data",data);
    const sentimentScores = {
      "positive": 1,
      "neutral": 0,
      "negative": -1
    };

    const sentimentData = data.map(d => ({
        date: d3.timeParse("%Y%m%d%H%M%S")(d.date),
        sentiment: sentimentScores[d.sentiment],
        majorEvent: d.major_event
      }));

    console.log("sentimentData",sentimentData);

    const interval = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    const aggregatedData = d3.rollup(
      sentimentData,
      v => d3.mean(v, d => d.sentiment),
      d => Math.floor(d.date / interval) * interval
    );

    console.log("aggregatedData", aggregatedData)

    const final_data = Array.from(aggregatedData, ([date, sentiment]) => ({ date: new Date(date), sentiment }));

    console.log("Abhishek data",final_data);

    return final_data;
  }