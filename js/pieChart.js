document.addEventListener('DOMContentLoaded', function () {

    svg1 = d3.select('#pie_chart_svg_1');
    svg2 = d3.select('#pie_chart_svg_2');
    svg3 = d3.select('#pie_chart_svg_3');


    Promise.all([d3.csv('data/csv-1700-1830.csv',(d)=> {
        return {
            majorEvent: d.major_event,
            sentiment: d.sentiment
        };
    }),  d3.csv('data/csv-1831-2000.csv',(d)=> {
        return {
            majorEvent: d.major_event,
            sentiment: d.sentiment
        };
    }),  d3.csv('data/csv-2001-2131.csv',(d) => {
        return {
            majorEvent: d.major_event,
            sentiment: d.sentiment
        };
    })])
        .then(function (values) {
            console.log('loaded dataset');
            data1 = values[0];
            data1.forEach(d=>{
                d["sentiment"] = d["sentiment"].toLowerCase();
            })
            data2 = values[1];
            data1.forEach(d=>{
                d["sentiment"] = d["sentiment"].toLowerCase();
            })
            data3 = values[2];
            data1.forEach(d=>{
                d["sentiment"] = d["sentiment"].toLowerCase();
            })

            drawPieChart();
        });
});

function drawPieChart(){
    const checked = d3.selectAll("input[type='checkbox']:checked")
        .nodes()
        .map(checkbox => checkbox.value);
    filtered_data1 = data1.filter(c => checked.includes(c.majorEvent));
    filtered_data2 = data2.filter(c => checked.includes(c.majorEvent));
    filtered_data3 = data3.filter(c => checked.includes(c.majorEvent));

    const grouped_data1 = d3.group(filtered_data1, d => d.sentiment);

    const counts1 = Array.from(grouped_data1, ([sentiment, events]) => {
        return {
            sentiment: sentiment,
            count: events.length
        };
    });

    const colorScale = d3.scaleOrdinal()
        .domain(counts1.map(d => d.sentiment))
        .range(['#6baed6', '#fd8d3c', '#74c476']);

    const pie1 = d3.pie()
        .value(d => d.count);

    const arc1 = d3.arc()
        .innerRadius(0)
        .outerRadius(180);

    const labelArc1 = d3.arc()
        .innerRadius(90)
        .outerRadius(180);

    const g1 = svg1.append('g')
        .attr('transform', `translate(200,200)`);

    g1.selectAll('path')
        .data(pie1(counts1))
        .enter()
        .append('path')
        .attr('d', arc1)
        .attr('fill', d => colorScale(d.data.sentiment))
        .append("svg:title")
        .text(function(d) { return d.data.sentiment + ": " + d.data.count });

    g1.selectAll('text')
        .data(pie1(counts1))
        .enter()
        .append('text')
        .attr('transform', d => `translate(${labelArc1.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.data.sentiment);

    const grouped_data2 = d3.group(filtered_data2, d => d.sentiment);

    const counts2 = Array.from(grouped_data2, ([sentiment, events]) => {
        return {
            sentiment: sentiment,
            count: events.length
        };
    });

    const pie2 = d3.pie()
        .value(d => d.count);

    const arc2 = d3.arc()
        .innerRadius(0)
        .outerRadius(180);

    const labelArc2 = d3.arc()
        .innerRadius(90)
        .outerRadius(180);

    const g2 = svg2.append('g')
        .attr('transform', `translate(200,200)`);

    g2.selectAll('path')
        .data(pie2(counts2))
        .enter()
        .append('path')
        .attr('d', arc2)
        .attr('fill', d => colorScale(d.data.sentiment))
        .append("svg:title")
        .text(function(d) { return d.data.sentiment + ": " + d.data.count });

    g2.selectAll('text')
        .data(pie2(counts2))
        .enter()
        .append('text')
        .attr('transform', d => `translate(${labelArc2.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.data.sentiment);

    const grouped_data3 = d3.group(filtered_data3, d => d.sentiment);

    const counts3 = Array.from(grouped_data3, ([sentiment, events]) => {
        return {
            sentiment: sentiment,
            count: events.length
        };
    });

    const pie3 = d3.pie()
        .value(d => d.count);

    const arc3 = d3.arc()
        .innerRadius(0)
        .outerRadius(180);

    const labelArc3 = d3.arc()
        .innerRadius(90)
        .outerRadius(180);

    const g3 = svg3.append('g')
        .attr('transform', `translate(200,200)`);

    g3.selectAll('path')
        .data(pie3(counts3))
        .enter()
        .append('path')
        .attr('d', arc3)
        .attr('fill', d => colorScale(d.data.sentiment))
        .append("svg:title")
        .text(function(d) { return d.data.sentiment + ": " + d.data.count });

    g3.selectAll('text')
        .data(pie3(counts3))
        .enter()
        .append('text')
        .attr('transform', d => `translate(${labelArc3.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.data.sentiment);



}