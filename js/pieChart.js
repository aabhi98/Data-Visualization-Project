// document.addEventListener('DOMContentLoaded', function () {
//
//     svg1 = d3.select('#pie_chart_svg_1');
//     svg2 = d3.select('#pie_chart_svg_2');
//     svg3 = d3.select('#pie_chart_svg_3');
//
//
//     Promise.all([d3.csv('data/csv-1700-1830.csv',(d)=> {
//         return {
//             majorEvent: d.major_event,
//             sentiment: d.sentiment
//         };
//     }),  d3.csv('data/csv-1831-2000.csv',(d)=> {
//         return {
//             majorEvent: d.major_event,
//             sentiment: d.sentiment
//         };
//     }),  d3.csv('data/csv-2001-2131.csv',(d) => {
//         return {
//             majorEvent: d.major_event,
//             sentiment: d.sentiment
//         };
//     })])
//         .then(function (values) {
//             console.log('loaded dataset');
//             data1 = values[0];
//             data1.forEach(d=>{
//                 d["sentiment"] = d["sentiment"].toLowerCase();
//             })
//             data2 = values[1];
//             data1.forEach(d=>{
//                 d["sentiment"] = d["sentiment"].toLowerCase();
//             })
//             data3 = values[2];
//             data1.forEach(d=>{
//                 d["sentiment"] = d["sentiment"].toLowerCase();
//             })
//
//             drawPieChart();
//         });
// });

