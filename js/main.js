document.addEventListener('DOMContentLoaded', function () {
    let data;
    Promise.all([d3.csv('data/sample.csv')]).then(function (values){
        data = values[0];
        console.log(data);
        //drawbeeswarm(data);
    })

})
function drawbeeswarm(dataset){
    const svg = d3.select("#bee_swarm_svg");
    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');
    const margin = { top:50, bottom: 100, right: 30, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    svg.selectAll('g').remove();
    const g = svg.append('g')
        .attr('transform', 'translate('+margin.left+', '+margin.top+')');

    const parseTime = d3.timeParse("%d/%m/%Y %H:%M:%S");

    const dates = dataset.map(d => parseTime(d.date));
        
    const xScale = d3.scaleTime()
                .domain(d3.extent(dates))
                .range([0, innerWidth]);
}