let start_time = 20140123183100
let end_time = 20140123183100

function loadWordCloudImage(start, end) {

    var word_svg1 = d3.select('#word_cloud_svg_1');
    var word_svg2 = d3.select('#word_cloud_svg_2');
    var word_svg3 = d3.select('#word_cloud_svg_3');

    logJSONData();


    async function logJSONData() {

        const checked = d3.selectAll("input[type='checkbox']:checked")
            .nodes()
            .map(checkbox => checkbox.value);


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
            const response = await fetch(url, { mode: "no-cors" });
            setImages()

        } catch (error) {
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

            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log(time)
            console.log("showing images")

                word_svg1.select("image").remove()
                word_svg2.select("image").remove()
                word_svg3.select("image").remove()

            word_svg1.append("image")
                    .attr('xlink:href', "wc_images/wc1.png?v=" + new Date().getTime())
                    .attr("width", 360)
                    .attr("height", 360)

                word_svg2.append("image")
                    .attr('xlink:href', "wc_images/wc2.png?v=" + new Date().getTime())
                    .attr("width", 360)
                    .attr("height", 360)

                word_svg3.append("image")
                    .attr('xlink:href', "wc_images/wc3.png?v=" + new Date().getTime())
                    .attr("width", 360)
                    .attr("height", 360)
        }
    }

}