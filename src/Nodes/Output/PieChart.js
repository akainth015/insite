import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import {Card, CardContent} from "@mui/material";
import { useState, useEffect} from "react";
import { useOutput } from "../nodes";


const default_labels = ["January", "February", "March", "April", "May", "June"];
const default_data = {
  labels: default_labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(0,0,255)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};

export default function Create_Pie_Chart(){
    const [textInput, TIHandle] = useInput("Text Input", ["text"]);

    const [data, setOutput, outputHandle] = useOutput("Output", "object[], object", default_data);

    const fileReader = new FileReader();
    var data_header;
    var data_percent;
    var parced_data;

    const onFileChange = (e) => {
        const file = e.target.files[0];
        fileReader.onload = function (e) {
            let csv = fileReader.result;
            var lines = csv.split("\n");
            data_header = lines[0].split(",");
            data_percent = lines[1].split(",");

            parced_data = {
                labels: data_header,
                datasets: [
                    {
                    label: "DataSet",
                    backgroundColor: "rgb(5, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: data_percent
                    },
                ],
                };
        setOutput(parced_data)
        console.log(parced_data.datasets[0].data)
        }
        fileReader.readAsText(file);
    }

    return(
        <Card>
            <CardContent>
                <form>
                    <input type="file" id="csvFile" name="csvFile" accept=".csv" onChange={onFileChange}/>
                </form>
                <div>
                    <Pie data={data} />
                </div>
            </CardContent>
            {outputHandle}

        </Card>
        
    )

}

