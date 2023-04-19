var csvData = []

document.addEventListener('DOMContentLoaded', function () {
    Promise.all([d3.csv('data/csv-1700-1830.csv')]).then(function (data){
        csvData = data[0];
        drawPointMap();
    })

})

function drawPointMap() {
    console.log(csvData)
    csvData = csvData.filter(r => (r.latitude != '' && r.longitude != ''))
    csvData.forEach(r => {
        r.latitude = parseFloat(r.latitude)
        r.longitude = parseFloat(r.longitude)
    })
    console.log(csvData)
    d3.json("data/abila.geojson").then(geodata => {
        var projection = d3.geoMercator()
  	        .fitExtent([[25, 25], [800, 600]], geodata);
        
        let generator = d3.geoPath().projection(projection);

        d3.select("#point_map_svg").append('g').selectAll('path')
            .data(geodata.features)
            .enter().append('path')
           .attr('d', generator)
            .style('fill', '#ffffff')
            .style('stroke', '#000000')

        d3.select("#point_map_svg").append("g")
            .selectAll("circle")
            .data(csvData)
            .join("circle")
                .attr("transform", d => `translate(${projection([d.longitude, d.latitude])})`)
                .attr("r", 4)
                .style('fill', 'red')
                .attr("id", "circle")
    });
}