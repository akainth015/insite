import React, { useEffect, useRef, useState } from "react";
import { useSetting, useStrictInput } from "../nodes";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

import { Paper } from "@mui/material";
import ColumnSelect from "../../Components/ColumnSelect";

export default function LineChart() {
    const [subscribeToInput, inputHandle, inputType, niceName] = useStrictInput("Input", [
        "table",
        "object",
        "number",
        "boolean",
    ]);
    const [subscribeToSeconds, secondsHandle] = useStrictInput("Seconds of History", ["number"]);

    const [input, setInput] = useState(null);
    const [xColumn, setColumn] = useSetting("xAxis", null);

    const canvasRef = useRef(null);
    const chart = useRef(null);
    const updateInterval = useRef(null);
    const secondsRef = useRef(5);

    useEffect(() => {
        if (inputType) {
            let datasets;
            let options;
            switch (inputType) {
                case "table":
                    datasets = [];
                    options = {};
                    break;
                case "object":
                    datasets = [];
                    options = {
                        scales: {
                            x: {
                                // display: false,
                                min: Date.now() - secondsRef.current * 1000,
                                max: Date.now(),
                                type: "time",
                            },
                        },
                    };
                    break;
                case "number":
                case "boolean":
                    datasets = [
                        {
                            data: [],
                            label: niceName,
                        },
                    ];
                    options = {
                        scales: {
                            x: {
                                // display: false,
                                min: Date.now() - secondsRef.current * 1000,
                                max: Date.now(),
                                type: "time",
                            },
                        },
                    };
                    break;
                default:
                    console.error("WTF is happening");
                    break;
            }

            // noinspection JSValidateTypes
            chart.current = new Chart(canvasRef.current, {
                type: "line",
                data: {
                    datasets,
                },
                options,
            });

            let unsubscribe = () => null;
            let unsubscribeFromSeconds = () => null;
            switch (inputType) {
                case "number":
                case "boolean":
                    unsubscribe = subscribeToInput((newValue) => {
                        chart.current.data.datasets[0].data.push({
                            x: Date.now(),
                            y: +newValue,
                        });
                        chart.current.update();
                    });
                    unsubscribeFromSeconds = subscribeToSeconds((newValue) => {
                        secondsRef.current = newValue;
                    });
                    updateInterval.current = setInterval(() => {
                        chart.current.options.scales.x.min = Date.now() - secondsRef.current * 1000;
                        chart.current.options.scales.x.max = Date.now();
                        chart.current.update();
                    }, 1000);
                    break;
                case "object":
                    unsubscribe = subscribeToInput((newValue) => {
                        Object.keys(newValue).forEach((column) => {
                            const ds = chart.current.data.datasets.find((dataset) => dataset.label === column);
                            if (ds) {
                                ds.data.push({
                                    x: Date.now(),
                                    y: +newValue[column],
                                });
                            } else {
                                chart.current.data.datasets.push({
                                    data: [
                                        {
                                            x: Date.now(),
                                            y: +newValue[column],
                                        },
                                    ],
                                    label: column,
                                });
                            }
                        });
                    });
                    unsubscribeFromSeconds = subscribeToSeconds((newValue) => {
                        secondsRef.current = newValue;
                    });
                    updateInterval.current = setInterval(() => {
                        chart.current.options.scales.x.min = Date.now() - secondsRef.current * 1000;
                        chart.current.options.scales.x.max = Date.now();
                        chart.current.update();
                    }, 1000);
                    break;
                default:
                    unsubscribe = subscribeToInput((newValue) => {
                        const columns =
                            (newValue && newValue.columns) ||
                            (newValue && newValue.length > 0 ? Object.keys(newValue[0]) : []);
                        columns.forEach((column) => {
                            const ds = chart.current.data.datasets.find((dataset) => dataset.label === column);
                            if (!ds) {
                                chart.current.data.datasets.push({
                                    data: newValue.map((row) => row[column]),
                                    label: column,
                                });
                            }
                        });
                        chart.current.update();
                        setInput(newValue);
                    });
                    break;
            }

            return () => {
                if (updateInterval.current) {
                    clearInterval(updateInterval.current);
                    updateInterval.current = null;
                }
                unsubscribe();
                unsubscribeFromSeconds();
                chart.current.destroy();
                chart.current = null;
            };
        }
    }, [inputType, niceName, subscribeToInput, subscribeToSeconds]);

    useEffect(() => {
        if (input && xColumn && chart.current) {
            chart.current.data.labels = input.map((row) => row[xColumn]);
            chart.current.update();
        }
    }, [input, xColumn]);

    console.debug(inputType);

    return (
        <>
            {inputHandle}
            {secondsHandle}
            <Paper
                sx={{
                    width: 600,
                    padding: 2,
                }}
            >
                {inputType === "table" ? (
                    <ColumnSelect
                        label={"Select X axis"}
                        value={xColumn}
                        onChange={setColumn}
                        table={input}
                        multiple={false}
                    />
                ) : null}
                <canvas className={"nodrag nowheel"} ref={canvasRef} />
            </Paper>
        </>
    );
}
