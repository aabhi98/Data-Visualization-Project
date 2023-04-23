let start_time = 20140123183100
let end_time = 20140123183100

function loadWordCloudImage(start, end) {

    var word_svg1 = d3.select('#word_cloud_svg_1');
    var word_svg2 = d3.select('#word_cloud_svg_2');
    var word_svg3 = d3.select('#word_cloud_svg_3');

    logJSONData();

    console.log("Draw world cloud")

    async function logJSONData() {

        const checked = d3.selectAll("input[type='checkbox']:checked")
            .nodes()
            .map(checkbox => checkbox.value);

        console.log(checked)

        if (start != null) {
            start_time = start;
        }
        if (end != null) {
           end_time = end;
        }
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

            const data = await response; // parse response as JSON

            // if (response.status === 200) {
                console.log("response ok")
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log(time)
                setImages()
            // } else {
            //     console.log("response not ok")
            //     word_svg1.append("image")
            //         .attr('xlink:href', "wc_images/wc-1.png")
            //         .attr("width", 360)
            //         .attr("height", 360)
            //
            //     word_svg2.append("image")
            //         .attr('xlink:href', "wc_images/wc-2.png")
            //         .attr("width", 360)
            //         .attr("height", 360)
            //
            //     word_svg3.append("image")
            //         .attr('xlink:href', "wc_images/wc-3.png")
            //         .attr("width", 360)
            //         .attr("height", 360)
            // }

        } catch (error) {
            console.log(error)
            console.log("response error")

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


        function setImages(data) {
                word_svg1.append("image")
                    .attr('xlink:href', "wc_images/wc1.png")
                    .attr("width", 360)
                    .attr("height", 360)

                word_svg2.append("image")
                    .attr('xlink:href', "wc_images/wc2.png")
                    .attr("width", 360)
                    .attr("height", 360)

                word_svg3.append("image")
                    .attr('xlink:href', "wc_images/wc3.png")
                    .attr("width", 360)
                    .attr("height", 360)
        }
    }

}