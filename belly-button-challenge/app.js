const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"


// Read the data from samples.json using D3
function Charts(sample){

    d3.json(url).then((data) => {
        // Extract necessary data
        let samples = data.samples;
        let array_results = samples.filter(sampleObj => sampleObj.id  == sample);
        let results = array_results[0];


        let otu_Ids = results.otu_ids;
        let sample_values = results.sample_values;
        let otu_labels = results.otu_labels;

        

        // Sort the data to get the top 10 OTUs
        let topOtuIds = otu_Ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let topSampleValues = sample_values.slice(0, 10).reverse();
        let topOtuLabels = otu_labels.slice(0, 10).reverse();

        // Create a horizontal bar chart using Plotly
        let trace =[{
            x: topSampleValues,
            y: topOtuIds,
            text: topOtuLabels,
            type: "bar",
            orientation: "h"
        }];

        let layout = {
            title: "Top 10 OTUs Found in the Individual",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" },
            margin: {t: 30 , l:150}
        };

        Plotly.newPlot("bar", trace, layout);


    //Create a bubble chart that displays each sample.
        let bubble_trace =[{
            x : otu_Ids,
            y : sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_Ids, 
                colorscale: "Earth"
            }


        }];

        let layout_2 = {
            title: "Microbaterial",
            margin: {t:30},
            xaxis: {title : 'OTU ID'},
            hovermode: 'closest'

        };
        Plotly.newPlot("bubble", bubble_trace, layout_2)

    });
    }

function metadata(sample){
    d3.json(url).then((data) => {
        // Extract necessary data
        let metadata = data.metadata;
        let array_results = metadata.filter(sampleObj => sampleObj.id  == sample);
        let results = array_results[0];

        let panel = d3.select("#sample-metadata").html("");
        for (key in results){
            panel.append('h6').text(`${key.toUpperCase()}: ${results[key]}`);
        };
    });
}

// Function to update all plots and metadata based on the selected sample
function optionChanged(NewSample) {
    // Update the charts based on the new sample
    Charts(NewSample);
    // Update the metadata based on the new sample
    metadata(NewSample);
}

function init() {
    let selector = d3.select('#selDataset');

    d3.json(url).then((data) => {
        let sampleName = data.names;

        for (let i = 0; i < sampleName.length; i++){
            selector.append('option')
            .text(sampleName[i])
            .property('value', sampleName[i]);
        };

        let firstSample = sampleName[0];
        Charts(firstSample);
        metadata(firstSample)
    });

// Function to update all plots and metadata based on the selected sample
function optionChanged(NewSample){
    Charts(NewSample);
    metadata(NewSample);
}
}

init();