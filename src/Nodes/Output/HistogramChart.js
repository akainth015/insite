import { Box, Typography } from "@mui/material"
import { React, useEffect, useState } from "react";
import { useInput, useOutput } from "../nodes";
import { Bar } from "react-chartjs-2";

// provide an output of the histogram that may provide as the input of the wordcloud
export default function HistogramChart() {

    const process_data = (input) => {

        // assume that input is an array of alphanumeric values (strings/nums)
        // if it is an array of objects, do not plot and console type error
        if(typeof(input[0]) === 'object') {
            console.log("TypeError: Histogram input must be an array of strings or numbers.");
            return null;
        }

        const bins = {};
        for(const i of input) {
            bins[i] = bins[i] ? bins[i] + 1 : 1;
        }

        return bins;
    }

    const [input, inputHndl] = useInput("Input",["number[]","string[]"]);
    const [output, setOutput, outputHndl] = useOutput("bins","object");
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState({
        labels:"X",
        datasets:[{
            label:"Y",data:[],
        }]
    });

    const [options, setOptions] = useState({
        type: 'bar',
        options: {
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                },
            },
        },
    });

    useEffect(() => {
        setLoading(true);
        if(input) {
            setLoading(false);
            const input_data = process_data(input);
            if(!(input_data == null)) {
                init_bin(input_data);
                // Return the bins object
                setOutput(input_data);
                // if issues in the future
                // set output as an array of objects rather than a single object
            }
        }
    },[input]);

    function init_bin(input) {

        setData({
            labels: Object.keys(input),
            datasets: [{
                data: Object.values(input),
            }]
        });

        setOptions({
            type: 'bar',
            options: {
                plugins: {
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    y: {
                        display: true,
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    return ( 
        <>
            {inputHndl}
            <Box
                display = "flex"
                flexDirection = "column"
                sx = {{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems: "center",
                    alignTest: "center",
                    minWidth: 500,
                    minHeight: 300,
                }}
            >
                <Typography variant = "h7">Histogram Chart Node</Typography>
                <Bar data={data} options={options}></Bar>
            </Box>
            {outputHndl}
        </>
    )

}
