import { Paper } from "@mui/material";
import { WordCloudChart } from "chartjs-chart-wordcloud";
import React, { useRef, useEffect } from "react";
import { useInput } from "../nodes";

// Word Cloud Node that uses input from Histogram
export default function WordCloudNode() {
    const [input, inputHndl, inputType] = useInput("input", ["bins"]);
    const chart = useRef(null);

    const canvasRef = useRef(null);

    //  If the Chart does not yet exist, create it
    useEffect(() => {
        if (inputType) {
            chart.current = new WordCloudChart(canvasRef.current, {
                data: {
                    labels: [],
                    datasets: [],
                },
                options: {
                    element: {
                        words: {
                            maxRotation: 90,
                        },
                    },
                },
            });

            return () => {
                chart.current.destroy();
                chart.current = null;
            };
        }
    }, [inputType]);

    /*  If the Chart has already ben instantiated and we have valid data to
     *   work with, then push the data to the chart and update
     */
    useEffect(() => {
        if (input && chart.current && !(Object.entries(input).length === 0)) {
            // Scale data from valid input ( histogram bins )
            let data_set = Object.values(input).map((d) => 10 + d * 10);

            // Push a new data object to the Chart
            if (!chart.current.data.datasets[0]) {
                chart.current.data.datasets.push({ data: data_set, label: "" });
            } else {
                chart.current.data.datasets[0].data = data_set;
            }

            chart.current.data.labels = Object.keys(input);
            chart.current.update();
        }
    }, [input, inputType]);

    return (
        <>
            {inputHndl}
            <Paper
                sx={{
                    width: 600,
                    height: 600,
                    padding: 2,
                }}
            >
                <canvas className={"nodrag nowheel"} ref={canvasRef} />
            </Paper>
        </>
    );
}
