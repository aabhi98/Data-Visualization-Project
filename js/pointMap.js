var csvData = []
var projection;
var currentLimit = 0;

document.addEventListener('DOMContentLoaded', function () {
    currentLimit = 0
    Promise.all([d3.csv('data/final_dataset.csv')]).then(function (data) {
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
        .style("width", "175px")
        .style("height", "fit-content")
        .style("position", "absolute")
        .style("right", "2.5%")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("padding", "8px 10px")
        .style("text-align", "center")
        .style("font-size", "14px")
        .style("border", "1px solid lightgray")
        .style("text-anchor", "end")

    let colors = d3.scaleOrdinal()
        .domain(["hit_and_run", "fire", "pok_rally", "unknown", "spam", "chatter"])
        .range(["orange", "blue", "red", "black", "black", "black"]);

    id = setInterval(_ => {
        d3.select("#point_map_svg").append('g')
            .attr("class", "message_circles")
            .selectAll("circle")
            .data(pointData.slice(start, start + 10))
            .join(enter =>
                enter.append("circle")
                    .attr("transform", d => `translate(${projection([d.longitude, d.latitude])})`)
                    .attr("r", 4)
                    .style('fill', d => colors(d.major_event))
                    .style('opacity', 0.8)
                    .attr("class", d => d.major_event + "_circle")
            )
            .on('mouseover', (event, d) => {
                console.log(projection([d.longitude, d.latitude]), event);
                if (d.type === 'mbdata')
                    d3.selectAll('.' + d.author + '_line').attr('visibility', 'visible');
                d3.selectAll('.' + d.major_event + '_line').attr('visibility', 'visible');
                d3.selectAll('.' + d.major_event + '_circle').style('opacity', 1);
                tooltip.html(tooltipText(d));
                height = tooltip.node().getBoundingClientRect().height
                tooltip.style("visibility", "visible")
                tooltip.style("top", (event.layerY - (height / 2)) + "px");
            })
            .on('mouseout', (_, d) => {
                if (d.type === 'mbdata')
                    d3.selectAll('.' + d.author + '_line').attr('visibility', 'hidden');
                d3.selectAll('.' + d.major_event + '_line').attr('visibility', 'hidden');
                d3.selectAll('.' + d.major_event + '_circle').style('opacity', 0.8)
                tooltip.html("");
                tooltip.style("visibility", "hidden");
            })
        start += 10
        if (start > pointData.length) {
            clearInterval(id)
        }
    }, 100)

    authorGroupData = d3.groups(pointData.slice(currentLimit), d => d.author);
    authorGroupData = authorGroupData.filter(d => (d[1].length > 1) && (d[0] != ''))

    eventGroupData = d3.groups(pointData.slice(currentLimit), d => d.major_event);
    eventGroupData = eventGroupData.filter(d => (d[1].length > 1) && !(['unknown', 'chatter', 'spam'].includes(d[0])))

    drawLines(authorGroupData)
    drawLines(eventGroupData)
    // drawHitAndRunLines()
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
            if (i < data[1].length - 1) {
                // console.log(data[0])
                d3.select("#point_map_svg")
                    .append("line")
                    .style('stroke', 'maroon')
                    // .style("stroke-dasharray", ("3, 4.5"))
                    .style('stroke-width', '2')
                    .style('opacity', 0.6)
                    .attr('visibility', 'hidden')
                    .attr("class", data[0] + "_line")
                    .attr("x1", projection([data[1][i].longitude, data[1][i].latitude])[0])
                    .attr("y1", projection([data[1][i].longitude, data[1][i].latitude])[1])
                    .attr("x2", projection([data[1][i + 1].longitude, data[1][i + 1].latitude])[0])
                    .attr("y2", projection([data[1][i + 1].longitude, data[1][i + 1].latitude])[1])
            }
        }
    }
}

function drawHitAndRunLines() {
    d3.select("#point_map_svg").selectAll(".message_circles").attr("visibility", "hidden")
    let colors = d3.scaleOrdinal()
        .domain(["hit_and_run", "fire", "pok_rally", "unknown", "spam", "chatter"])
        .range(["orange", "blue", "red", "black", "black", "black"]);

    eventCircles = [{
        x: 360.999197,
        y: 677.146869,
        r: 28,
        major_event: 'pok_rally'
    },
    {
        x: 798.0216162133729,
        y: 579.6049628732144,
        r: 18,
        major_event: 'hit_and_run'
    },
    {
        x: 823.243391,
        y: 563.489779,
        r: 14,
        major_event: 'fire'
    },
    {
        x: 399.203352,
        y: 566.443432,
        r: 18,
        major_event: 'hit_and_run'
    },
    {
        x: 878.258283,
        y: 658.198835,
        r: 33,
        major_event: 'hit_and_run'
    }]

    let elem = d3.select("#point_map_svg").append('g')
        .attr("class", "event_circles")
        .selectAll("circle")
        .data(eventCircles)
    let elemEnter = elem.enter()
        .append("g")
    
    elemEnter.append("circle")
        // .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .style('fill', d => colors(d.major_event))
        .style('opacity', 0.5)
    
    elemEnter.append("text")
        .text(d => d.major_event)
        .attr("x", d => d.x)
        .attr("y", d => (d.y + d.r + 10))
        .attr("text-anchor", "middle")
        .style("font-size", 16)

    hitAndRunPoints = [
        {
            x: 798.021616,
            y: 579.604962
        },
        {
            x: 796.218035,
            y: 594.506208
        },
        {
            x: 898.307524,
            y: 636.599034
        },
        {
            x: 858.209042,
            y: 679.798637
        },
        {
            x: 638.149475,
            y: 691.036710
        },
        {
            x: 393.123356,
            y: 689.633711
        },
        {
            x: 393.123356,
            y: 560.550158
        }
    ]

    console.log(hitAndRunPoints)
    for(let i = 1; i < hitAndRunPoints.length; i++) {
        console.log(hitAndRunPoints[i-1], hitAndRunPoints[i])
        line = d3.select("#point_map_svg")
            .append("line")
            .style('stroke', 'green')
            .style('stroke-width', '5')
            .style('opacity', 0.6)
            .attr("class", "har_lines")
            .attr("x1", hitAndRunPoints[i-1].x)
            .attr("y1", hitAndRunPoints[i-1].y)
            .attr("x2", hitAndRunPoints[i].x)
            .attr("y2", hitAndRunPoints[i].y)
        
        var totalLength = line.node().getTotalLength();
        line
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .delay(i * 1000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
    }

    d3.select("#point_map_message_info")
        .html("Track the progress of the van causing the hit and run and a standoff latter. The first orange circle indicates the dwelling of perpetrators from where they started. The second circle indicates the location of hit and run. The third circle indicates the location of hostage and standoff by the same perpetrators")
        .attr("visibility", "visible")
        .attr("top", 650)
        .attr("right", "2.5%")
    
    setTimeout(_ => {
        d3.select("#point_map_svg").selectAll(".event_circles").remove();
        d3.select("#point_map_svg").selectAll(".har_lines").remove();
        d3.select("#point_map_svg").selectAll(".message_circles").attr("visibility", "visible")
        d3.select("#point_map_message_info")
            .html("")
            .attr("visibility", "hidden")
    }, 10000)
}