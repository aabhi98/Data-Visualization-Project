document.addEventListener('DOMContentLoaded', function () {

    word_svg1 = d3.select('#word_cloud_svg_1');
    word_svg2 = d3.select('#word_cloud_svg_2');
    word_svg3 = d3.select('#word_cloud_svg_3');


    Promise.all([d3.csv('data/csv-1700-1830.csv', (d) => {
        return {
            message: d.message,
            majorEvent: d.major_event,
            sentiment: d.sentiment
        };
    })])
        .then(function (values) {
            console.log('loaded dataset');
            data1 = values[0];

            loadWordCloudImage()

        });

});

function loadWordCloudImage() {

    logJSONData();

    console.log("Draw world cloud")

    async function logJSONData() {

        const checked = d3.selectAll("input[type='checkbox']:checked")
            .nodes()
            .map(checkbox => checkbox.value);

        console.log(checked)

        start_time = 20140123184900;
        end_time = 20140123192843;
        const url = new URL("http://127.0.0.1:80/wordcloud");
        url.searchParams.append("param1", start_time);
        url.searchParams.append("param2", end_time);

        url.searchParams.append("fire", checked.includes("fire"));
        url.searchParams.append("hit", checked.includes("hit_and_run"));
        url.searchParams.append("pok", checked.includes("pok_rally"));

        try {
            const response = await fetch(url, {
                mode: "no-cors"
            });

            word_svg1.append("image")
                .attr('xlink:href', "wc_images/wc-1.png")
                .attr("width", 360)
                .attr("height", 360)

            word_svg2.append("image")
                .attr('xlink:href', "wc_images/wc-2.png")
                .attr("width", 360)
                .attr("height", 360)

            word_svg3.append("image")
                .attr('xlink:href', "wc_images/wc-3.png")
                .attr("width", 360)
                .attr("height", 360)

        } catch (error) {
            console.log(`Connection refused error: ${error.message}`);

            word_svg1.append("image")
                .attr('xlink:href', "wc_images/wc-1.png")
                .attr("width", 360)
                .attr("height", 360)

            word_svg2.append("image")
                .attr('xlink:href', "wc_images/wc-2.png")
                .attr("width", 360)
                .attr("height", 360)

            word_svg3.append("image")
                .attr('xlink:href', "wc_images/wc-3.png")
                .attr("width", 360)
                .attr("height", 360)
        }

    }

}