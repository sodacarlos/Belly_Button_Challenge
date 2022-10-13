// Create init function
function init(){
    buildPlot()
}

//Create function for the options
function optionChanged() {
  
    // Build the plot with the new stock
    buildPlot();
  }


//Create a function for the new plot 
function buildPlot(){


    d3.json("samples.json").then((data) =>{
        //Get a list of all the id names
        var idValues = data.names;
  
        // Create the drop down menu by inserting every id name
        idValues.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));


        // Use D3 to select the current ID and store in a variable to work with
        var currentID = d3.selectAll("#selDataset").node().value;
     

        // Filter the data to get related information
        filteredID = data.samples.filter(entry => entry.id == currentID);

        // Create trace for the bar chart
        var trace1 = {
            x: filteredID[0].sample_values.slice(0,10).reverse(),
            y: filteredID[0].otu_ids.slice(0, 10).reverse().map(int => "OTU " + int.toString()),
            text: filteredID[0].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: 'h'
        };
    
      
        // Data
        var dataPlot = [trace1];

        // Layout
        var layout = {
            title : 'OTU samples (Top10) ',
            margin: {
                l: 75,
                r: 100,
                t: 60,
                b: 60
            }

        };

        // Use plotly to create new bar
        Plotly.newPlot("bar", dataPlot, layout);

        // Create the demographics panel
        filteredMeta = data.metadata.filter(entry => entry.id == currentID)
       
        // Create a demographics object for the panel body
        var demographics = {
            'id: ': filteredMeta[0].id,
            'ethnicity: ': filteredMeta[0].ethnicity,
            'gender: ': filteredMeta[0].gender,
            'age: ': filteredMeta[0].age,
            'location: ': filteredMeta[0].location,
            'bbtype: ': filteredMeta[0].bbtype,
            'wfreq: ': filteredMeta[0].wfreq
        }
        // Select the id to append the key value pair under demographics panel
        panelBody = d3.select("#sample-metadata")

        // Remove the current demographic info for new ID
        panelBody.html("")
        
        // Append the key value pairs from demographics into the demographics panel
        Object.entries(demographics).forEach(([key, value]) => {
            panelBody.append('p').attr('style', 'font-weight: bold').text(key + value)
        });

        // Create the trace for bubble chart
        var trace2 ={
            x : filteredID[0].otu_ids,
            y : filteredID[0].sample_values,
            text : filteredID[0].otu_labels,
            mode : 'markers',
            marker: {
                color : filteredID[0].otu_ids,
                size : filteredID[0].sample_values
            }
        }

        var data2 = [trace2]

        // Create the layout for the bubble chart
        var layout2 = {
            title : 'Marker Size',
            showlegend : false, 
        }

        // Plotly
        Plotly.newPlot('bubble', data2, layout2)
        console.log(filteredID)
        gauge()
    });
};

// Run init
init();