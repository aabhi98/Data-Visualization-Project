
bar_svg_width = 400
bar_svg_height = 400
bar_svg_margin = 10
bar_height = 350

let bar_data1 = null
let bar_data2 = null
let bar_data3 = null


// document.addEventListener('DOMContentLoaded', function () {

//     bar_svg1 = d3.select('#bar_chart_svg_1');
//     bar_svg2 = d3.select('#bar_chart_svg_2');
//     bar_svg3 = d3.select('#bar_chart_svg_3');


//     Promise.all([d3.csv('data/final_dataset.csv',(d)=> {
//         return {
//             majorEvent: d.major_event,
//             author: d.author,
//             sentiment: d.sentiment,
//             message: d.message

//         };
//     }),  d3.csv('data/csv-1831-2000.csv',(d)=> {
//         return {
//             majorEvent: d.major_event,
//             author: d.author,
//             sentiment: d.sentiment,
//             message: d.message
//         };
//     }),  d3.csv('data/csv-2001-2131.csv',(d) => {
//         return {
//             majorEvent: d.major_event,
//             author: d.author,
//             sentiment: d.sentiment,
//             message: d.message
//         };
//     })])
//         .then(function (values) {
//             bar_data1 = values[0];

//             bar_data2 = values[1];

//             bar_data3 = values[2];

//             drawBars()
//         });
// });

function drawBarsChanged() {

    if (bar_data1 != null) {
        drawBars(bar_data1, bar_data2, bar_data3)
    }
}


function drawBars(list1, list2, list3) {
    bar_svg1 = d3.select('#bar_chart_svg_1');
    bar_svg2 = d3.select('#bar_chart_svg_2');
    bar_svg3 = d3.select('#bar_chart_svg_3');

    if (list1 != null ) {
        bar_data1 = list1
    }

    if (list2 != null ) {
        bar_data2 = list2
    }
    if (list3 != null ) {
        bar_data3 = list3
    }


    // bar_data1.map(d => {
    //     return {
    //         majorEvent: d.major_event,
    //         author: d.author,
    //         sentiment: d.sentiment,
    //         message: d.message
    //     }
    // })
    // bar_data2.map(d => {
    //     return {
    //         majorEvent: d.major_event,
    //         author: d.author,
    //         sentiment: d.sentiment,
    //         message: d.message
    //     }
    // })
    // bar_data3.map(d => {
    //     return {
    //         majorEvent: d.major_event,
    //         author: d.author,
    //         sentiment: d.sentiment,
    //         message: d.message
    //     }
    // })
    const selectedValue = d3.select('#country-select').property('value');
    if (selectedValue === "tag") {
        drawTagsBarChart(bar_data1, bar_data2, bar_data3);
    } else {
        drawBarChart();
    }
}

function drawBarChart(list1, list2, list3) {
    // console.log(list1, list2, list3)
    const checked = d3.selectAll("input[type='checkbox']:checked")
        .nodes()
        .map(checkbox => checkbox.value);
    filtered_bar_data1 = bar_data1.filter(c => checked.includes(c.major_event));
    filtered_bar_data2 = bar_data2.filter(c => checked.includes(c.major_event));
    filtered_bar_data3 = bar_data3.filter(c => checked.includes(c.major_event));

    drawEachBarChart(filtered_bar_data1, bar_svg1)
    drawEachBarChart(filtered_bar_data2, bar_svg2)
    drawEachBarChart(filtered_bar_data3, bar_svg3)

}

function drawEachBarChart(bar_data, barSvg) {

    var bar_tooltip = d3.select("#bar_chart_div")
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

    const grouped_bar_data = d3.group(bar_data, d => d.author);

    const counts = Array.from(grouped_bar_data, ([author, events, sentiments]) => {
        return {
            author: author,
            count: events.length,
        };
    });

    counts.sort((a, b) => b.count - a.count);

    const list = counts.filter(obj => obj.author !== '');


    top_six = list.slice(0, 6)

    top_six.reverse()


    barSvg.selectAll("g").remove();
    barSvg.selectAll(".bar").remove();
    barSvg.selectAll(".label").remove();

    var yScale = d3.scaleBand()
        .range([bar_svg_height - bar_svg_margin, bar_svg_margin])
        .domain(top_six.map(function (d) {
            return d.author;
        }))
        .padding(0.1);

    var xScale = d3.scaleLinear()
        .range([0, bar_svg_width - bar_svg_margin - 15])
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
        .attr("y", function (d) { return yScale(d.author); })
        .attr("height", yScale.bandwidth())
        .attr("x", bar_svg_margin)
        .attr("width", function (d) {
            return xScale(d.count) - 10;
        })
        .on("mousemove", function (event, d) {
            bar_tooltip.style("left", event.pageX + 10 + "px");
            bar_tooltip.style("top", event.pageY - 50 + "px");
            bar_tooltip.html("Author: " + d.author + "<br>" + "Tweets: " + d.count);
        })
        .on("mouseover", function (event, d) {
            bar_tooltip.transition()
                .duration(200)
                .style("visibility", "visible");
        })
        .on("mouseout", function (d) {
            bar_tooltip.transition()
                .duration(500)
                .style("visibility", "hidden");
        });

    barSvg.selectAll(".label")
        .data(top_six)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function (d) {

            if (xScale(d.count) < bar_svg_width - bar_svg_margin - 50) {
                return xScale(d.count) + 10
            }
            return bar_svg_width - bar_svg_margin - 80;
        })
        .attr("y", function (d) { return yScale(d.author) + yScale.bandwidth() / 2 + 5; })
        .text(function (d) { return d.author; })
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .style("fill", "black")
        .on("mousemove", function (event, d) {
            bar_tooltip.style("left", event.pageX + 10 + "px");
            bar_tooltip.style("top", event.pageY - 50 + "px");
            bar_tooltip.html("Author: " + d.author + "<br>" + "Tweets: " + d.count);
        })
        .on("mouseover", function (event, d) {
            bar_tooltip.transition()
                .duration(200)
                .style("visibility", "visible");
        })
        .on("mouseout", function (d) {
            bar_tooltip.transition()
                .duration(500)
                .style("visibility", "hidden");
        });

}


