/// Version of LinePlot done with React-Chart.js-v2
import { Box, Typography } from "@mui/material"
import { React, useEffect, useState } from "react";
import { useInput } from "../nodes";
import { Line } from "react-chartjs-2";
import { map, max, min } from "d3";


export default function LineChart() {

    // Bug: One single columned data  ( stream of dependent data w/o independant data )
    //      Is not being correctly mapped and plotted
    const process_data  = (input) => {
        //Create a shallow-copy of the input
        let newObj = input.map(a => { return {...a}} );

        let newData = newObj.map((item) => {
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const element = item[key];
                    if (element != null && element !== undefined) {
                        if (element === "") {
                            item[key] = null;
                        } else if (isNaN(parseFloat(element))) {
                            item[key] = element;
                        } else {
                            item[key] = parseFloat(element);
                        }
                    }
                }
            }
            return item;
        });
        newData.sort(
            function(a,b) {
                return a.x - b.x;
            }
        );
        return newData;
    };

    const [input, inputHndl] = useInput("object","object[]");
    const [loading, setLoading] = useState(true);

    // Default Data
    const [data, setData] = useState({
        datasets:[{
            data:[],
        }]
    });

    // Default Options
    const [config, setConfig] = useState({
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {

                }
            }
        }
    });

    useEffect(() => {

        setLoading(true);

        if(input) {
            setLoading(false);
            // If two columns or more
            const input_data = process_data(input);
            init_plot(input_data);
            console.log(input_data);
            // Else plot data over time ( 1HZ ) ( todo )
        }

    }, [input])

    function init_plot(input_data) {

        // Format Data into Two Columns ( For setData )
        let x_data = [];
        let y_data = [];
        for(let i = 0; i < input_data.length; i += 1) {
            x_data.push(
                Object.values(input_data[i])[0]
            );
            y_data.push({
                y: Object.values(input_data[i])[1]
            })
        }

        // Update With New Data and Config
        setData({
            labels: x_data,
            datasets: [{
                // xAxisID: "time",
                label: "sin/time",
                data: y_data,
                options: {
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                labelString: 'sin',
                                display: true,
                            }
                        }]
                    }
                },
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        });
        // Retroactively updating configs currently does not work
        setConfig({
            type: 'line',
            data: data,
            options: {
                scales: {
                    xAxes: {
                        type: 'linear',
                        min: min(x_data),
                        max: max(x_data),
                        scaleLabel: {
                            display: true,
                            labelString: 'time',
                        }
                    },
                    yAxes: [{
                        type: 'linear',
                        min: min(y_data),
                        max: max(y_data),
                        scaleLabel:{
                            display: true,
                            labelString: 'sin',
                        }
                    }],
                }
            }
        });
    }

    // Draw Node Div
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
                <Typography variant = "h7">Line Plot Node</Typography>
                <Line  options={config.options} data={data}></Line>
            </Box>
        </>
    )
}
