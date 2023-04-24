var csvData = []
var projection;
var currentLimit = 0;

document.addEventListener('DOMContentLoaded', function () {
    Promise.all([d3.csv('data/final_dataset.csv')]).then(function (data){
        csvData = data[0];
        drawPointMap();
    })

})

function drawPointMap() {
    console.log(csvData)
    csvData = csvData.filter(r => (r.latitude != '' && r.longitude != ''))
    const parseTime = d3.timeParse("%Y%m%d%H%M%S");
    csvData.forEach(r => {
        r.latitude = parseFloat(r.latitude)
        r.longitude = parseFloat(r.longitude)
        r.date = parseTime(r.date)
    })
    csvData.sort(r => r.date)
    console.log(csvData)
    d3.json("data/abila.geojson").then(geodata => {
        projection = d3.geoMercator()
  	        .fitExtent([[25, 25], [1000, 800]], geodata);
        
        let generator = d3.geoPath().projection(projection);

        const svg = d3.select("#point_map_svg")

        svg.append('g')
            .selectAll('path')
            .data(geodata.features)
            .enter().append('path')
            .attr('d', generator)
            .style('fill', '#ffffff')
            .style('stroke', '#000000')

        svg.append('rect')
        .attr("x", 820)
        .attr("y", 120)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "red");

        svg.append('text')
            .attr("x", 850)
            .attr("y", 135)
            .text("pok_rally")
            .style('font-size', '20px');

        svg.append('rect')
            .attr("x", 820)
            .attr("y", 150)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", "orange");
    
        svg.append('text')
                .attr("x", 850)
                .attr("y", 165)
                .text("hit_and_run")
                .style('font-size', '20px');

        svg.append('rect')
        .attr("x", 820)
        .attr("y", 180)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "blue");

        svg.append('text')
            .attr("x", 850)
            .attr("y", 195)
            .text("fire")
            .style('font-size', '20px');

            svg.append('rect')
        .attr("x", 820)
        .attr("y", 210)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "black");

        svg.append('text')
            .attr("x", 850)
            .attr("y", 225)
            .text("chatter/spam")
            .style('font-size', '20px');


        showPoints()

        d3.select("#timeSlider")
            .attr("value", currentLimit.toString())
    });
}

function showPoints() {
    console.log("Called", currentLimit)
    d3.select("#point_map_svg").selectAll("circle").remove()
    d3.select("#point_map_svg").selectAll("line").remove()
    pointData = csvData.filter(r => !r.message.includes("RT"))
    start = currentLimit

    var tooltip = d3.select("#point_map_message_info")
        // .append("div")
        // .style("position", "absolute")
        // .style("z-index", "10")
        .style("width", "175px")
        .style("height", "fit-content")
        .style("position", "absolute")
        // .style("bottom", "0")
        .style("right", "125px")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("padding", "8px 10px")
        // .style("border-radius", "8px")
        .style("text-align", "center")
        .style("font-size", "14px")
        .style("border", "1px solid lightgray")
        .style("text-anchor", "end")

    id = setInterval(_ => {
        let colors = d3.scaleOrdinal()
            .domain(["hit_and_run", "fire", "pok_rally", "unknown", "spam", "chatter"])
            .range(["orange","blue","red", "black", "black", "black"]);
        d3.select("#point_map_svg").append('g')
            .selectAll("circle")
            .data(pointData.slice(start, start + 10))
            .join(enter => 
                enter.append("circle")
                    .attr("transform", d => `translate(${projection([d.longitude, d.latitude])})`)
                    .attr("r", 4)
                    .style('fill', d => colors(d.major_event))
                    .style('opacity', 0.8)
                    .attr("id", "circle")
                    .attr("class", d => d.major_event + "_circle")
            )
            .on('mouseover', (event, d) => {
                console.log(d.id, d.message, d.major_event); 
                if(d.type === 'mbdata')
                    d3.selectAll('.' + d.author + '_line').attr('visibility', 'visible'); 
                d3.selectAll('.' + d.major_event + '_line').attr('visibility', 'visible');
                d3.selectAll('.' + d.major_event + '_circle').style('opacity', 1);
                tooltip.html(tooltipText(d));
                height = tooltip.node().getBoundingClientRect().height
                tooltip.style("visibility", "visible")
                tooltip.style("top", (event.layerY - (height / 2)) + "px");
            })
            .on('mouseout', (_, d) => {
                if(d.type === 'mbdata')
                    d3.selectAll('.' + d.author + '_line').attr('visibility', 'hidden');
                d3.selectAll('.' + d.major_event + '_line').attr('visibility', 'hidden');
                d3.selectAll('.' + d.major_event + '_circle').style('opacity', 0.8)
                tooltip.html("");
                tooltip.style("visibility", "hidden");
            })
            start += 10
        if (start > pointData.length)
            clearInterval(id)
    }, 100)

    authorGroupData = d3.groups(pointData.slice(currentLimit), d => d.author);
    authorGroupData = authorGroupData.filter(d => (d[1].length > 1) && (d[0] != ''))

    eventGroupData = d3.groups(pointData.slice(currentLimit), d => d.major_event);
    eventGroupData = eventGroupData.filter(d => (d[1].length > 1) && !(['unknown', 'chatter', 'spam'].includes(d[0])))

    drawLines(authorGroupData)
    drawLines(eventGroupData)
}

function tooltipText(d) {
    return `<b>Type: </b>${d.type == 'ccdata' ? 'Call Center Records' : 'Micro Blog Data'}<br>${d.type == 'mbdata' ? ('<b>Author: </b>' + d.author + '<br>') : ''}<b>Message: </b>${d.message}<br><b>Major Event: </b>${d.major_event}`
}

function playAnimation() {
    currentLimit = 0
    showPoints()
}

function changeCurrentLimit(event) {
    console.log(event.value);
    currentLimit = parseInt(event.value);
    showPoints()
}

function drawLines(lineData) {
    // console.log(lineData)
    for (let data of lineData) {
        for (let i = 0; i < data[1].length; i++) {
            if(i < data[1].length - 1) {
                // console.log(data[0])
                d3.select("#point_map_svg")
                    .append("line")
                    .style('stroke', 'maroon')
                    .style('stroke-width', '2')
                    .style('opacity', 0.6)
                    .attr('visibility', 'hidden')
                    .attr("class", data[0] + "_line")
                    .attr("x1", projection([data[1][i].longitude, data[1][i].latitude])[0])
                    .attr("y1", projection([data[1][i].longitude, data[1][i].latitude])[1])
                    .attr("x2", projection([data[1][i+1].longitude, data[1][i+1].latitude])[0])
                    .attr("y2", projection([data[1][i+1].longitude, data[1][i+1].latitude])[1])
            }
        } 
    }
}