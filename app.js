function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultarray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultarray[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key,value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });    
}
// Build Gauge using function 
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    //console.log(data)
    var samples= data.samples;
    var resultarray= samples.filter(sampleObj => sampleObj.id == sample);
    var result= resultarray[0]
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
    
    //BubbleChart
    var LayoutBubble = {
      title : "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode:"closest",
      margin: { t: 30}
    };
    var Databubble = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        maker:{
          color: ids,
          size: values,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.plot("bubble", Databubble, LayoutBubble);

    //Bar Chart
    var yticks = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()
    var barData =[
      {
        y:yticks,
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
      }
    ]
    
    var barLayout = {
      title: "Top 10 Bacteria Cultures", margin: { t: 30, 1: 150}
    };

    Plotly.newPlot("bar", barData, barLayout);
  })
}
function init() {
  var selector = d3.select('#selDataset');
  d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });
}
  function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
  }

init();