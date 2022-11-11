import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import {Card, CardContent} from "@mui/material";
import {useEffect} from "react";
import { useOutput, useInput } from "../nodes";
import { Box, Typography} from "@mui/material";




const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };

const default_labels = null
const default_data = {
  labels: default_labels,
  datasets: [
    {
      label: " Your dataset",
      backgroundColor: Object.values(CHART_COLORS),
      borderColor: Object.values(CHART_COLORS),
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};

export default function Create_Pie_Chart(){
    const [input, inputHandl] = useInput("piechart", "object[]");
    const [data, setOutput, outputHandle] = useOutput("Output", "object[], object", default_data);

    useEffect(() => {
        if(input){
            onFileChange(input); 
        }
    }, [input])

    const onFileChange = (input) => {
        const csv_file = input[0];
        const keys = Object.keys(csv_file)
        const values = Object.values(csv_file)


        const parced_data = {
            labels: keys,
            datasets: [
                { 
                label: "DataSet",
                backgroundColor: Object.values(CHART_COLORS),
                borderColor: Object.values(CHART_COLORS), 
                data: values
                },
            ],
            };
        setOutput(parced_data)
    }

    return(
        <Box
        display="flex"
        flexDirection="column"
        sx={{
            backgroundColor: "white",
            padding: 2,
            borderRadius: 2,
        }}
        >
        <Typography variant="h7"> Input a csv file through a connection</Typography>

            {inputHandl}
            <CardContent>
                <div>
                    <Pie data={data} />
                </div>
            </CardContent>
            {outputHandle}
            


        </Box>
        
    )

}

