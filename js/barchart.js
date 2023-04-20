
bar_svg_width=400
bar_svg_height=400
bar_svg_margin=10
bar_height=350

document.addEventListener('DOMContentLoaded', function () {

    bar_svg1 = d3.select('#bar_chart_svg_1');
    bar_svg2 = d3.select('#bar_chart_svg_2');
    bar_svg3 = d3.select('#bar_chart_svg_3');


    Promise.all([d3.csv('data/csv-1700-1830.csv',(d)=> {
        return {
            majorEvent: d.major_event,
            author: d.author,
            sentiment: d.sentiment
        };
    }),  d3.csv('data/csv-1831-2000.csv',(d)=> {
        return {
            majorEvent: d.major_event,
            author: d.author,
            sentiment: d.sentiment
        };
    }),  d3.csv('data/csv-2001-2131.csv',(d) => {
        return {
            majorEvent: d.major_event,
            author: d.author,
            sentiment: d.sentiment
        };
    })])
        .then(function (values) {
            console.log('loaded dataset');
            bar_data1 = values[0];

            bar_data2 = values[1];

            bar_data3 = values[2];


            drawBarChart(bar_data1, bar_data2, bar_data3);
        });
});

function drawBarChart(list1, list2, list3) {
    const checked = d3.selectAll("input[type='checkbox']:checked")
        .nodes()
        .map(checkbox => checkbox.value);
    console.log(checked)
    filtered_bar_data1 = list1.filter(c => checked.includes(c.majorEvent));
    filtered_bar_data2 = list2.filter(c => checked.includes(c.majorEvent));
    filtered_bar_data3 = list3.filter(c => checked.includes(c.majorEvent));

    drawEachBarChart(filtered_bar_data1, bar_svg1)
    drawEachBarChart(filtered_bar_data2, bar_svg2)
    drawEachBarChart(filtered_bar_data3, bar_svg3)

}

function drawEachBarChart(bar_data, barSvg) {

    const grouped_bar_data = d3.group(bar_data, d => d.author);

    const counts = Array.from(grouped_bar_data, ([author, events, sentiments]) => {
        return {
            author: author,
            count: events.length,
        };
    });

    counts.sort((a, b) => b.count - a.count);

    console.log("bar-counts",counts);

    top_six=counts.slice(0,6)


    barSvg.selectAll("g").remove();
    barSvg.selectAll(".bar").remove();

    var xScale = d3.scaleBand()
        .range([bar_svg_margin, bar_svg_width-bar_svg_margin])
        .domain(top_six.map(function (d) {
            return d.author;
        }))
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .range([bar_height, 40])
        .domain([0, d3.max(top_six, function (d) {
            return d.count;
        })]);

    barSvg.selectAll(".bar")
        .data(top_six)
        .enter()
        .append("rect")
        .style("fill", "#FFA233")
        .attr("class", "bar")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x", function (d) { return xScale(d.author); })
        .attr("width", xScale.bandwidth())
        .attr("y", function (d) { return yScale(d.count); })
        .attr("height", function (d) {
            return bar_height - bar_svg_margin - yScale(d.count);
        })

}

