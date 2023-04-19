document.addEventListener('DOMContentLoaded', function () {
    let data;
    Promise.all([d3.csv('data/csv-1700-1830.csv'),d3.csv('data/csv-1831-2000.csv'),d3.csv('data/csv-2001-2131.csv')]).then(function (values){
        data = values[0].concat(values[1]).concat(values[2]);
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

    const dates = dataset.map(d => parseTime(d.date));
        
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
                .attr('transform',`translate(0,${innerHeight})`)
                .transition().duration(1000)
                .call(xAxis)
        let simulation = d3.forceSimulation(dataset)
                .force("x", d3.forceX(function(d) {
                    return xScale(parseTime(d.date));
            }).strength(2))
            .force("y", d3.forceY((height / 2) - margin.bottom / 2)) 
            .force("collide", d3.forceCollide(5))
            .stop();
            //simulation.tick(10);
        for (let i = 0; i < 5; ++i) {
            simulation.tick(10);  
        }

        let majoreventcircles = g.selectAll(".events")
                .data(dataset, function(d){return d["major_events"]});

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
            .attr("r", 3)
            .attr("fill", function(d){ return colors(d["major_event"])})
            .merge(majoreventcircles)
            .transition()
            .duration(2000)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

            d3.selectAll(".events").on("mouseover", function(event, d){
                //d3.select(this).style("color", "green");
               //tooltip.html("Time: " +parseTime(d.date) + "<br>");
               tooltip.html(d["major_event"]+": "+d.message + "<br>");
                console.log("hi")
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(event) {
                return tooltip.style("top", (event.pageY - 60) + "px")
                .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            });
    }
    function filter(){
        console.log(dataset);
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