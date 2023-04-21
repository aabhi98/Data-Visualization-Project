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
    id = setInterval(_ => {
        let colors = d3.scaleOrdinal()
            .domain(["hit_and_run", "fire", "pok_rally", "unknown", "spam", "chatter"])
            .range(["orange","blue","red", "grey", "grey", "grey"]);
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
            .on('mouseover', (_, d) => {
                console.log(d.id, d.message, d.major_event); 
                if(d.type === 'mbdata')
                    d3.selectAll('.' + d.author + '_line').attr('visibility', 'visible'); 
                d3.selectAll('.' + d.major_event + '_line').attr('visibility', 'visible');
                d3.selectAll('.' + d.major_event + '_circle').style('opacity', 1)
            })
            .on('mouseout', (_, d) => {
                if(d.type === 'mbdata')
                    d3.selectAll('.' + d.author + '_line').attr('visibility', 'hidden');
                d3.selectAll('.' + d.major_event + '_line').attr('visibility', 'hidden');
                d3.selectAll('.' + d.major_event + '_circle').style('opacity', 0.8)
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
                    .style('stroke', 'cyan')
                    .style('stroke-width', '3')
                    .style('opacity', 0.75)
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