function drawPieChart(data1, data2, data3) {
    // const checked = d3.selectAll("input[type='checkbox']:checked")
    //     .nodes()
    //     .map(checkbox => checkbox.value);
    // filtered_data1 = data1.filter(c => checked.includes(c.majorEvent));
    // filtered_data2 = data2.filter(c => checked.includes(c.majorEvent));
    // filtered_data3 = data3.filter(c => checked.includes(c.majorEvent));
    console.log(data1, data2, data3)
    const svg1 = d3.select('#pie_chart_svg_1');
    const svg2 = d3.select('#pie_chart_svg_2');
    const svg3 = d3.select('#pie_chart_svg_3');

    svg1.selectAll("g").remove();
    svg2.selectAll("g").remove();
    svg3.selectAll("g").remove();

    if(data1 != null && data1.length !==0){
        const grouped_data1 = d3.group(data1, d => d.sentiment);

        const counts1 = Array.from(grouped_data1, ([sentiment, events]) => {
            return {
                sentiment: sentiment,
                count: events.length
            };
        });

        const totalCount1 = counts1.reduce((acc, curr) => acc + curr.count, 0);

        // d3.select("#checkboxes").selectAll("input").on("change", filter);

        fcp = counts1.filter(d => d.sentiment === 'positive')
        fcn = counts1.filter(d => d.sentiment === 'negative')
        fcu = counts1.filter(d => d.sentiment === 'neutral')
        const positiveCount1 = fcp.length > 0 ? fcp[0].count : 0;
        const negativeCount1 = fcn.length > 0 ? fcn[0].count : 0;
        const neutralCount1 = fcu.length > 0 ? fcu[0].count : 0;


        const positivePercentage1 = +(positiveCount1 / totalCount1 * 100).toFixed(2);
        const negativePercentage1 = +(negativeCount1 / totalCount1 * 100).toFixed(2);
        const neutralPercentage1 = +(neutralCount1 / totalCount1 * 100).toFixed(2);



        const colorScale = d3.scaleOrdinal()
            .domain(counts1.map(d => d.sentiment))
            .range(['green', 'orange', 'red']);

        const pie1 = d3.pie()
            .value(d => d.count);

        const arc1 = d3.arc()
            .innerRadius(0)
            .outerRadius(150);

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
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .append("svg:title")
            .text(function (d) { return d.data.sentiment + ": " + d.data.count });

        g1.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', arc1.outerRadius())
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        const legend1 = svg1.append('g')
            .attr('transform', 'translate(230, 10)');

        legend1.append('text')
            .attr('x', -120)
            .attr('y', 20)
            .text('Sentiment Analysis')
            .style('font-size', '20px');

        legend1.append('circle')
            .attr('cx', -210)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'green');

        legend1.append('text')
            .attr('x', -200)
            .attr('y', 365)
            .text('positive' + ' ' + positivePercentage1 + '%')
            .style('font-size', '14px');

        legend1.append('circle')
            .attr('cx', -85)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'red');

        legend1.append('text')
            .attr('x', -75)
            .attr('y', 365)
            .text('negative' + ' ' + negativePercentage1 + '%')
            .style('font-size', '14px');

        legend1.append('circle')
            .attr('cx', 40)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'orange');

        legend1.append('text')
            .attr('x', 50)
            .attr('y', 365)
            .text('neutral' + ' ' + neutralPercentage1 + '%')
            .style('font-size', '14px');
    }

    if(data2!=null && data2.length !==0){
        const grouped_data2 = d3.group(data2, d => d.sentiment);

        const counts2 = Array.from(grouped_data2, ([sentiment, events]) => {
            return {
                sentiment: sentiment,
                count: events.length
            };
        });

        const totalCount2 = counts2.reduce((acc, curr) => acc + curr.count, 0);


        console.log("data2",data2);
        const positiveCount2 = counts2.filter(d => d.sentiment === 'positive')[0].count;
        const negativeCount2 = counts2.filter(d => d.sentiment === 'negative')[0].count;
        const neutralCount2 = counts2.filter(d => d.sentiment === 'neutral')[0].count;


        const positivePercentage2 = +(positiveCount2 / totalCount2 * 100).toFixed(2);
        const negativePercentage2 = +(negativeCount2 / totalCount2 * 100).toFixed(2);
        const neutralPercentage2 = +(neutralCount2 / totalCount2 * 100).toFixed(2);

        const colorScale = d3.scaleOrdinal()
            .domain(counts2.map(d => d.sentiment))
            .range(['green', 'orange', 'red']);

        const pie2 = d3.pie()
            .value(d => d.count);

        const arc2 = d3.arc()
            .innerRadius(0)
            .outerRadius(150);

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
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .append("svg:title")
            .text(function (d) { return d.data.sentiment + ": " + d.data.count });

        g2.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', arc2.outerRadius())
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        const legend2 = svg2.append('g')
            .attr('transform', 'translate(230, 10)');

        legend2.append('text')
            .attr('x', -120)
            .attr('y', 20)
            .text('sentimental analysis')
            .style('font-size', '20px');

        legend2.append('circle')
            .attr('cx', -210)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'green');

        legend2.append('text')
            .attr('x', -200)
            .attr('y', 365)
            .text('positive' + ' ' + positivePercentage2 + '%')
            .style('font-size', '14px');

        legend2.append('circle')
            .attr('cx', -85)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'red');

        legend2.append('text')
            .attr('x', -75)
            .attr('y', 365)
            .text('negative' + ' ' + negativePercentage2 + '%')
            .style('font-size', '14px');

        legend2.append('circle')
            .attr('cx', 40)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'orange');

        legend2.append('text')
            .attr('x', 50)
            .attr('y', 365)
            .text('neutral' + ' ' + neutralPercentage2 + '%')
            .style('font-size', '14px');
    }


    if(data3 != null && data3.length !==0){
        const grouped_data3 = d3.group(data3, d => d.sentiment);

        const counts3 = Array.from(grouped_data3, ([sentiment, events]) => {
            return {
                sentiment: sentiment,
                count: events.length
            };
        });

        const totalCount3 = counts3.reduce((acc, curr) => acc + curr.count, 0);


        const positiveCount3 = counts3.filter(d => d.sentiment === 'positive')[0].count;
        const negativeCount3 = counts3.filter(d => d.sentiment === 'negative')[0].count;
        const neutralCount3 = counts3.filter(d => d.sentiment === 'neutral')[0].count;


        const positivePercentage3 = +(positiveCount3 / totalCount3 * 100).toFixed(2);
        const negativePercentage3 = +(negativeCount3 / totalCount3 * 100).toFixed(2);
        const neutralPercentage3 = +(neutralCount3 / totalCount3 * 100).toFixed(2);

        const colorScale = d3.scaleOrdinal()
            .domain(counts3.map(d => d.sentiment))
            .range(['green', 'orange', 'red']);

        const pie3 = d3.pie()
            .value(d => d.count);

        const arc3 = d3.arc()
            .innerRadius(0)
            .outerRadius(150);

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
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .append("svg:title")
            .text(function (d) { return d.data.sentiment + ": " + d.data.count });

        g3.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', arc3.outerRadius())
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        const legend3 = svg3.append('g')
            .attr('transform', 'translate(230, 10)');

        legend3.append('text')
            .attr('x', -120)
            .attr('y', 20)
            .text('sentimental analysis')
            .style('font-size', '20px');

        legend3.append('circle')
            .attr('cx', -210)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'green');

        legend3.append('text')
            .attr('x', -200)
            .attr('y', 365)
            .text('positive' + ' ' + positivePercentage3 + '%')
            .style('font-size', '14px');

        legend3.append('circle')
            .attr('cx', -85)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'red');

        legend3.append('text')
            .attr('x', -75)
            .attr('y', 365)
            .text('negative' + ' ' + negativePercentage3 + '%')
            .style('font-size', '14px');

        legend3.append('circle')
            .attr('cx', 40)
            .attr('cy', 360)
            .attr('r', 5)
            .attr('fill', 'orange');

        legend3.append('text')
            .attr('x', 50)
            .attr('y', 365)
            .text('neutral' + ' ' + neutralPercentage3 + '%')
            .style('font-size', '14px');
    }

}

function resetPieGraph() {
    d3.select('#pie_chart_svg_1').selectAll('g').remove();
    d3.select('#pie_chart_svg_2').selectAll('g').remove();
    d3.select('#pie_chart_svg_3').selectAll('g').remove();
}