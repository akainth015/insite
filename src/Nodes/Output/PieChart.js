import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import {Card, CardContent} from "@mui/material";
import {useEffect, useState} from "react";
import {useInput } from "../nodes";
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

const defaultLabels = null
const defaultData = {
  labels: defaultLabels,
  datasets: [
    {
      label: " Your dataset",
      backgroundColor: Object.values(CHART_COLORS),
      borderColor: Object.values(CHART_COLORS),
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};

export default function Pie_Chart(){
    const [input, inputHandl] = useInput("Category", ["number[]", "string[]", "string", "number"]);
    const [data, setOutput] = useState(defaultData);

    useEffect(() => {
        if(input){
            onFileChange(input); 
        }
    }, [input])

    const onFileChange = (input) => {
        const csvFile = input[0];
        const keys = Object.keys(csvFile)
        const values = Object.values(csvFile)


        const parsedData = {
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
        setOutput(parsedData)
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
        <Typography variant="h7"> Input a CSV file using a connection</Typography>

            {inputHandl}
            <CardContent>
                <div>
                    <Pie data={data} />
                </div>
            </CardContent>
            


        </Box>
        
    )

}

