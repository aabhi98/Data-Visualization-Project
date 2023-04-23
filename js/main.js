var lines = []; // array to keep track of created lines
var time_line = [];
var beeswarm = d3.select("#bee_swarm_svg")
var parseTime = d3.timeParse("%Y%m%d%H%M%S");
var swarmDataset;

document.addEventListener('DOMContentLoaded', function () {
    // let data;
    //Promise.all([d3.csv('data/csv-1700-1830.csv'),d3.csv('data/csv-1831-2000.csv'),d3.csv('data/csv-2001-2131.csv')]).then(function (values){
    Promise.all([d3.csv('data/final_dataset.csv')]).then(function (values) {
        let data = values[0]//.concat(values[1]).concat(values[2]);

        data.forEach(d => {
            d["date"] = +d["date"];
            d["major_event"] = d["major_event"].toLowerCase();
            d["sentiment"] = d["sentiment"].toLowerCase();
        })
        console.log("data", data);
        // let data2 = [];
        swarmDataset = [...data.filter(d => d["major_event"].includes("pok_rally") || d["major_event"].includes("fire") || d["major_event"].includes("hit_and_run"))]
        // console.log(data2);
        drawbeeswarm1();
        createArcDiagram();
        createSplineGraph([...data]);
    })
})

function drawbeeswarm1() {
    //console.log(dataset);
    const width = +beeswarm.style('width').replace('px', '');
    const height = +beeswarm.style('height').replace('px', '');
    const margin = { top: 50, bottom: 70, right: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.bottom;
    const g = beeswarm.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    const dates = swarmDataset.map(d => parseTime(d.date));
    //console.log(d3.max(dataset, d=>d.date));
    var xScale = d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, innerWidth]);

    let messageMap = {};
    swarmDataset.forEach(r => {
        let actualMessage = r.message.replace(/RT @([a-z]|[A-Z]|[0-9])+\s/, "")
        if (!messageMap.hasOwnProperty(actualMessage))
            messageMap[actualMessage] = 1
        else
            messageMap[actualMessage] += 1
    })

    swarmDataset = swarmDataset.filter(r => !r.message.includes("RT @"))

    swarmDataset.map(r => {
        let actualMessage = r.message.replace(/RT @([a-z]|[A-Z]|[0-9])+\s/, "")
        r.count = messageMap[actualMessage]
        r.x = xScale(parseTime(r.date))
        r.y = ((height / 2) - margin.bottom / 2)
    })

    let tweetFrequencyDomain = d3.extent(swarmDataset.map((d) => +d.count));
    let size = d3.scaleSqrt().domain(tweetFrequencyDomain).range([7.5, 15]);

    swarmDataset.map(r => { r.r = size(r.count); r.date = parseTime(r.date)})

    console.log(swarmDataset)

    var tooltip = d3.select("#bee_swarm_div")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("padding", "8px")
        .style("border-radius", "8px")
        .style("width", "fit-content")
        .style("font-size", "14px")
        .style("border", "2px solid black")

    let colors = d3.scaleOrdinal().domain(["hit_and_run", "fire", "pok_rally"])
        .range(["orange", "blue", "red"]);

    draw();

    d3.select("#checkboxes").selectAll("input").on("change", triggerMultipleFunctions);

    function triggerMultipleFunctions() {
        filter();
        resetFrameLines()
    }

    function resetFrameLines() {
        d3.selectAll(".frameLine").remove();
        lines = []
        time_line = []
        drawFrameLines([xScale(parseTime('20140123183000')), xScale(parseTime('20140123200000'))])
        changeData(swarmDataset);
        resetPieGraph()
        resetBarGraph()
    }

    function draw() {
        xAxis = d3.axisBottom(xScale);
        xAxis = d3.axisBottom(xScale);
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .transition().duration(1000)
            .call(xAxis)
        let simulation = d3.forceSimulation(swarmDataset)
            .force("x", d3.forceX(d => d.x).strength(2))
            .force("y", d3.forceY(d => d.y))
            .force("collide", d3.forceCollide(12))
            .stop();
        //simulation.tick(10);
        for (let i = 0; i < 10; ++i) {
            simulation.tick(10);
        }

        let majoreventcircles = g.selectAll(".events")
            //.data(swarmDataset);
            .data(swarmDataset, function (d) { return d["major_event"] });

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
            .attr("fill", function (d) { return colors(d["major_event"]) })
            .style("opacity", 0.7)
            .merge(majoreventcircles)
            .transition()
            .duration(2000)
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });

        d3.selectAll(".events")
            .on("mouseover", function (_, d) {
                console.log(d)
                tooltip.html(`@${d.author} : ${d.message}`);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function (event) {
                return tooltip.style("top", (event.pageY - 60) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        for (let x of [xScale(parseTime('20140123183000')), xScale(parseTime('20140123200000'))]) {
            drawFrameLines(x, xScale)
        }
        changeData(swarmDataset);
    }
}

function drawFrameLines(x, xScale) {
    let line = beeswarm.append("line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", innerHeight + 10)
        .attr("class", "frameLine")
        .style("stroke", "black")
        .style("stroke-width", 4)

    lines.push(line.node());
    time_line.push(xScale.invert(x));
    line.call(dragHandler(xScale, swarmDataset))

    line.on("click", function (e) {
        if (e.target.nodeName === 'line') {
            idx = lines.indexOf(this)
            console.log(lines, idx, this)
            lines.splice(idx, 1)
            time_line.splice(idx, 1)
            console.log(lines.length)
            e.target.remove()
        }
    })
}

function filter() {
    //console.log(dataset);
    dataset_copy = swarmDataset;
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
        swarmDataset = newData;
        draw();
        swarmDataset = dataset_copy;
        return;
    }
    for (let i = 0; i < checkedBoxes.length; i++) {
        let newArray = swarmDataset.filter(function (d) {
            return d["major_event"] === checkedBoxes[i];
        });
        Array.prototype.push.apply(newData, newArray);
    }

    swarmDataset = newData;
    draw();
    swarmDataset = dataset_copy;
}

var dragHandler = (xScale, dataset) => d3.drag()
    .on("drag", function (event) {
        console.log(event)
        idx = lines.indexOf(this)
        firstLine = true;
        if (idx == 0) {
            otherLineX = d3.select(lines[1]).attr("x1")
        } else {
            firstLine = false;
            otherLineX = d3.select(lines[0]).attr("x1")
        }
        if (firstLine && event.x >= otherLineX) {
            dragHandler.on("drag", null);
            alert("Start Line can not be placed after End Line")
        } else if (!firstLine && event.x <= otherLineX) {
            dragHandler.on("drag", null);
            alert("End Line can not be placed before Start Line")
        } else {
            let line = d3.select(this)
            line.attr("x1", (parseInt(line.attr("x1")) + event.dx))
            line.attr("x2", (parseInt(line.attr("x2")) + event.dx))
            lines[idx] = line.node()
            time_line[idx] = xScale.invert(line.attr("x1"))
            changeData(swarmDataset);
        }
    });

beeswarm.on("click", (event, d) => {
    // console.log(event.target.nodeName)
    if (event.target.nodeName === 'svg') {
        const x = event.clientX - beeswarm.node().getBoundingClientRect().left;
        if (lines.length == 2) {
            alert("You can only add two lines.");
            return;
        }
        drawFrameLines(x, xScale)
        changeData(swarmDataset);
    }
})

function changeData(dataset) {
    if (time_line.length == 2) {
        console.log(dataset, time_line);
        let starttime = parseTime('20140123170000');
        let endtime = parseTime('20140123213445');
        filtereddata1 = dataset.filter(function (d) {
            return d.date >= starttime && d.date < time_line[0];
        });
        console.log(filtereddata1);
        filtereddata2 = dataset.filter(function (d) {
            return d.date >= time_line[0] && d.date < time_line[1];
        });
        console.log(filtereddata2);
        filtereddata3 = dataset.filter(function (d) {
            return d.date >= time_line[1] && d.date <= endtime;
        });
        console.log(filtereddata3);
        drawPieChart(filtereddata1, filtereddata2, filtereddata3)
        drawBars(filtereddata1, filtereddata2, filtereddata3)
    }
}

function createArcDiagram() {

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 10, left: 150 },
        width = 1100 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#arc_diagram_svg")
        .attr("viewBox", [0, 0, width + 90, height + 80])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Read dummy data
    d3.json("data/final_dataset.json").then(function (data) {

        // List of node names
        const allNodes = data.nodes.map(d => d.name)

        // List of groups
        let allGroups = data.nodes.map(d => d.grp)
        allGroups = [...new Set(allGroups)]

        // A color scale for groups:
        const color = d3.scaleOrdinal()
            .domain(allGroups)
            .range(d3.schemeSet3);

        // A linear scale for node size
        const size = d3.scaleLinear()
            .domain([1, 10])
            .range([0.5, 8]);

        // A linear scale to position the nodes on the X axis
        const x = d3.scalePoint()
            .range([0, width])
            .domain(allNodes)

        // In my input data, links are provided between nodes -id-, NOT between node names.
        // So I have to do a link between this id and the name
        const idToNode = {};
        data.nodes.forEach(function (n) {
            idToNode[n.id] = n;
        });

        // Add the links
        const links = svg
            .selectAll('mylinks')
            .data(data.links)
            .join('path')
            .attr('d', d => {
                start = x(idToNode[d.source.toLowerCase()].name)    // X position of start node on the X axis
                end = x(idToNode[d.target.toLowerCase()].name)      // X position of end node
                return ['M', start, height - 30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                    'A',                            // This means we're gonna build an elliptical arc
                    (start - end) / 2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                    (start - end) / 2, 0, 0, ',',
                    start < end ? 1 : 0, end, ',', height - 30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
                    .join(' ');
            })
            .style("fill", "none")
            .attr("stroke", "grey")
            .style("stroke-width", 1)

        // Add the circle for the nodes
        const nodes = svg
            .selectAll("mynodes")
            .data(data.nodes.sort((a, b) => { +b.n - +a.n }))
            .join("circle")
            .attr("cx", d => x(d.name))
            .attr("cy", height - 30)
            .attr("r", d => size(d.n))
            .style("fill", d => color(d.grp))
            .attr("stroke", "black")

        // And give them a label
        const labels = svg
            .selectAll("mylabels")
            .data(data.nodes)
            .join("text")
            .attr("x", 0)
            .attr("y", 0)
            .text(d => d.name)
            .style("text-anchor", "end")
            .attr("transform", d => `translate(${x(d.name)},${height - 15}) rotate(-45)`)
            .style("font-size", 6)

        // Add the highlighting functionality
        nodes.on('mouseover', function (event, d) {

            // Highlight the nodes: every node is green except of him
            nodes.style('opacity', .2)
            d3.select(this).style('opacity', 1)

            // Highlight the connections
            links
                .style('stroke', a => a.source.toLowerCase() === d.id || a.target.toLowerCase() === d.id ? color(d.grp) : '#b8b8b8')
                .style('stroke-opacity', a => a.source.toLowerCase() === d.id || a.target.toLowerCase() === d.id ? 1 : .2)
                .style('stroke-width', a => a.source.toLowerCase() === d.id || a.target.toLowerCase() === d.id ? 4 : 1)
            labels
                .style("font-size", b => b.name === d.name ? 18.9 : 2)
                .attr("y", b => b.name === d.name ? 10 : 0)
        })
            .on('mouseout', d => {
                nodes.style('opacity', 1)
                links
                    .style('stroke', 'grey')
                    .style('stroke-opacity', .8)
                    .style('stroke-width', '1')
                labels
                    .style("font-size", 6)
            })
    })
}

function createSplineGraph(data) {
    console.log(data)
    data.forEach(function (d) {
        if (d.sentiment == "neutral") {
            d.sentiment_score = 0;
        } else if (d.sentiment == "positive") {
            d.sentiment_score = 1;
        } else if (d.sentiment == "negative") {
            d.sentiment_score = -1;
        }
    });
    console.log("spline data", data);
    var margin = { top: 20, right: 20, bottom: 30, left: 300 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([-1, 1])
        .range([height, 0]);

    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.sentiment_score); });

    var svg = d3.select("#spline_graph_svg")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var filteredData = data.filter(function (d) {
        return !isNaN(d.sentiment_score);
    });

    svg.append("path")
        .datum(filteredData)
        .attr("class", "line")
        .attr("d", line);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
}
