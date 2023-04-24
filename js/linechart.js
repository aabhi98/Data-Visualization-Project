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
      .range([height, 0])
      .nice()
      .domain([-1, 1]);    
  
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
  .attr("fill", d =>getColor(d.major_event))
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

            svg.append('rect')
            .attr("x", 1020)
            .attr("y", 120)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", "red");
    
            svg.append('text')
                .attr("x", 1050)
                .attr("y", 135)
                .text("pok_rally")
                .style('font-size', '20px');
    
            svg.append('rect')
                .attr("x", 1020)
                .attr("y", 150)
                .attr("width", 20)
                .attr("height", 20)
                .style("fill", "orange");
        
            svg.append('text')
                    .attr("x", 1050)
                    .attr("y", 165)
                    .text("hit_and_run")
                    .style('font-size', '20px');
    
            svg.append('rect')
            .attr("x", 1020)
            .attr("y", 180)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", "blue");
    
            svg.append('text')
                .attr("x", 1050)
                .attr("y", 195)
                .text("fire")
                .style('font-size', '20px');
    
                svg.append('rect')
            .attr("x", 1020)
            .attr("y", 210)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", "black");
    
            svg.append('text')
                .attr("x", 1050)
                .attr("y", 225)
                .text("chatter/spam")
                .style('font-size', '20px');



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

  function getColor(event) {

    ["hit_and_run", "fire", "pok_rally", "unknown", "spam", "chatter"]
    ["orange","blue","red", "black", "black", "black"]

    if (event === "hit_and_run") {
        return "orange"
    } else if (event === "fire") {
        return "blue"
    } else if (event === "pok_rally") {
        return "red"
    } else {
        return "black"
    }
  }
  
  function aggregateSentimentData(data) {
    const sentimentScores = {
      "positive": -1,
      "neutral": 0,
      "negative": 1
    };
  
    const sentimentData = data
      .filter(d => d.major_event !== "chatter") // remove data points with major_event equal to 'chatter'
      .map(d => ({
        date: d3.timeParse("%Y%m%d%H%M%S")(d.date),
        sentiment: sentimentScores[d.sentiment],
        major_event: d.major_event
      }));
  
    const interval = 10 * 60 * 1000; // 10 minutes in milliseconds
  
    const aggregatedData = d3.rollup(
      sentimentData,
      v => {
        const sentiments = v.map(d => d.sentiment);
        const max_sentiment = d3.mean(v, d => d.sentiment);
        const major_events = v.map(d => d.major_event);
        const max_major_event = findMostFrequentString(major_events)
        return {
          sentiment: max_sentiment,
          major_event: max_major_event
        };
      },
      d => Math.floor(d.date / interval) * interval
    );
  

    const final_data = Array.from(aggregatedData, ([date, {sentiment, major_event}]) => ({
      date: new Date(date),
      sentiment,
      major_event
    }));

    console.log("final data", final_data)
  
    return final_data;
  }
  

  function findMostFrequentString(list) {
    let counts = {};
    let maxCount = 0;
    let maxString = '';
  
    // Loop through the list and count the occurrences of each string
    for (let i = 0; i < list.length; i++) {
      let str = list[i];
      if (counts[str]) {
        counts[str]++;
      } else {
        counts[str] = 1;
      }
  
      // Update the maxCount and maxString if the current string has more occurrences
      if (counts[str] > maxCount) {
        maxCount = counts[str];
        maxString = str;
      }
    }
  
    return maxString;
  }
  