function drawTagsBarChart(list1, list2, list3) {
    const checked = d3.selectAll("input[type='checkbox']:checked")
        .nodes()
        .map(checkbox => checkbox.value);

    filtered_bar_data1 = list1.filter(c => checked.includes(c.major_event));
    filtered_bar_data2 = list2.filter(c => checked.includes(c.major_event));
    filtered_bar_data3 = list3.filter(c => checked.includes(c.major_event));

    console.log(countTags(filtered_bar_data1))

    drawEachTagChart(countTags(filtered_bar_data1), bar_svg1)
    drawEachTagChart(countTags(filtered_bar_data2), bar_svg2)
    drawEachTagChart(countTags(filtered_bar_data3), bar_svg3)

}


function drawEachTagChart(bar_data, barSvg) {

    var bar_tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    bar_data.sort((a, b) => b.count - a.count);


    top_six_tags = bar_data.slice(0, 6)

    top_six_tags.reverse()

    console.log(top_six_tags)

    barSvg.selectAll("g").remove();
    barSvg.selectAll(".bar").remove();
    barSvg.selectAll(".label").remove();

    var tag_yScale = d3.scaleBand()
        .range([bar_svg_height - bar_svg_margin, bar_svg_margin])
        .domain(top_six_tags.map(function (d) {
            return d.tag;
        }))
        .padding(0.1);

    var tag_xScale = d3.scaleLinear()
        .range([0, bar_svg_width - bar_svg_margin])
        .domain([0, d3.max(top_six_tags, function (d) {
            return d.count;
        })]);

    barSvg.selectAll(".bar")
        .data(top_six_tags)
        .enter()
        .append("rect")
        .style("fill", "#FFA233")
        .attr("class", "bar")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("y", function (d) { return tag_yScale(d.tag); })
        .attr("height", tag_yScale.bandwidth())
        .attr("x", bar_svg_margin)
        .attr("width", function (d) { return tag_xScale(d.count) - 10; })
        .on("mousemove", function (event, d) {
            bar_tooltip.style("left", event.pageX + 10 + "px");
            bar_tooltip.style("top", event.pageY - 50 + "px");
            bar_tooltip.style("display", "inline-block");
            bar_tooltip.html("Tag: " + d.tag + "<br>" + "Tweets: " + d.count);
        })
        .on("mouseover", function (event, d) {
            bar_tooltip.transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseout", function (d) {
            bar_tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    barSvg.selectAll(".label")
        .data(top_six_tags)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function (d) {

            if (tag_xScale(d.count) < bar_svg_width - bar_svg_margin - 50) {
                return tag_xScale(d.count) + 10
            }
            return bar_svg_width - bar_svg_margin - 80;
        })
        .attr("y", function (d) { return tag_yScale(d.tag) + tag_yScale.bandwidth() / 2 + 5; })
        .text(function (d) { return d.tag; })
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .style("fill", "black")
        .on("mousemove", function (event, d) {
            bar_tooltip.style("left", event.pageX + 10 + "px");
            bar_tooltip.style("top", event.pageY - 50 + "px");
            bar_tooltip.style("display", "inline-block");
            bar_tooltip.html("Tag: " + d.tag + "<br>" + "Tweets: " + d.count);
        })
        .on("mouseover", function (event, d) {
            bar_tooltip.transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseout", function (d) {
            bar_tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

}

function countTags(data) {
    const tagCounts = {};

    data.forEach(item => {
        const message = item.message;
        if (message) {
            const tags = message.match(/#\w+/g);

            if (tags) {
                tags.forEach(tag => {
                    if (tagCounts[tag]) {
                        tagCounts[tag]++;
                    } else {
                        tagCounts[tag] = 1;
                    }
                });
            }
        }
    });

    return Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));
}

function resetBarGraph() {
    list = [d3.select('#bar_chart_svg_1').node(), d3.select('#bar_chart_svg_2').node(), d3.select('#bar_chart_svg_3').node()]
    for(let ele of list) {
        barSvg = d3.select(ele)
        barSvg.selectAll("g").remove();
        barSvg.selectAll(".bar").remove();
        barSvg.selectAll(".label").remove();
    }
}