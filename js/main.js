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
    const svg_beeswarm = d3.select("#bee_swarm_svg");
    const width = +svg_beeswarm.style('width').replace('px','');
    const height = +svg_beeswarm.style('height').replace('px','');
    const margin = { top:50, bottom: 100, right: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.bottom;
    //svg.selectAll('g').remove();
    const g = svg_beeswarm.append('g')
        .attr('transform', 'translate('+margin.left+', '+margin.top+')');

    const parseTime = d3.timeParse("%Y%m%d%H%M%S");
    const formatTime = d3.timeFormat("%Y%m%d%H%M%S");
    const dates = dataset.map(d => parseTime(d.date));
    //console.log(d3.max(dataset, d=>d.date));
    const xScale = d3.scaleTime()
                .domain(d3.extent(dates))
                .range([0, innerWidth]);

    let messageMap = {};
    dataset.forEach(r => {
        let actualMessage = r.message.replace(/RT @([a-z]|[A-Z]|[0-9])+\s/, "")
        if (!messageMap.hasOwnProperty(actualMessage))
            messageMap[actualMessage] = 1
        else
            messageMap[actualMessage] += 1
    })

    dataset = dataset.filter(r => !r.message.includes("RT @"))
    
    dataset.map(r => {
        let actualMessage = r.message.replace(/RT @([a-z]|[A-Z]|[0-9])+\s/, "")
        r.count = messageMap[actualMessage]
        r.x = xScale(parseTime(r.date))
        r.y = ((height / 2) - margin.bottom / 2)
    })

    let tweetFrequencyDomain = d3.extent(dataset.map((d) => +d.count));
    let size = d3.scaleSqrt().domain(tweetFrequencyDomain).range([7.5, 15]);

    dataset.map(r => r.r = size(r.count))

    console.log(dataset)
    
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
        xAxis = d3.axisBottom(xScale);
        g.append('g')
                .attr('transform',`translate(0,${innerHeight+20})`)
                .transition().duration(1000)
                .call(xAxis)
        let simulation = d3.forceSimulation(dataset)
            .force("x", d3.forceX(d => d.x).strength(2))
            .force("y", d3.forceY(d => d.y)) 
            .force("collide", d3.forceCollide(12))
            .stop();
            //simulation.tick(10);
        for (let i = 0; i < 10; ++i) {
            simulation.tick(10);  
        }

        let majoreventcircles = g.selectAll(".events")
                //.data(dataset);
                .data(dataset, function(d){ return d["major_event"]});

        majoreventcircles.exit()
            .transition()
            .duration(1000)
            .attr("cx", 0)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .remove();

        majoreventcircles.enter()
            .append("circle")
            .attr("class", "events")
            .attr("cx", 0)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .attr("fill", function(d){ return colors(d["major_event"])})
            .style("opacity", 0.7)
            .merge(majoreventcircles)
            .transition()
            .duration(2000)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

            d3.selectAll(".events").on("mouseover", function(_, d){
               tooltip.html(d["author"]+": "+d.message + "<br>");
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(event) {
                return tooltip.style("top", (event.pageY - 60) + "px")
                .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
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

    // function dodge(data) {
    //     // console.log(data)
    //     let padding = 1.5
    //     // console.log((height / 2) - margin.bottom / 2)
    //     let yVal = (height / 2) - margin.bottom / 2
    //     const circles = data.map(d => ({x: xScale(parseTime(d.date)), y: yVal, r: size(d.count), data: d})).sort((a, b) => b.r - a.r);
    //     const epsilon = 1e-3;
    //     let head = null, tail = null, queue = null;

    //     // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
    //     function intersects(x, y, r) {
    //         let a = head;
    //         while (a) {
    //             const radius2 = (a.r + r + padding) ** 2;
    //             if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
    //                 return true;
    //             }
    //             a = a.next;
    //         }
    //         return false;
    //     }

    //     // Place each circle sequentially.
    //     for (const b of circles) {
    //         // Choose the minimum non-intersecting tangent.
    //         if (intersects(b.x, b.y = b.r, b.r)) {
    //         let a = head;
    //         b.y = Infinity;
    //         do {
    //             let y = a.y + Math.sqrt((a.r + b.r + padding) ** 2 - (a.x - b.x) ** 2);
    //             if (y < b.y && !intersects(b.x, y, b.r)) b.y = y;
    //             a = a.next;
    //         } while (a);
    //         }

    //         // Add b to the queue.
    //         b.next = null;
    //         if (head === null) {
    //             head = tail = b;
    //             queue = head;
    //         } else
    //             tail = tail.next = b;
    //     }

    //     return circles;
    // }

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