import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Box, CardContent, Typography } from "@mui/material";
import { useInput, useSetting } from "../nodes";
import ColumnSelect from "../../Components/ColumnSelect";

const CHART_COLORS = {
    red: "rgb(255, 99, 132)",
    orange: "rgb(255, 159, 64)",
    yellow: "rgb(255, 205, 86)",
    green: "rgb(75, 192, 192)",
    blue: "rgb(54, 162, 235)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(201, 203, 207)",
};

const defaultLabels = null;
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
const emptyArray = [];

export default function PieChart() {
    var [input, inputHandl, inputType] = useInput("Pie chart", ["table", "string[]"]);
    const [filterColumns, setFilterColumns] = useSetting("filterColumns", emptyArray);
    var [data, setOutput] = useState(defaultData);

    var keys;
    var values;
    var parsedData;

    useEffect(() => {
        if (inputType) {
            switch (inputType) {
                case "table":
                    onTable(input);
                    break;
                case "string[]":
                    onList(input);
                    break;
                default:
                    console.log("Error");
            }
        }
    }, [input, inputType, filterColumns]);

    const onTable = () => {
        if (input) {
            var myMap_2 = new Map();

            for (let i = 0; i < input.length; i++) {
                for (let j = 0; j < filterColumns.length; j++) {
                    if (myMap_2[input[i][filterColumns[j]]]) myMap_2[input[i][filterColumns[j]]]++;
                    else myMap_2[input[i][filterColumns[j]]] = 1;
                }
            }

            keys = Object.keys(myMap_2);
            values = Object.values(myMap_2);

            parsedData = {
                labels: keys,
                datasets: [
                    {
                        label: "DataSet",
                        backgroundColor: Object.values(CHART_COLORS),
                        borderColor: Object.values(CHART_COLORS),
                        data: values,
                    },
                ],
            };
            setOutput(parsedData);
        }
    };

    const onList = (input) => {
        let myMap = new Map();
        for (let i = 0; i < input.length; i++) {
            if (myMap[input[i]]) myMap[input[i]]++;
            else myMap[input[i]] = 1;
        }
        keys = Object.keys(myMap);
        values = Object.values(myMap);

        parsedData = {
            labels: keys,
            datasets: [
                {
                    label: "DataSet",
                    backgroundColor: Object.values(CHART_COLORS),
                    borderColor: Object.values(CHART_COLORS),
                    data: values,
                },
            ],
        };
        setOutput(parsedData);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                backgroundColor: "white",
                padding: 2,
                borderRadius: 2,
            }}
        >
            <ColumnSelect value={filterColumns} onChange={setFilterColumns} table={input} />
            <Typography variant="h7"> Input a CSV file using a connection</Typography>
            <CardContent>
                <div>
                    <Pie data={data} />
                </div>
            </CardContent>
            {inputHandl}
        </Box>
    );
}
