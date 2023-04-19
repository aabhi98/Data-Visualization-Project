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

    const counts = Array.from(grouped_data1, ([sentiment, events]) => {
        return {
            sentiment: sentiment,
            count: events.length
        };
    });

    const colorScale = d3.scaleOrdinal()
        .domain(counts.map(d => d.sentiment))
        .range(['#6baed6', '#fd8d3c', '#74c476']);

    console.log("counts",counts);



    const pie = d3.pie()
        .value(d => d.count);

    console.log("colorScale",pie(counts));

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(200);

    const g = svg1.append('g')
        .attr('transform', `translate(200,200)`);

    // Draw the pie chart
    g.selectAll('path')
        .data(pie(counts))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.data.sentiment));



}