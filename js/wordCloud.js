document.addEventListener('DOMContentLoaded', function () {

    word_svg1 = d3.select('#word_cloud_svg_1');
    word_svg2 = d3.select('#word_cloud_svg_2');
    word_svg3 = d3.select('#word_cloud_svg_3');

    loadWordCloudImage()
});

function loadWordCloudImage() {

    // logJSONData();
    //
    // async function logJSONData() {
    //     const response = await fetch("http://127.0.0.1:5000/wordcloud", {
    //         mode: "no-cors"
    //     });
    //     console.log(response);
    //
    //         word_svg1.append("image")
    //             .attr('xlink:href',"wc_images/wc3-1.png")
    //             .attr("width",360)
    //             .attr("height",360)
    // }

    // word_svg1.append("image")
    //     .attr('xlink:href',"wc_images/wc1.png")
    //     .attr("width",360)
    //     .attr("height",360)
    //
    // word_svg2.append("image")
    //     .attr('xlink:href',"wc_images/wc1.png")
    //     .attr("width",360)
    //     .attr("height",360)
    //
    // word_svg2.append("image")
    //     .attr('xlink:href',"wc_images/wc1.png")
    //     .attr("width",360)
    //     .attr("height",360)

}