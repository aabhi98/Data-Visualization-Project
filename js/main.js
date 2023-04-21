document.addEventListener('DOMContentLoaded', function () {
    let data;
    //Promise.all([d3.csv('data/csv-1700-1830.csv'),d3.csv('data/csv-1831-2000.csv'),d3.csv('data/csv-2001-2131.csv')]).then(function (values){
    Promise.all([d3.csv('data/final_dataset.csv')]).then(function (values){
        data = values[0]//.concat(values[1]).concat(values[2]);
        console.log(data);
        data.forEach(d=>{
            d["date"] = +d["date"];
            d["major_event"] = d["major_event"].toLowerCase();
            d["sentiment"] = d["sentiment"].toLowerCase();
        })
        let data2 = [];
        data.filter(d => d["major_event"].includes("pok_rally") || d["major_event"].includes("fire") || d["major_event"].includes("hit_and_run"))
            .forEach(d => data2.push(d));
        console.log(data2);
       drawbeeswarm1(data2);
    })

})
function drawbeeswarm1(dataset){
    //console.log(dataset);
    const svg = d3.select("#bee_swarm_svg");
    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');
    const margin = { top:50, bottom: 100, right: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    //svg.selectAll('g').remove();
    const g = svg.append('g')
        .attr('transform', 'translate('+margin.left+', '+margin.top+')');

    const parseTime = d3.timeParse("%Y%m%d%H%M%S");
    const formatTime = d3.timeFormat("%Y%m%d%H%M%S");
    const dates = dataset.map(d => parseTime(d.date));
    //console.log(d3.max(dataset, d=>d.date));
    const xScale = d3.scaleTime()
                .domain(d3.extent(dates))
                .range([0, innerWidth]);
    
   //let tooltip = d3.select("#bee_swarm_svg").append("div").attr("class", "tooltip").style("opacity", 0);
   var tooltip = d3.select("body")
                        .append("div")
                        .style("position", "absolute")
                        .style("z-index", "10")
                        .style("visibility", "hidden")
                        .style("background-color", "white")
                        .style("padding", "8px")
                        .style("border-radius", "8px")
                        .style("text-align", "center")
                        .style("font-size", "14px")
                        .style("border", "2px solid black")
    let colors = d3.scaleOrdinal().domain(["hit_and_run", "fire", "pok_rally"])
                                    .range(["orange","blue","red"]);
    draw();
    d3.selectAll("input").on("change", triggerMultipleFunctions);
    function triggerMultipleFunctions(){
        filter();
        drawPieChart();
    }
    function draw(){
        xAxis = d3.axisBottom(xScale);
        g.append('g')
                .attr('transform',`translate(0,${innerHeight+20})`)
                .transition().duration(1000)
                .call(xAxis)
        let simulation = d3.forceSimulation(dataset)
                .force("x", d3.forceX(function(d) {
                    return xScale(parseTime(d.date));
            }).strength(2))
            .force("y", d3.forceY((height / 2) - margin.bottom / 2)) 
            .force("collide", d3.forceCollide(6))
            .stop();
            //simulation.tick(10);
        for (let i = 0; i < 10; ++i) {
            simulation.tick(10);  
        }

        let majoreventcircles = g.selectAll(".events")
                //.data(dataset);
                .data(dataset, function(d){return d["major_event"]});

        majoreventcircles.exit()
                .transition()
                .duration(1000)
                .attr("cx", 0)
                .attr("cy", (height / 2) - margin.bottom / 2)
                .remove();

        majoreventcircles.enter()
            .append("circle")
            .attr("class", "events")
            .attr("cx", 0)
            .attr("cy", (height / 2) - margin.bottom / 2)
            .attr("r", function(d){
                if(d["message"].includes("RT @")){
                    return 3;
                }
                else return 3;
            })
            .attr("fill", function(d){ return colors(d["major_event"])})
            .merge(majoreventcircles)
            .transition()
            .duration(2000)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

            d3.selectAll(".events").on("mouseover", function(event, d){
                //d3.select(this).style("color", "green");
               //tooltip.html("Time: " +parseTime(d.date) + "<br>");
               tooltip.html(d["author"]+": "+d.message + "<br>");
                //console.log("hi")
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(event) {
                return tooltip.style("top", (event.pageY - 60) + "px")
                .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
            // .on("click", function(event, d){
            //     const svg_click = d3.select("#message_svg");
            //     svg_click.selectAll('g').remove();
            //     const g = svg_click.append("g").attr('transform', 'translate('+margin.left+', '+margin.top+')');
            //     g.append("text").text(d.author + ": "+d.message);
            // });
    }
    function filter(){
        //console.log(dataset);
        dataset_copy = dataset;
        function getCheckedBoxes(checkboxName) {

            let checkboxes = d3.selectAll(checkboxName).nodes();
            let checkboxesChecked = [];
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    checkboxesChecked.push(checkboxes[i].defaultValue);
                }
            }
            return checkboxesChecked.length > 0 ? checkboxesChecked : null;
        }
        let checkedBoxes = getCheckedBoxes(".event");
        console.log(checkedBoxes);
        let newData = [];

        if (checkedBoxes == null) {
            dataset = newData;
            draw();
            dataset = dataset_copy;
            return;
        }
        for (let i = 0; i < checkedBoxes.length; i++){
            let newArray = dataset.filter(function(d) {
                return d["major_event"] === checkedBoxes[i];
            });
            Array.prototype.push.apply(newData, newArray);
        }

        dataset = newData;
        draw();
        dataset = dataset_copy;
    }

const beeswarm = document.getElementById("bee_swarm_svg");
const lines = []; // array to keep track of created lines
const time_line = [];

beeswarm.addEventListener("click", function(event) {
    // Prevent the default context menu from appearing
    event.preventDefault();
  
    // Get the x-coordinate of the mouse click relative to the SVG element
    const x = event.clientX - beeswarm.getBoundingClientRect().left;

    // Check if there are already two lines on the SVG
    if (lines.length == 2)  {
      alert("You can only add two lines.");
      return;
    }
    console.log(formatTime(xScale.invert(x)));
    // Create a new line element
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  
    // Set the line's coordinates and styling
    line.setAttribute("x1", x);
    line.setAttribute("x2", x);
    line.setAttribute("y1", 0);
    line.setAttribute("y2", beeswarm.clientHeight);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "4");
  
    // Add the line to the SVG element
    
    // Add a right-click event listener to the line to remove it
    line.addEventListener("contextmenu", function(event) {
      event.preventDefault();
      //line.remove();
      beeswarm.removeChild(line); // remove the line from the SVG element
      time_line.splice(time_line.indexOf(line),1);
        lines.splice(lines.indexOf(line), 1); // remove the line from the lines array
        console.log(time_line);
    });
    beeswarm.appendChild(line);
    lines.push(line);
    time_line.push(formatTime(xScale.invert(x)));
    if(time_line.length == 2){
        //console.log(dataset);
        starttime = 20140123170000;
        endtime = 20140123213445;
        filtereddata1 = dataset.filter(function(d) {
            return d.date >= starttime && d.date < time_line[0];
        });
        filtereddata2 = dataset.filter(function(d) {
            return d.date >= time_line[0] && d.date < time_line[1];
        });
        filtereddata3 = dataset.filter(function(d) {
            return d.date >= time_line[1] && d.date <= endtime;
        });
        console.log(filtereddata1,filtereddata2,filtereddata3);
        //call piechart function
        //call word cloud
        //call bar chart
            
    }
  });

}


// document.addEventListener('DOMContentLoaded', function () {
// let svg_bee = d3.select("#bee_swarm_svg");
// //console.log(svg_bee.style('width'));
// const width_bee = +svg_bee.style('width').replace('px','');
// const height_bee = +svg_bee.style('height').replace('px','');
// const margin_bee = { top:50, bottom: 100, right: 30, left: 70 };
// const innerWidth_bee = width_bee - margin_bee.left - margin_bee.right;
// const innerHeight_bee = height_bee - margin_bee.top - margin_bee.bottom;
// const g = svg_bee.append('g')
//     .attr('transform', 'translate('+margin_bee.left+', '+margin_bee.top+')');
// let xScale_bee = d3.scaleTime()
//                // .domain(d3.extent(dates))
//                 .range([0, innerWidth_bee]);
// svg_bee.append("g").attr("class", "x axis").attr('transform',`translate(0,${innerHeight-100})`)
// let colors = d3.scaleOrdinal().domain(["hit_and_run", "fire", "pok_rally"])
//                                     .range(["orange","blue","red"]);
// d3.csv('data/csv-2001-2131.csv').then(function (data){
//     let dataset = data;
//     dataset.forEach(d=>{
//         d["date"] = +d["date"];
//     })
//     console.log(dataset);
//     const parseTime = d3.timeParse("%Y%m%d%H%M%S");
//     const dates = dataset.map(d => parseTime(d.date));
//     xScale_bee.domain(d3.extent(dates));
//     drawbeeswarm();

//     function drawbeeswarm(){
//         let xAxis;
//         xAxis = d3.axisBottom(xScale_bee);
//         d3.transition(g).select(".x.axis")
//             .transition()
//             .duration(1000)
//             .call(xAxis);
//     }
// })
// })