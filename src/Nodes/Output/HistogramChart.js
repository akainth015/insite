import React, { useEffect, useRef } from "react";
import { useInput, useOutput, useSetting } from "../nodes";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

import { Paper } from "@mui/material";
import ColumnSelect from "../../Components/ColumnSelect";

export default function Histogram() {
    const [input, inputHandle, inputType, niceName] = useInput("Input", ["table", "string[]", "number[]"]);
    const [output, setOutput, outputHndl] = useOutput("output", "bins", {});

    const [column, setColumn] = useSetting("xAxis", null);

    const canvasRef = useRef(null);
    const chart = useRef(null);

    // Create the Histogram Chart if it does not yet exist
    useEffect(() => {
        if (inputType) {
            // noinspection JSValidateTypes
            chart.current = new Chart(canvasRef.current, {
                type: "bar",
                data: {
                    datasets: [
                        {
                            data: [],
                            label: inputType === "table" ? column : niceName,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            return () => {
                chart.current.destroy();
                chart.current = null;
            };
        }
    }, [column, inputType, niceName]);

    /*  If the Histogram Chart has already been instantiated and Input is valid
     *   Scan input into bins accordingly and add to Chart
     *   Set the Output to be Bins ( for any node that might need binned data )
     */
    useEffect(() => {
        if (input && (inputType !== "table" || column) && chart.current) {
            const bins = {};
            const transform = inputType === "table" ? input.map((row) => row[column]) : input;
            transform.forEach((bin) => {
                bins[bin] = bins[bin] ? bins[bin] + 1 : 1;
            });
            chart.current.data.datasets[0].data = Object.values(bins);
            chart.current.data.labels = Object.keys(bins);
            chart.current.update();
            setOutput(bins);
        }
    }, [input, column, inputType]);

    return (
        <>
            {inputHandle}
            <Paper
                sx={{
                    width: 600,
                    padding: 2,
                }}
            >
                {inputType === "table" ? (
                    <ColumnSelect value={column} onChange={setColumn} table={input} multiple={false} />
                ) : null}
                <canvas className={"nodrag nowheel"} ref={canvasRef} />
            </Paper>
            {outputHndl}
        </>
    );
}
